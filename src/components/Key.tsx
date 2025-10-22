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
        relative min-w-[42px] h-[42px] rounded-md font-medium text-lg
        transition-all duration-100 shadow-sm
        ${isPressed
          ? 'bg-blue-500 text-white scale-95 shadow-inner'
          : 'bg-white text-gray-800 hover:bg-gray-50 active:scale-95'
        }
        border border-gray-300
        flex flex-col items-center justify-center
        touch-manipulation select-none
      `}
    >
      {keyConfig.shift && (
        <span className="absolute top-0.5 right-1 text-xs text-gray-500">
          {keyConfig.shift}
        </span>
      )}
      <span className={keyConfig.shift ? 'mt-0.5' : ''}>
        {displayChar}
      </span>
    </button>
  );
}
