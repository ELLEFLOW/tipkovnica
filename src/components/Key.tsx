import { KeyConfig } from '../types/keyboard';

interface KeyProps {
  keyConfig: KeyConfig;
  isShiftActive: boolean;
  onKeyClick: (char: string) => void;
  isPressed: boolean;
}

export function Key({ keyConfig, isShiftActive, onKeyClick, isPressed }: KeyProps) {
  const displayChar = isShiftActive && keyConfig.shift ? keyConfig.shift : keyConfig.main;

  return (
    <button
      onClick={() => onKeyClick(displayChar)}
      className={`
        relative min-w-[60px] h-[60px] rounded-lg font-semibold text-xl
        transition-all duration-100 shadow-md
        ${isPressed
          ? 'bg-blue-600 text-white scale-95 shadow-inner'
          : 'bg-white text-gray-800 hover:bg-gray-50 active:scale-95'
        }
        border-2 border-gray-300
        flex flex-col items-center justify-center
      `}
    >
      {keyConfig.shift && (
        <span className="absolute top-1 right-2 text-xs text-gray-500">
          {keyConfig.shift}
        </span>
      )}
      <span className={keyConfig.shift ? 'mt-1' : ''}>
        {keyConfig.main}
      </span>
    </button>
  );
}
