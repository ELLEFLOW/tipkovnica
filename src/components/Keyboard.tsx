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
    <div className="bg-gray-800 p-4 rounded-2xl shadow-2xl">
      <div className="space-y-2">
        {croatianLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1.5">
            {row.map((keyConfig) => (
              <Key
                key={keyConfig.code}
                keyConfig={keyConfig}
                isShiftActive={isShiftActive}
                onKeyClick={handleKeyClick}
                isPressed={pressedKeys.has(keyConfig.code)}
              />
            ))}
            {rowIndex === 0 && (
              <button
                onClick={handleBackspaceClick}
                className={`
                  min-w-[100px] h-[70px] rounded-lg font-semibold text-lg
                  transition-all duration-100 shadow-md touch-manipulation select-none
                  ${pressedKeys.has('Backspace')
                    ? 'bg-red-600 text-white scale-95 shadow-inner'
                    : 'bg-red-500 text-white hover:bg-red-600 active:scale-95'
                  }
                `}
              >
                ⌫ Brisanje
              </button>
            )}
          </div>
        ))}

        <div className="flex justify-center gap-1.5">
          <button
            onClick={handleShiftClick}
            className={`
              min-w-[110px] h-[70px] rounded-lg font-semibold text-lg
              transition-all duration-100 shadow-md touch-manipulation select-none
              ${isShiftActive
                ? 'bg-blue-600 text-white shadow-inner'
                : 'bg-gray-300 text-gray-800 hover:bg-gray-400 active:scale-95'
              }
            `}
          >
            ⇧ Shift
          </button>

          <button
            onClick={handleSpaceClick}
            className={`
              flex-1 h-[70px] rounded-lg font-semibold text-lg
              transition-all duration-100 shadow-md touch-manipulation select-none
              ${pressedKeys.has('Space')
                ? 'bg-blue-600 text-white scale-95 shadow-inner'
                : 'bg-white text-gray-800 hover:bg-gray-50 active:scale-95'
              }
              border-2 border-gray-300
            `}
          >
            Razmak
          </button>

          <button
            onClick={handleEnterClick}
            className={`
              min-w-[110px] h-[70px] rounded-lg font-semibold text-lg
              transition-all duration-100 shadow-md touch-manipulation select-none
              ${pressedKeys.has('Enter')
                ? 'bg-green-600 text-white scale-95 shadow-inner'
                : 'bg-green-500 text-white hover:bg-green-600 active:scale-95'
              }
            `}
          >
            ↵ Enter
          </button>
        </div>
      </div>
    </div>
  );
}
