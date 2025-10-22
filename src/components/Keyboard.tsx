import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { Key } from './Key';
import { EmojiPanel } from './EmojiPanel';
import { Calculator } from './Calculator';
import { SymbolsPanel } from './SymbolsPanel';
import { croatianLayout } from '../data/croatianLayout';
import { englishLayout } from '../data/englishLayout';
import { useKeyboard } from '../contexts/KeyboardContext';
import { KeyboardLayout } from '../types/keyboard';

interface KeyboardProps {
  onInput: (char: string) => void;
  onBackspace: () => void;
  onSpace: () => void;
  onEnter: () => void;
}

export function Keyboard({ onInput, onBackspace, onSpace, onEnter }: KeyboardProps) {
  const { mode, setMode, language, setLanguage, isCapsLock, toggleCapsLock, vibrationEnabled } = useKeyboard();
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  const getCurrentLayout = (): KeyboardLayout => {
    switch (language) {
      case 'english':
        return englishLayout;
      case 'kajkavski':
        return croatianLayout;
      default:
        return croatianLayout;
    }
  };

  const currentLayout = getCurrentLayout();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setPressedKeys(prev => new Set(prev).add(e.code));

      if (e.key === 'Backspace') {
        e.preventDefault();
        onBackspace();
        return;
      }

      if (e.key === ' ') {
        e.preventDefault();
        onSpace();
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        onEnter();
        return;
      }

      for (const row of currentLayout) {
        for (const key of row) {
          if (key.code === e.code) {
            e.preventDefault();
            const char = isCapsLock && key.shift ? key.shift : key.main;
            onInput(char);
            return;
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(e.code);
        return newSet;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isCapsLock, onInput, onBackspace, onSpace, onEnter, currentLayout]);

  const handleKeyClick = (char: string) => {
    if (vibrationEnabled && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
    onInput(char);
  };

  const handleCapsLockClick = () => {
    if (vibrationEnabled && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
    toggleCapsLock();
  };

  const handleBackspaceClick = () => {
    if (vibrationEnabled && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
    onBackspace();
  };

  const handleSpaceClick = () => {
    if (vibrationEnabled && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
    onSpace();
  };

  const handleEnterClick = () => {
    if (vibrationEnabled && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
    onEnter();
  };

  const handleLanguageSwitch = () => {
    if (vibrationEnabled && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
    const languages: Array<typeof language> = ['croatian', 'english', 'kajkavski'];
    const currentIndex = languages.indexOf(language);
    const nextLanguage = languages[(currentIndex + 1) % languages.length];
    setLanguage(nextLanguage);
  };

  const getLanguageLabel = () => {
    switch (language) {
      case 'croatian':
        return 'HR';
      case 'english':
        return 'EN';
      case 'kajkavski':
        return 'KAJ';
      default:
        return 'HR';
    }
  };

  if (mode === 'calculator') {
    return (
      <div className="w-full">
        <EmojiPanel onEmojiSelect={onInput} />
        <Calculator
          onInput={onInput}
          onClose={() => setMode('letters')}
        />
      </div>
    );
  }

  if (mode === 'symbols') {
    return (
      <div className="w-full">
        <EmojiPanel onEmojiSelect={onInput} />
        <SymbolsPanel
          onInput={onInput}
          onClose={() => setMode('letters')}
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      <EmojiPanel onEmojiSelect={onInput} />

      <div className="bg-gradient-to-b from-gray-200 to-gray-300 px-1 pt-3 pb-2 safe-bottom">
        <div className="max-w-screen-lg mx-auto">
          <div className="space-y-2">
            <div className="flex justify-center gap-1.5">
              {currentLayout[0].map((keyConfig) => (
                <Key
                  key={keyConfig.code}
                  keyConfig={keyConfig}
                  isShiftActive={isCapsLock}
                  onKeyClick={handleKeyClick}
                  isPressed={pressedKeys.has(keyConfig.code)}
                />
              ))}
              <button
                onClick={handleBackspaceClick}
                className="min-w-[36px] h-[44px] rounded-lg font-medium text-base bg-gray-400
                         text-white hover:bg-gray-500 active:scale-95 transition-all shadow-sm"
              >
                ⌫
              </button>
            </div>

            <div className="flex justify-center gap-1.5">
              {currentLayout[1].map((keyConfig) => (
                <Key
                  key={keyConfig.code}
                  keyConfig={keyConfig}
                  isShiftActive={isCapsLock}
                  onKeyClick={handleKeyClick}
                  isPressed={pressedKeys.has(keyConfig.code)}
                />
              ))}
            </div>

            <div className="flex justify-center gap-1.5">
              {currentLayout[2].map((keyConfig) => (
                <Key
                  key={keyConfig.code}
                  keyConfig={keyConfig}
                  isShiftActive={isCapsLock}
                  onKeyClick={handleKeyClick}
                  isPressed={pressedKeys.has(keyConfig.code)}
                />
              ))}
            </div>

            <div className="flex justify-center gap-1.5">
              <button
                onClick={handleCapsLockClick}
                className={`min-w-[52px] h-[44px] rounded-lg font-bold text-sm transition-all shadow-sm
                  ${isCapsLock
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-800 border border-gray-300'
                  }`}
              >
                ABC
              </button>
              <button
                onClick={() => setMode('symbols')}
                className="min-w-[44px] h-[44px] rounded-lg font-medium text-base bg-white
                         text-gray-800 border border-gray-300 hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
              >
                #+=
              </button>
              <button
                onClick={handleSpaceClick}
                className="flex-1 h-[44px] rounded-lg font-medium text-base bg-white
                         text-gray-800 border border-gray-300 hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
              >
                SPACE
              </button>
              <button
                onClick={() => setMode('calculator')}
                className="min-w-[52px] h-[44px] rounded-lg font-medium text-base bg-gray-300
                         text-gray-800 hover:bg-gray-400 active:scale-95 transition-all shadow-sm"
              >
                123
              </button>
              <button
                onClick={handleLanguageSwitch}
                className="min-w-[52px] h-[44px] rounded-lg font-medium text-xs bg-white
                         text-gray-800 border border-gray-300 hover:bg-gray-50 active:scale-95 transition-all shadow-sm
                         flex flex-col items-center justify-center gap-0.5"
              >
                <Globe size={16} />
                <span className="text-[10px] font-bold">{getLanguageLabel()}</span>
              </button>
              <button
                onClick={handleEnterClick}
                className="min-w-[52px] h-[44px] rounded-lg font-medium text-base bg-blue-500
                         text-white hover:bg-blue-600 active:scale-95 transition-all shadow-sm"
              >
                ↵
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
