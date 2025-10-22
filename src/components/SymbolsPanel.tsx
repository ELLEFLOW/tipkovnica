interface SymbolsPanelProps {
  onInput: (char: string) => void;
  onClose: () => void;
}

export function SymbolsPanel({ onInput, onClose }: SymbolsPanelProps) {
  const symbols = [
    ['!', '@', '#', '$', '%', '^', '&', '*'],
    ['(', ')', '-', '_', '=', '+', '[', ']'],
    ['{', '}', '\\', '|', ';', ':', "'", '"'],
    ['<', '>', ',', '.', '?', '/', '~', '`'],
  ];

  const handleSymbolClick = (symbol: string) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    onInput(symbol);
  };

  return (
    <div className="bg-gradient-to-b from-gray-200 to-gray-300 p-3">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-700">Posebni znakovi</span>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium text-sm
                   hover:bg-blue-600 active:scale-95 transition-all"
        >
          ABC
        </button>
      </div>

      <div className="space-y-2">
        {symbols.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-2">
            {row.map((symbol) => (
              <button
                key={symbol}
                onClick={() => handleSymbolClick(symbol)}
                className="flex-1 h-12 bg-white text-gray-800 text-lg font-medium rounded-lg
                         border border-gray-300 hover:bg-gray-50 active:scale-95 transition-all
                         shadow-sm flex items-center justify-center"
              >
                {symbol}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
