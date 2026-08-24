// "Ledger" — the Priorities identity. Cool ink-wash paper, one serif family
// (SIL's Gentium Plus) everywhere, a single vermilion accent reserved for
// judgements. This is the fallback style, so it defines EVERY token.
VERSUS.registerStyle("ledger", {
  id: "ledger",
  name: "Ledger",
  colors: {
    paper: "#F3F5F7",
    paperGlow: "#F3F5F7",
    panel: "#FAFBFC",
    ink: "#1E2A36",
    muted: "#51616F",
    faint: "#93A1AD",
    line: "#CBD4DB",
    lineStrong: "#9FACB8",
    primary: "#1E2A36",
    primaryInk: "#2C3B49",
    primarySoft: "#E2E8ED",
    onPrimary: "#F3F5F7",
    accent: "#BE4229",
    accentDeep: "#97331F",
    accentSoft: "#F4DED7",
    titlePurple: "#1E2A36",
    questionTeal: "#1E2A36",
    doneWash: "#EBEEF1",
    err: "#BE4229"
  },
  fonts: {
    sans: '"Gentium Plus",Gentium,Georgia,"Times New Roman",serif',
    display: '"Gentium Plus",Gentium,Georgia,"Times New Roman",serif',
    serif: '"Gentium Plus",Gentium,Georgia,"Times New Roman",serif',
    mono: '"Gentium Plus",Gentium,Georgia,"Times New Roman",serif'
  },
  sizes: {
    title: "24px",
    question: "40px",
    lede: "16px",
    label: "14px",
    input: "19px",
    btn: "18px",
    option: "32px",
    item: "20px",
    resultsTitle: "34px",
    meta: "14px",
    fine: "15px"
  },
  googleFonts: [
    "Gentium+Plus:ital,wght@0,400;0,700;1,400;1,700"
  ]
});
