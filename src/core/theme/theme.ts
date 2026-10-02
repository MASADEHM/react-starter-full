import type { ThemeConfig } from 'antd';

/**
 * Navy identity, white surfaces on a warm-grey canvas, a 6 px radius, layered shadows and one
 * warm signal colour for attention states. Mirrors the CSS variables in styles/variables.css;
 * change a colour in both places.
 */
export const palette = {
  canvas: '#f4f4f2',
  white: '#ffffff',
  text: '#1a1e2b',
  muted: 'rgba(26,30,43,0.58)',
  faint: 'rgba(26,30,43,0.38)',
  border: '#e4e5e9',
  borderStrong: '#c9ccd4',
  accent: '#2b5aa8',
  accent50: '#f3f6fc',
  accent100: '#eef3fc',
  accent400: '#86a6e0',
  accent500: '#4f7ccb',
  accent700: '#1f478a',
  accent800: '#173464',
  navy: '#0f1f3d',
  navyEdge: '#1b2d50',
  onNavy: 'rgba(255,255,255,0.88)',
  onNavyMuted: 'rgba(255,255,255,0.52)',
  onNavyFaint: 'rgba(255,255,255,0.10)',
  amber100: '#fdf1e2',
  amber700: '#8f4206',
  neutral100: '#f5f5f4',
  neutral200: '#ebebe9',
  neutral700: '#605d5d',
  shadowSm: '0 1px 2px rgba(18,37,67,0.05), 0 1px 3px rgba(18,37,67,0.07)',
  shadowMd: '0 4px 14px rgba(18,37,67,0.10)',
  shadowLg: '0 18px 44px rgba(18,37,67,0.18)',
  radius: 6,
} as const;

export const theme: ThemeConfig = {
  token: {
    colorPrimary: palette.accent,
    colorLink: palette.accent,
    colorText: palette.text,
    colorTextHeading: palette.text,
    colorTextSecondary: palette.muted,
    colorBgLayout: palette.canvas,
    colorBgContainer: palette.white,
    colorBgElevated: palette.white,
    colorBorder: palette.borderStrong,
    colorBorderSecondary: palette.border,
    colorSplit: palette.border,
    borderRadius: palette.radius,
    borderRadiusLG: 8,
    borderRadiusSM: 4,
    fontFamily: 'Archivo, system-ui, sans-serif',
    fontSize: 14,
    boxShadow: palette.shadowMd,
    boxShadowSecondary: palette.shadowLg,
    controlOutlineWidth: 2,
    controlOutline: 'rgba(43,90,168,0.22)',
    controlHeight: 36,
  },
  components: {
    Layout: { siderBg: palette.navy, headerBg: palette.white, headerPadding: '0 24px' },
    Table: {
      headerBg: '#fafafa', headerColor: palette.muted, headerSplitColor: 'transparent',
      cellPaddingBlock: 10, cellPaddingInline: 14, rowHoverBg: palette.accent50, borderColor: palette.border,
    },
    Button: { fontWeight: 600, primaryShadow: 'none', defaultShadow: 'none', defaultBg: palette.white },
    Tag: { defaultBg: palette.neutral100, borderRadiusSM: 4 },
    Segmented: {
      itemSelectedBg: palette.white, itemSelectedColor: palette.accent800,
      trackBg: palette.neutral100, trackPadding: 3, borderRadius: palette.radius,
    },
    Drawer: { footerPaddingBlock: 12, footerPaddingInline: 20 },
    Input: { colorBgContainer: palette.white, activeShadow: '0 0 0 3px rgba(43,90,168,0.15)' },
    Skeleton: { gradientFromColor: palette.neutral200 },
  },
};
