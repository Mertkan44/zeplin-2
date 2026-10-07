/* Yapay zekâ sayfasının ince çizgili ikonları (emoji yerine). 24×24, currentColor. */

type P = { size?: number; stroke?: number };
const base = (size = 18, stroke = 1.7) =>
  ({ width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true }) as const;

export const IconChat = ({ size, stroke }: P) => (
  <svg {...base(size, stroke)}>
    <path d="M4 5h16v11H9l-5 4z" />
  </svg>
);
export const IconPhone = ({ size, stroke }: P) => (
  <svg {...base(size, stroke)}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z" />
  </svg>
);
export const IconCalendar = ({ size, stroke }: P) => (
  <svg {...base(size, stroke)}>
    <rect x="4" y="5" width="16" height="15" rx="2" />
    <path d="M4 10h16M9 3v4M15 3v4M8.5 14.5l2 2 4-4" />
  </svg>
);
export const IconQuestion = ({ size, stroke }: P) => (
  <svg {...base(size, stroke)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M9.6 9.5a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .8-1 1.5v.4M12 16.8v.2" />
  </svg>
);
export const IconBox = ({ size, stroke }: P) => (
  <svg {...base(size, stroke)}>
    <path d="m4 7.5 8-4 8 4v9l-8 4-8-4z" />
    <path d="m4 7.5 8 4 8-4M12 11.5v9" />
  </svg>
);
export const IconMoon = ({ size, stroke }: P) => (
  <svg {...base(size, stroke)}>
    <path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z" />
  </svg>
);
export const IconHandoff = ({ size, stroke }: P) => (
  <svg {...base(size, stroke)}>
    <path d="M14 5h5v5M19 5l-8 8M10 5H5v14h14v-5" />
  </svg>
);
export const IconPanel = ({ size, stroke }: P) => (
  <svg {...base(size, stroke)}>
    <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
    <path d="M3.5 9h17M8 13h8M8 16h5" />
  </svg>
);
export const IconCheck = ({ size = 14, stroke = 2.2 }: P) => (
  <svg {...base(size, stroke)}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);
export const IconInfo = ({ size = 14, stroke = 2 }: P) => (
  <svg {...base(size, stroke)}>
    <path d="M12 11v6M12 7.5v.5" />
  </svg>
);
