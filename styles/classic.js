// The original Versus look. This is the fallback style, so it defines EVERY token;
// other styles may define any subset and inherit the rest from here.
VERSUS.registerStyle("classic", {
  id: "classic",
  name: "Classic",
  colors: {
    paper: "#E7ECF1",
    paperGlow: "#EFF3F7",
    panel: "#FFFFFF",
    ink: "#192bd0",
    muted: "#363488",
    faint: "#8C99A6",
    line: "#D2DAE3",
    lineStrong: "#BCC6D1",
    primary: "#22456A",
    primaryInk: "#17324E",
    primarySoft: "#E4EBF2",
    onPrimary: "#FFFFFF",
    accent: "#e12814",
    accentDeep: "#ed0c0c",
    accentSoft: "#FBEEDA",
    titlePurple: "#6B21A8",
    questionTeal: "#0F766E",
    doneWash: "#F2F5F8",
    err: "#B23A48"
  },
  fonts: {
    sans: '"Inter",system-ui,-apple-system,sans-serif',
    display: '"Bricolage Grotesque","Inter",system-ui,sans-serif',
    serif: '"Playfair Display",Georgia,"Times New Roman",serif',
    mono: '"JetBrains Mono",ui-monospace,SFMono-Regular,Menlo,monospace'
  },
  sizes: {
    title: "42px",
    question: "32px",
    lede: "15px",
    label: "13px",
    input: "15.5px",
    btn: "14.5px",
    option: "20px",
    item: "17px",
    resultsTitle: "26px",
    meta: "13px",
    fine: "12.5px"
  },
  googleFonts: [
    "Bricolage+Grotesque:opsz,wght@12..96,400..800",
    "Inter:wght@400;450;500;600",
    "JetBrains+Mono:wght@400;500;700",
    "Playfair+Display:ital,wght@0,500..800;1,500..800"
  ]
});
