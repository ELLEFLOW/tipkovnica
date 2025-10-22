import { KeyConfig } from '../types/keyboard';

interface KeyProps {
  keyConfig: KeyConfig;
  isShiftActive: boolean;
  onKeyClick: (char: string) => void;
  isPressed: boolean;
}

export function Key({ keyConfig, isShiftActive, onKeyClick, isPressed }: KeyProps) {
  const displayChar = isShiftActive && keyConfig.shift ? keyConfig.shift : keyConfig.main;

  const handleClick = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    onKeyClick(displayChar);
  };

  return (
    <button
      onClick={handleClick}
      className={`
        relative min-w-[70px] h-[70px] rounded-lg font-semibold text-2xl
        transition-all duration-100 shadow-md
        ${isPressed
          ? 'bg-blue-600 text-white scale-95 shadow-inner'
          : 'bg-white text-gray-800 hover:bg-gray-50 active:scale-95'
        }
        border-2 border-gray-300
        flex flex-col items-center justify-center
        touch-manipulation select-none
      `}
    >
      {keyConfig.shift && (
        <span className="absolute top-1 right-2 text-sm text-gray-500">
          {keyConfig.shift}
        </span>
      )}
      <span className={keyConfig.shift ? 'mt-1' : ''}>
        {displayChar}
      </span>
    </button>
  );
}
