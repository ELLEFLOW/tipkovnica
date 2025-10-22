export interface KeyConfig {
  main: string;
  shift?: string;
  code: string;
  longPress?: string[];
}

export type KeyboardLayout = KeyConfig[][];

export type KeyboardMode = 'letters' | 'numbers' | 'calculator' | 'symbols';

export type Language = 'croatian' | 'english' | 'kajkavski';

export interface EmojiConfig {
  emoji: string;
  category: EmojiCategory;
  keywords: string[];
}

export type EmojiCategory = 'smileys' | 'hearts' | 'gestures' | 'animals' | 'food' | 'activities' | 'travel' | 'objects' | 'symbols' | 'flags';

export interface UserFavoriteEmoji {
  id: string;
  user_id: string;
  emoji: string;
  position: number;
  category: string;
  created_at: string;
}

export interface KeyboardSettings {
  id: string;
  user_id: string;
  language: Language;
  theme: 'light' | 'dark';
  vibration_enabled: boolean;
  keyboard_height: 'small' | 'medium' | 'large';
  created_at: string;
  updated_at: string;
}

export interface CalculatorState {
  display: string;
  currentValue: number;
  previousValue: number | null;
  operation: CalculatorOperation | null;
  shouldResetDisplay: boolean;
}

export type CalculatorOperation = '+' | '-' | '*' | '/' | '=';

export interface CalculatorHistory {
  id: string;
  user_id: string;
  expression: string;
  result: string;
  created_at: string;
}

export interface KeyboardTheme {
  id: string;
  name: string;
  colors: {
    background: string;
    keyBackground: string;
    keyText: string;
    accentColor: string;
  };
  is_default: boolean;
  created_at: string;
}
