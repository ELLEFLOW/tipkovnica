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
        relative min-w-[44px] h-[44px] rounded-lg font-medium text-xl
        transition-all duration-100 shadow-sm
        ${isPressed
          ? 'bg-blue-500 text-white scale-95'
          : 'bg-white text-gray-900 hover:bg-gray-50 active:scale-95'
        }
        border border-gray-300
        flex flex-col items-center justify-center
        touch-manipulation select-none
      `}
    >
      {keyConfig.shift && !isShiftActive && (
        <span className="absolute top-0.5 left-1.5 text-[10px] text-gray-400">
          {keyConfig.shift}
        </span>
      )}
      <span className={keyConfig.shift && !isShiftActive ? 'mt-1' : ''}>
        {displayChar}
      </span>
    </button>
  );
}
