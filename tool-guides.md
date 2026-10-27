[知識庫首頁](https://released.github.io/) · [RH850 Bootloader](index.html)

<a id="article_top"></a>

# Tool 操作與通訊驗證入口

共用 ISP Tool、更新報告、Custom Transfer 與操作章節的連結。

## 共用 Tool 操作

| 目的 | 說明位置 |
| --- | --- |
| Tool 與 host 韌體 | [下載入口](../slide_isp_tool_for_RL78/downloads.html) |
| COM 與 MCU host 識別 | [連線與操作](../slide_isp_tool_for_RL78/operation.html) |
| CAN／CAN FD 更新 | [CAN 更新操作](../slide_isp_tool_for_RL78/can-update.html) |
| UART／Xmodem／I2C 更新 | [串列操作](../slide_isp_tool_for_RL78/serial-isp.html) |
| BIN／LIVE、完成狀態與報告 | [欄位與更新報告](../slide_isp_tool_for_RL78/status-and-reports.html) |
| CAN Custom Transfer | [通訊驗證](../slide_isp_tool_for_RL78/custom-transfer.html) |

CAN Transfer 使用對應模式的獨立 Transfer 映像，選 Custom Transfer → Discover Test Target → Transfer Test；不載入 App BIN。
Device 的實體 CAN port 由接線與編譯設定決定，見 [EVM 與 CAN port](can-device.html#rh850-evm-can-ports)。

UART／Xmodem／I2C 的 Boot、App、Transfer 各自是單一資料介面工程，另保留文字 Log；配置見 [串列工程](serial-device.html)。
App 更新使用該 App 封裝的 <code>*_update.bin</code>；燒錄器安裝檔與更新 BIN 的用途見 [建置產物](app-development.html#rh850-build-products)。


---

[上一主題：映像、Metadata 與 CAN 封包參考](reference.html) · [指南入口](index.html)
