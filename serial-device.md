[知識庫首頁](https://released.github.io/) · [RH850 Bootloader](index.html)

<a id="article_top"></a>

# UART／Xmodem／I2C device 工程

獨立串列工程、資料／Log 介面與 IRQ／回覆完成邊界。

<!-- RH850_SERIAL_CHAPTER_BEGIN -->
本文件記錄 R7F701684 EVM 的獨立 UART／Xmodem／I2C Boot、App、Transfer 工程。
來源與離線建置、程式模型可分別核對；實體訊號、中斷時序、Flash 擦寫與啟動結果仍需實板驗證。

## RH850 文件入口

| 目的 | 說明位置 |
| --- | --- |
| Classical CAN／CAN FD、CAN port 與接收資源 | [CAN device 工程](can-device.html) |
| UART／Xmodem／I2C、獨立 Log 與串列主迴圈 | 本文件 |
| Tool 操作、完成提示與更新報告 | [串列操作](../slide_isp_tool_for_RL78/serial-isp.html)、[共用操作](../slide_isp_tool_for_RL78/operation.html) |
| 格式欄位與通訊封包 | [串列工程配置](../slide_boot_loader_for_RL78/serial-device.html)；實際地址與 IRQ 使用本文件配置 |

各介面都有獨立 Boot／App／Transfer 工程。
共用格式與操作透過上方連結查閱，平台地址、腳位與中斷配置集中在各自工程章節。

## 專案與目錄

下列 Boot／App／Transfer 各自包含來源碼、設定與建置工具，可獨立編譯。
每個介面使用自己的工程與映像契約；搭配安裝的 Boot／App 保持相容設定。
目錄與使用者入口見 [工程目錄與程式入口](porting.html#rh850-project-entry)。

| 介面 | Boot | App | Custom Transfer |
| --- | --- | --- | --- |
| UART ISP | Sample_Project_RH850_S1_ISP_Boot_loader_UART | Boot 名稱加 `_app` | Sample_Project_RH850_S1_UART_Transfer |
| XMODEM-CRC128 | Sample_Project_RH850_S1_ISP_Boot_loader_Xmodem | Boot 名稱加 `_app` | Sample_Project_RH850_S1_Xmodem_Transfer |
| I2C ISP | Sample_Project_RH850_S1_ISP_Boot_loader_I2C | Boot 名稱加 `_app` | Sample_Project_RH850_S1_I2C_Slave_Transfer |

Transfer 是以燒錄器安裝的獨立診斷程式，不是 App 更新 BIN。
診斷路徑不擦寫 Flash；Xmodem Transfer 使用 command24 接收串流並核對 CRC32。

## 接線與時脈

| 用途 | MCU 周邊／腳位 | 設定 | EIINT channel |
| --- | --- | --- | --- |
| UART／Xmodem 資料 | RLIN31 TX P0_5、RX P0_4 | 115200、8-N-1 | RX122、Error123 |
| I2C 資料 | RIIC1 SCL P8_1、SDA P8_0 | 7-bit address0x20、100kHz | TX240、Event241、RX242；TEI243 保持遮罩 |
| 獨立文字 Log | RLIN30 TX P10_10、RX P10_9 | 115200、8-N-1；接收 IRQ 遮罩 | 不使用資料介面接收 |
| 系統 tick | OSTM0 | 1ms | 84 |
| 系統時脈 | 外部16MHz／PLL | CPU120MHz | App 檢查 Boot 交接時脈 |

UART 與 I2C 腳位依選定 SDK 範例的初始化程式配置。
連到 bridge 前仍需核對 EVM 接頭、電壓、共地與 I2C 上拉。
診斷 UART 不接到二進位 ISP 資料鏈路。

UART建置以 `validate_serial_settings.ps1` 比對INFO／metadata baud與該工程SC產生的採樣、prescaler及LBRP。
執行時另核對實際UART暫存器計算的baud誤差，EVM的RLIN source為40MHz。
變更速率時同步調整配對Boot／App的SC與 `isp_transport_config.h`；不變更獨立文字Log設定。

## Flash／IRQ 與 RAM 執行

各串列工程採64 KiB Boot、App起點0x10000、256-byte Metadata 與完整512-entry INTBP。
位址表、FCL RAM 執行及交接契約集中於 [Flash／移植](porting.html#rh850-flash-layout)。
App 的 C header、EIINT mapping、產表與建置步驟見 [App 開發](app-development.html#rh850-app-editing)。

<a id="rh850-serial-runtime"></a>

## UART／I2C 中斷與完成邊界

UART RX IRQ 只放入512-slot RAM ring（511bytes 可用），滿時丟棄新資料並計數。
Error IRQ 清除錯誤並計數；protocol、CRC、Flash 與 Log 都在 main loop。
TX 在主迴圈有界等待最後一個字元傳完後，才執行 ENTER／END 後續動作。

RIIC RX／TX／Event ISR 只移動 mailbox bytes 與狀態。
請求以 STOP 分界；回覆是111-byte read window，短讀保留回覆。
Event IRQ 的優先序高於 byte IRQ，STOP 與末筆 RX 同時待處理時先收下該筆資料。
NACK 保留到 STOP 後才清除，其間遮罩 NACK 中斷，不在 ISR 等待 STOP。
回覆完成判斷扣除仍在 DRT 的預載資料；無法證明完整 read 時不允許重啟。

```mermaid
flowchart LR
    subgraph RECEIVE["接收與命令處理"]
        direction TB
        RX["資料接收 IRQ"] --> QUEUE["UART ring / I2C mailbox"]
        QUEUE --> MAIN["RuntimePoll / CRC / sequence"]
        MAIN --> GATE["角色權限 / metadata / 版本 / 範圍"]
        GATE --> EXEC["Boot: Flash page / END 檢查<br/>App 或 Transfer: INFO / 診斷"]
    end
    subgraph REPLY["回覆與後續動作"]
        direction TB
        SEND["傳送命令結果 / 錯誤狀態"] --> DONE{"完整回覆已送完?"}
        DONE -->|否| WAIT["保留待完成動作<br/>主迴圈再次檢查"]
        WAIT --> DONE
        DONE -->|是| ACTION["僅執行已接受命令的後續動作"]
    end
    RECEIVE --> REPLY
```

ISR 不解析 ISP 命令、不呼叫 Flash，也不輸出 Log。
App 的 ready 回覆須已觀察到系統 tick；獨立 Transfer 不宣告已安裝 App 或 Flash 分區。
UART／Xmodem App與Transfer提供能力bit6／command0x25的接收錯誤、queue drop、TX timeout及queue快照；
完整byte欄位集中於[串列診斷格式](../slide_boot_loader_for_RL78/serial-device.html#serial-uart-diagnostics)，Tool判讀亦沿用該文件連結的操作章節。

### Xmodem 串流完成

Boot 使用串流寫入及完整映像檢查；App／Transfer 的 command24 只接收資料並核對 CRC32。
128-byte block 的 CRC16、順序、重送與末塊填充由接收器核對。

```mermaid
flowchart LR
    subgraph STREAM["串流與完整性"]
        direction TB
        START["接受 START 或診斷串流命令"] --> BLOCK["C / XMODEM-CRC128<br/>block CRC16 / 順序 / 精確重送"]
        BLOCK --> MORE{"資料已收齊?"}
        MORE -->|否| BLOCK
        MORE -->|是| VALID{"EOT / 完整 CRC32 通過?"}
        VALID -->|否| CANCEL["取消串流 / 不重啟"]
        VALID -->|是| READY["可回覆最終 ACK"]
    end
    subgraph COMPLETE["最終回覆與交接"]
        direction TB
        ACK["傳送最終 ACK"] --> SENT{"傳送成功且完整送完?"}
        SENT -->|否| HOLD["不執行待重啟動作"]
        SENT -->|是| ROLE{"Boot 更新?"}
        ROLE -->|是| RESET["重啟 / 再次驗證 / App"]
        ROLE -->|否| FRAMED["回到診斷封包模式"]
    end
    STREAM -->|驗證成功| COMPLETE
```

最終 ACK 傳送失敗時不自動重啟，也不重複寫入來推定更新結果。
Tool 的 ACK 接收結果與 device 完整傳送是不同觀察點；線路中斷仍需由重連及映像狀態確認。

RIIC 暫存器與上述順序依 [RH850/F1KH、F1KM 硬體手冊](https://in.element14.com/wcsstore/ExtendedSitesCatalogAssetStore/cms/asset/pdf/common/renesas-automotive/rh850-users-manual.pdf) 第23章核對，特別是23.3.15、23.4、23.5.5。

## 建置與檔案使用

在任一工程目錄以 PowerShell 執行：

```powershell
.\build.ps1
```

預設只建置該工程。
在所選工程根目錄執行 `build.ps1`，只建置該工程並執行本機 pre/post-build 檢查。
使用已安裝的 CS+／CC-RH 與 PowerShell，不需額外的 Python 或 JSON 編輯環境。

工程保留所選 UART／RIIC 的 Smart Configurator component；建置使用受控的 clock、system／IRQ projection。
重新產生 SC 原始碼後，核對獨立 Log、資料腳位與時脈設定，再執行同一份建置檢查。

<a id="rh850-serial-sc-roundtrip"></a>

### Smart Configurator 重新產生與建置

1. 保存工程設定及 App 的兩份 C header；由本工程 `.scfg` 開啟 Smart Configurator。
2. 核對 device 為 R7F701684、外部晶振16MHz。資料介面選用 Config_UART1 或 Config_RIIC1，另保留 Config_UART0、Config_OSTM0 與 Config_TAUJ0_0。
3. 執行 Generate Code，保存 SC 產生結果。既有 user-code 區保留對應 callback；資料 ISP adapter 不置於產生檔中。
4. 在該工程執行 `build.ps1`，或在已設定 hooks 的 CS+ 工程執行 Rebuild。建置會由最新 SC 來源產生受控 clock、timer／system 與完整 IRQ table，不自動重設使用者 `.scfg`。
5. 核對建置後檢查成功；App 另開啟 `app_build_report.html`，確認 metadata、CRC、512項 IRQ 與實際 BIN。App-only 變更不重建 Boot。
6. 上板時確認資料傳輸、診斷 Log、tick、中斷及重啟；離線建置通過不代表這些硬體動作已驗證。

| 可編輯來源 | 建置衍生結果 | 核對重點 |
| --- | --- | --- |
| `.scfg`／SC user-code 區 | `src/smc_gen` | 選定周邊與 pin 設定 |
| SC clock／system／timer 來源 | `generated_projection` 的受控 C 檔 | Boot 時脈設定、App 繼承檢查、timer ISR 無重複 channel 所有權 |
| `app_irq_handlers.h` | 完整512-entry IRQ table | 使用 EIINT channel；編譯後目的地與 C header 相符 |
| `app_image_config.h`／共用工程契約 | identity、metadata、更新 BIN、HTML | 編輯值與實際連結映像一致 |

### 建置訊息

| 訊息 | 來源與處理 |
| --- | --- |
| `W0520550` 未使用狀態 | 角色專用變數依 Boot／App／Transfer 分開宣告；目前九工程不再出現這類警告 |
| `W0561322` `.text` alignment mismatch | 專案輸入採4-byte 對齊，原廠預編譯 C library 採2-byte。最終 `.text` 仍以4-byte 連結；保留診斷，未修改 library 或關閉警告 |
| `W0561017` CC-RH 授權 | 由目前編譯環境的授權狀態產生；依正式 CC-RH 授權配置處理。不是 firmware 功能警告，也不表示零警告建置 |

| 產物 | 用途 |
| --- | --- |
| Boot DefaultBuild/boot0000_FFFF.hex | 燒錄器安裝 Boot |
| App DefaultBuild/專案名稱_update.bin | Tool 對 device 更新 App |
| App DefaultBuild/app_build_report.html | 實際 BIN、CRC、metadata／IRQ 的建置結果 |
| Transfer DefaultBuild/專案名稱.hex | 燒錄器安裝獨立 Transfer 測試程式 |

Tool 使用 UART／Xmodem 或 I2C 的對應 Workflow。
操作步驟及訊息說明見[串列 ISP 操作](../slide_isp_tool_for_RL78/serial-isp.html)，欄位定義見[串列工程配置](../slide_boot_loader_for_RL78/serial-device.html)。
這兩份共用操作指南中的 RL78 容量、IRQ 位址與腳位表不代替本文件的 RH850 配置。

## 離線檢查與實板範圍

`test_rh850_isp.ps1` 使用實際 App BIN、C 引擎／Flash page adapter／映像驗證器及 Tool client，核對完整960KiB、512-entry table、CRC／replay／失敗後不得 reset 等條件。
`test_rh850_isp_runtime.ps1` 直接編譯實際 `RuntimePoll`、角色設定與 Flash／串流 adapter，分別測試三介面的 Boot／App／Transfer。
測試包含分段／損壞封包、精確重送、ready、角色權限、最終回覆完成及傳送失敗；Xmodem 診斷另涵蓋短尾、block wrap、CRC16 重試、完整 CRC32、取消與 timeout。
`test_rh850_isp_hal.ps1` 使用實際 ISR adapter 與模擬暫存器，核對 queue／NACK／STOP／短讀；它不模擬電氣波形與硬體時序。

`test_rh850_scfg_roundtrip.ps1` 在隔離副本呼叫已安裝的 Smart Configurator 重新產生原始碼，再建置及核對映像／RAM／IRQ；不以手工複製來源取代 SC 產生動作。
完成後比較原工程來源與 App-only Boot 交付檔雜湊，將設定檢查、實際產生、連結結果及硬體結果分開記錄。

實板後續核對 UART、Xmodem、I2C 的 Discover、Transfer、Enter Boot、App 更新與重連。
另外確認 FCL RAM 執行、獨立 Log、IRQ 持續運作、中斷／斷電與復原行為。
<!-- RH850_SERIAL_CHAPTER_END -->

---

[上一主題：App Metadata、IRQ 與更新耗時](app-development.html) · [指南入口](index.html) · [下一主題：Boot／App 移植與 Flash](porting.html)
