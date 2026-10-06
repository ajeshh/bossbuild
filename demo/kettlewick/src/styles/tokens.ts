// Generated from docs/design/tokens.json by scripts/tokens.js. Never edit by hand.
// `tokens` is what components style with (CSS custom properties); `values` is the raw value, for
// the rare place a property can't take a var (a media query, a canvas).
export const tokens = {
  "color": {
    "surface": {
      "ground": "var(--color-surface-ground)",
      "paper": "var(--color-surface-paper)",
      "raised": "var(--color-surface-raised)"
    },
    "text": {
      "body": "var(--color-text-body)",
      "muted": "var(--color-text-muted)",
      "on-primary": "var(--color-text-on-primary)",
      "on-danger": "var(--color-text-on-danger)"
    },
    "action": {
      "primary": "var(--color-action-primary)",
      "primary-hover": "var(--color-action-primary-hover)",
      "danger": "var(--color-action-danger)"
    },
    "signal": {
      "uncovered": "var(--color-signal-uncovered)",
      "asked": "var(--color-signal-asked)",
      "covered": "var(--color-signal-covered)"
    },
    "border": {
      "default": "var(--color-border-default)",
      "subtle": "var(--color-border-subtle)"
    },
    "gray": {
      "100": "var(--color-gray-100)",
      "300": "var(--color-gray-300)",
      "500": "var(--color-gray-500)",
      "900": "var(--color-gray-900)"
    }
  },
  "font": {
    "display": "var(--font-display)",
    "body": "var(--font-body)",
    "mono": "var(--font-mono)"
  },
  "type": {
    "size": {
      "display": "var(--type-size-display)",
      "heading": "var(--type-size-heading)",
      "body": "var(--type-size-body)",
      "small": "var(--type-size-small)",
      "label": "var(--type-size-label)"
    }
  },
  "space": {
    "1": "var(--space-1)",
    "2": "var(--space-2)",
    "3": "var(--space-3)",
    "4": "var(--space-4)",
    "6": "var(--space-6)",
    "8": "var(--space-8)"
  },
  "radius": {
    "control": "var(--radius-control)",
    "surface": "var(--radius-surface)"
  },
  "shadow": {
    "raised": "var(--shadow-raised)"
  },
  "breakpoint": {
    "phone": "var(--breakpoint-phone)",
    "laptop": "var(--breakpoint-laptop)"
  },
  "target": {
    "min": "var(--target-min)"
  },
  "z-index": {
    "sticky": "var(--z-index-sticky)",
    "overlay": "var(--z-index-overlay)",
    "toast": "var(--z-index-toast)"
  }
} as const;

export const values = {
  "color": {
    "surface": {
      "ground": "#F3ECE1",
      "paper": "#FFFBF4",
      "raised": "#FFFFFF"
    },
    "text": {
      "body": "#2A1E17",
      "muted": "#665247",
      "on-primary": "#FFF7F0",
      "on-danger": "#FFFFFF"
    },
    "action": {
      "primary": "#B84E12",
      "primary-hover": "#A74813",
      "danger": "#A33A2E"
    },
    "signal": {
      "uncovered": "#955A12",
      "asked": "#665247",
      "covered": "#2E6B4F"
    },
    "border": {
      "default": "#D9CCBB",
      "subtle": "#E8DFD2"
    },
    "gray": {
      "100": "#F3ECE1",
      "300": "#D9CCBB",
      "500": "#665247",
      "900": "#2A1E17"
    }
  },
  "font": {
    "display": "Newsreader, Georgia, serif",
    "body": "\"Public Sans\", \"Helvetica Neue\", Arial, sans-serif",
    "mono": "\"JetBrains Mono\", Menlo, monospace"
  },
  "type": {
    "size": {
      "display": "28px",
      "heading": "20px",
      "body": "15px",
      "small": "13px",
      "label": "11px"
    }
  },
  "space": {
    "1": "4px",
    "2": "8px",
    "3": "12px",
    "4": "16px",
    "6": "24px",
    "8": "32px"
  },
  "radius": {
    "control": "6px",
    "surface": "8px"
  },
  "shadow": {
    "raised": "0 1px 2px rgba(42,30,23,.06), 0 8px 24px rgba(42,30,23,.08)"
  },
  "breakpoint": {
    "phone": "480px",
    "laptop": "960px"
  },
  "target": {
    "min": "44px"
  },
  "z-index": {
    "sticky": "10",
    "overlay": "20",
    "toast": "30"
  }
} as const;
