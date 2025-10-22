import { useState } from 'react';
import { Keyboard } from './components/Keyboard';

interface AppProps {
  onShowSavedTexts: () => void;
  onShowAdmin: () => void;
}

function App({ onShowSavedTexts, onShowAdmin }: AppProps) {
  const [text, setText] = useState('');

  const handleInput = (char: string) => {
    setText(prev => prev + char);
  };

  const handleBackspace = () => {
    setText(prev => prev.slice(0, -1));
  };

  const handleSpace = () => {
    setText(prev => prev + ' ');
  };

  const handleEnter = () => {
    setText(prev => prev + '\n');
  };

  return (
    <div className="h-screen w-full bg-gray-100 flex flex-col">
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-4 bg-white shadow-sm">
          <h1 className="text-xl font-bold text-gray-800">Hrvatska Tipkovnica</h1>
          <div className="flex gap-2">
            <button
              onClick={onShowSavedTexts}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium
                       hover:bg-blue-600 transition-colors"
            >
              Tekstovi
            </button>
            <button
              onClick={onShowAdmin}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm font-medium
                       hover:bg-gray-800 transition-colors"
            >
              Admin
            </button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-64 p-4 text-lg border-2 border-gray-300 rounded-lg
                       focus:border-blue-500 focus:outline-none resize-none font-sans"
              placeholder="Počnite pisati..."
            />
          </div>
        </div>
      </div>

      <div className="w-full">
        <Keyboard
          onInput={handleInput}
          onBackspace={handleBackspace}
          onSpace={handleSpace}
          onEnter={handleEnter}
        />
      </div>
    </div>
  );
}

export default App;
