# RH850 Bootloader guide maintenance

Read /web/AGENTS.md, PUBLIC_CONTENT_GUIDELINES_zh-TW.md and README.md first.
The shared public-writing policy applies to this site and future chapters.

- This guide owns RH850 Device Boot/App, Metadata/IRQ, Flash/porting and format
  examples. RL78 keeps its independent guide; Tool operation stays on the ISP site.
- Canonical sources live in the Tool docs. sync_rh850_device.ps1 projects them
  using sync_rh850_guides.mjs and web_guide_layout.json. Do not hand-edit generated
  chapter bodies or replace explicit anchors. Full topics have one chapter owner.
- Update source/report provenance and links together. Timing uses actual input_bytes
  and elapsed_ms, never the previously installed image size or an extrapolation.
- Preserve report result/counter details in portable summaries. No personal paths,
  invented repository URLs, development conversations, milestones or release pins.
- Use RH850 EIINT indexes and independent EBASE/INTBP tables. Check concrete
  Flash/RAM addresses and FCL RAM requirements against this project's sources.
- Source comments are English; firmware remains C90. Documentation-only changes
  do not authorize firmware behavior changes, board access, Git push or deployment.
- RL78 is the reader-topic baseline. Keep matching titles/order,60 mapped topics,
  platform specification tables and direct timing links using the shared Tool
  contract/navigation module. Use the same RL78 HTML/CSS theme;do not fork styles.
- Run scripts/verify_local.ps1 and actual desktop/narrow browser checks. Rebuild
  affected existing PDFs and visually review their changed pages.
