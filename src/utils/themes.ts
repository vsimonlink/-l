export interface Theme {
  id: string;
  name: string;
  file: string;
}

export const themes: Theme[] = [
  { id: "glass", name: "梦幻玻璃", file: "glass.css" },
  { id: "neon", name: "渐变霓虹", file: "neon.css" },
  { id: "warm", name: "手绘温暖", file: "warm.css" },
  { id: "cyber", name: "赛博朋克", file: "cyber.css" },
];

export const defaultTheme = "glass";

export const requiredCSSVars = [
  "--color-bg-primary", "--color-bg-secondary", "--color-bg-card", "--color-bg-hover",
  "--color-text-primary", "--color-text-secondary", "--color-text-muted", "--color-text-inverse",
  "--color-accent", "--color-accent-hover", "--color-accent-muted",
  "--color-border", "--color-shadow",
  "--glass-bg", "--glass-border", "--glass-blur", "--glass-shadow",
  "--radius-sm", "--radius-md", "--radius-lg", "--radius-full",
  "--gradient-hero", "--gradient-card", "--gradient-accent",
  "--transition-base", "--transition-slow",
];

export function validateTheme(): string[] {
  if (typeof document === "undefined") return [];
  const styles = getComputedStyle(document.documentElement);
  return requiredCSSVars.filter((v) => !styles.getPropertyValue(v));
}
