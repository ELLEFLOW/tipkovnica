import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { KeyboardMode, Language, KeyboardSettings } from '../types/keyboard';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface KeyboardContextType {
  mode: KeyboardMode;
  setMode: (mode: KeyboardMode) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  isCapsLock: boolean;
  toggleCapsLock: () => void;
  settings: KeyboardSettings | null;
  updateSettings: (updates: Partial<KeyboardSettings>) => Promise<void>;
  vibrationEnabled: boolean;
}

const KeyboardContext = createContext<KeyboardContextType | undefined>(undefined);

export function KeyboardProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [mode, setMode] = useState<KeyboardMode>('letters');
  const [language, setLanguage] = useState<Language>('croatian');
  const [isCapsLock, setIsCapsLock] = useState(false);
  const [settings, setSettings] = useState<KeyboardSettings | null>(null);

  useEffect(() => {
    if (user) {
      loadSettings();
    } else {
      loadLocalSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_keyboard_settings')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error loading settings:', error);
      return;
    }

    if (data) {
      setSettings(data);
      setLanguage(data.language);
    } else {
      await createDefaultSettings();
    }
  };

  const createDefaultSettings = async () => {
    if (!user) return;

    const defaultSettings = {
      user_id: user.id,
      language: 'croatian' as Language,
      theme: 'light' as const,
      vibration_enabled: true,
      keyboard_height: 'medium' as const,
    };

    const { data, error } = await supabase
      .from('user_keyboard_settings')
      .insert(defaultSettings)
      .select()
      .single();

    if (!error && data) {
      setSettings(data);
    }
  };

  const loadLocalSettings = () => {
    const storedLanguage = localStorage.getItem('keyboard_language') as Language;
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  };

  const updateSettings = async (updates: Partial<KeyboardSettings>) => {
    if (!user || !settings) {
      if (updates.language) {
        localStorage.setItem('keyboard_language', updates.language);
        setLanguage(updates.language);
      }
      return;
    }

    const { data, error } = await supabase
      .from('user_keyboard_settings')
      .update(updates)
      .eq('user_id', user.id)
      .select()
      .single();

    if (!error && data) {
      setSettings(data);
      if (updates.language) {
        setLanguage(updates.language);
      }
    }
  };

  const toggleCapsLock = () => {
    setIsCapsLock(!isCapsLock);
  };

  const handleSetLanguage = async (newLanguage: Language) => {
    await updateSettings({ language: newLanguage });
  };

  return (
    <KeyboardContext.Provider
      value={{
        mode,
        setMode,
        language,
        setLanguage: handleSetLanguage,
        isCapsLock,
        toggleCapsLock,
        settings,
        updateSettings,
        vibrationEnabled: settings?.vibration_enabled ?? true,
      }}
    >
      {children}
    </KeyboardContext.Provider>
  );
}

export function useKeyboard() {
  const context = useContext(KeyboardContext);
  if (context === undefined) {
    throw new Error('useKeyboard must be used within a KeyboardProvider');
  }
  return context;
}
