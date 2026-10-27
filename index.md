<!-- GUIDE_OVERVIEW -->
[知識庫首頁](https://released.github.io/) · [RL78 Bootloader](../slide_boot_loader_for_RL78/)

<a id="article_top"></a>

# RH850 Bootloader 實作指南

RH850 MCU device 的 Boot／App、Metadata、IRQ 與 Flash 開發依閱讀目的分章。
本頁範例使用 R7F701684 EVM；日常更新操作集中於 [ISP Tool 指南](../slide_isp_tool_for_RL78/)。

## 主題指南

| 主題 | 內容 |
| --- | --- |
| [Classical CAN／CAN FD device 工程](can-device.html) | EVM、CAN port、接收資源、更新 owner 與 Boot 啟動流程。 |
| [App Metadata、IRQ 與更新耗時](app-development.html) | C header 編輯、512-entry IRQ table、建置產物及 CAN FD 實測時間。 |
| [UART／Xmodem／I2C device 工程](serial-device.html) | 獨立串列工程、資料／Log 介面與 IRQ／回覆完成邊界。 |
| [Boot／App 移植與 Flash](porting.html) | 位址、HAL 入口、FCL RAM 執行、startup 與映像交接。 |
| [映像、Metadata 與 CAN 封包參考](reference.html) | RH850 位址、256-byte Metadata 範例、8-byte control 與 raw data。 |
| [Tool 操作與通訊驗證入口](tool-guides.html) | 共用 ISP Tool、更新報告、Custom Transfer 與操作章節的連結。 |

## CAN 範例分類

| 類別 | 工程與用途 |
| --- | --- |
| Classical CAN | [Boot／App 與 CAN1／CAN4](can-device.html#rh850-can-device) |
| CAN FD | [500K／2M、BRS 與64-byte 資料幀](reference.html#rh850-can-frames) |
| Custom Transfer | [獨立通訊驗證與操作](tool-guides.html) |
