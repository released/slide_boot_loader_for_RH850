# RH850 Bootloader 實作指南

[App BIN 更新耗時比較](app-development.html#rh850-update-timing) 提供CAN FD各BIN大小的實測時間。

網頁入口為 `index.html`；每個主題有自己的 Markdown、網頁與目錄。
內容以 R7F701684 EVM 的獨立 Boot／App／Custom Transfer 工程為例，涵蓋 Classical CAN、CAN FD 與串列 ISP。
工程使用 C header、CS+／CC-RH 與 Windows PowerShell；讀者不需要安裝文件產生工具。

| 主題 | 內容 |
| --- | --- |
| [CAN device 工程](can-device.html) | EVM、CAN1／CAN4、CAN RAM、更新 owner 與啟動流程 |
| [App Metadata、IRQ 與更新耗時](app-development.html) | App 發行設定、Metadata、512-entry IRQ table、建置及實測更新時間 |
| [串列 device 工程](serial-device.html) | UART／Xmodem／I2C、獨立 Log、資料接收及回覆完成邊界 |
| [移植與 Flash](porting.html) | Flash／RAM mapping、HAL／custom_func、FCL RAM 執行與交接 |
| [格式參考](reference.html) | Metadata 全部256 bytes、位址換算與 CAN frame |
| [Tool 操作入口](tool-guides.html) | 共用 ISP 操作、Custom Transfer、完成確認與更新報告 |

[RL78 Bootloader](../slide_boot_loader_for_RL78/) 保留 RL78 工程的獨立說明。
每頁的「本頁主題」提供同一章節的RL78跳轉；六個章節及60項對照主題使用共用導覽定義，數值與程式以本平台為準。
跨平台的 Tool 連線、操作與報告集中於 [ISP Tool 指南](../slide_simple_renesas_isp_tool/)。

## 來源與維護

編寫依據為 [共用公開文件準則](PUBLIC_CONTENT_GUIDELINES_zh-TW.md)。
章節原稿位於 Tool 的 `docs/RH850_*`；`scripts/sync_rh850_device.ps1` 同步完整章節及其他指南的短連結。
`-WebRoot` 指定網站 checkout 的父目錄，`-CheckOnly` 為唯讀核對。
維護者的網頁產生流程沿用 Node 與既有 renderer，不影響 MCU 的建置環境。

量測摘要保留來源報告檔名、SHA256、實際輸入大小、分階段與總耗時，以及完成／診斷結果。
Metadata bytes 範例與更新耗時的輸入分別標示來源；工程 BIN 範例不作為其他容量的量測結果。
維護來源為 `docs/data/rh850_update_timing` 與 `docs/data/rh850_image_example.json`，網站副本位於 `data`。
需要更新 bytes 範例時，維護者以 `FIRMWARE_RH850_FD_APP_PROJECT` 指向既有 FD App 工程；未指定時使用保存的範例快照。

共用樣式與 Markdown／Mermaid renderer 使用 `/notices_can/assets/`。
`guide-map.json`／`guide-routes.js` 維護穩定章節網址；標題調整時保留既有 anchor。
`scripts/verify_local.ps1` 執行網站檔案、連結與主題檢查；瀏覽器與 PDF 的視覺檢查另行記錄。
