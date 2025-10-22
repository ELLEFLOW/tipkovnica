export interface KeyConfig {
  main: string;
  shift?: string;
  code: string;
}

export type KeyboardLayout = KeyConfig[][];
