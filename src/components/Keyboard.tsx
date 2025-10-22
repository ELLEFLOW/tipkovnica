import { useState, useEffect } from 'react';
import { Key } from './Key';
import { croatianLayout } from '../data/croatianLayout';

interface KeyboardProps {
  onInput: (char: string) => void;
  onBackspace: () => void;
  onSpace: () => void;
  onEnter: () => void;
}

export function Keyboard({ onInput, onBackspace, onSpace, onEnter }: KeyboardProps) {
  const [isShiftActive, setIsShiftActive] = useState(false);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setIsShiftActive(true);
      }

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

      for (const row of croatianLayout) {
        for (const key of row) {
          if (key.code === e.code) {
            e.preventDefault();
            const char = isShiftActive && key.shift ? key.shift : key.main;
            onInput(char);
            if (!e.shiftKey) {
              setIsShiftActive(false);
            }
            return;
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setIsShiftActive(false);
      }

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
  }, [isShiftActive, onInput, onBackspace, onSpace, onEnter]);

  const handleKeyClick = (char: string) => {
    onInput(char);
    if (!isShiftActive) {
      setIsShiftActive(false);
    }
  };

  const handleShiftClick = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    setIsShiftActive(!isShiftActive);
  };

  const handleBackspaceClick = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    onBackspace();
  };

  const handleSpaceClick = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    onSpace();
  };

  const handleEnterClick = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    onEnter();
  };

  return (
    <div className="w-full bg-gradient-to-b from-gray-200 to-gray-300 px-1 pt-3 pb-2 safe-bottom">
      <div className="max-w-screen-lg mx-auto">
        <div className="space-y-2">
          <div className="flex justify-center gap-1.5">
            {croatianLayout[0].map((keyConfig) => (
              <Key
                key={keyConfig.code}
                keyConfig={keyConfig}
                isShiftActive={isShiftActive}
                onKeyClick={handleKeyClick}
                isPressed={pressedKeys.has(keyConfig.code)}
              />
            ))}
            <button
              onClick={handleBackspaceClick}
              className="min-w-[44px] h-[44px] rounded-lg font-medium text-base bg-gray-400
                       text-white hover:bg-gray-500 active:scale-95 transition-all shadow-sm"
            >
              ⌫
            </button>
          </div>

          <div className="flex justify-center gap-1.5 px-3">
            {croatianLayout[1].map((keyConfig) => (
              <Key
                key={keyConfig.code}
                keyConfig={keyConfig}
                isShiftActive={isShiftActive}
                onKeyClick={handleKeyClick}
                isPressed={pressedKeys.has(keyConfig.code)}
              />
            ))}
          </div>

          <div className="flex justify-center gap-1.5 px-6">
            {croatianLayout[2].map((keyConfig) => (
              <Key
                key={keyConfig.code}
                keyConfig={keyConfig}
                isShiftActive={isShiftActive}
                onKeyClick={handleKeyClick}
                isPressed={pressedKeys.has(keyConfig.code)}
              />
            ))}
          </div>

          <div className="flex justify-center gap-1.5">
            <button
              onClick={handleShiftClick}
              className={`min-w-[52px] h-[44px] rounded-lg font-medium text-lg transition-all shadow-sm
                ${isShiftActive
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-800 border border-gray-300'
                }`}
            >
              ⇧
            </button>
            {croatianLayout[3].map((keyConfig) => (
              <Key
                key={keyConfig.code}
                keyConfig={keyConfig}
                isShiftActive={isShiftActive}
                onKeyClick={handleKeyClick}
                isPressed={pressedKeys.has(keyConfig.code)}
              />
            ))}
            <button
              onClick={handleBackspaceClick}
              className="min-w-[52px] h-[44px] rounded-lg font-medium text-lg bg-gray-400
                       text-white hover:bg-gray-500 active:scale-95 transition-all shadow-sm"
            >
              ⌫
            </button>
          </div>

          <div className="flex justify-center gap-1.5">
            <button
              className="min-w-[60px] h-[44px] rounded-lg font-medium text-base bg-gray-300
                       text-gray-800 hover:bg-gray-400 active:scale-95 transition-all shadow-sm"
            >
              123
            </button>
            <button
              className="min-w-[44px] h-[44px] rounded-lg font-medium text-base bg-white
                       text-gray-800 border border-gray-300 hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
            >
              ,
            </button>
            <button
              onClick={handleSpaceClick}
              className="flex-1 h-[44px] rounded-lg font-medium text-base bg-white
                       text-gray-800 border border-gray-300 hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
            >
              SPACE
            </button>
            <button
              className="min-w-[44px] h-[44px] rounded-lg font-medium text-base bg-white
                       text-gray-800 border border-gray-300 hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
            >
              .
            </button>
            <button
              onClick={handleEnterClick}
              className="min-w-[60px] h-[44px] rounded-lg font-medium text-base bg-blue-500
                       text-white hover:bg-blue-600 active:scale-95 transition-all shadow-sm"
            >
              ↵
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
