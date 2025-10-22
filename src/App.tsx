import { useState } from 'react';
import { Keyboard } from './components/Keyboard';
import { Type } from 'lucide-react';

function App() {
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

  const handleClear = () => {
    setText('');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Tekst kopiran!');
    } catch (err) {
      console.error('Greška kod kopiranja:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Type className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">
              Hrvatska Tipkovnica
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Jednostavna tipkovnica prilagođena hrvatskom jeziku
          </p>
        </header>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="text-xl font-semibold text-gray-700">
                Vaš tekst:
              </label>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  disabled={!text}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium
                           hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed
                           transition-colors duration-200"
                >
                  📋 Kopiraj
                </button>
                <button
                  onClick={handleClear}
                  disabled={!text}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium
                           hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed
                           transition-colors duration-200"
                >
                  🗑️ Obriši sve
                </button>
              </div>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full min-h-[200px] p-4 text-xl border-2 border-gray-300 rounded-xl
                       focus:border-blue-500 focus:outline-none resize-none font-sans"
              placeholder="Počnite pisati koristeći tipkovnicu ispod..."
            />
            <div className="mt-2 text-sm text-gray-500">
              Znakova: {text.length}
            </div>
          </div>

          <Keyboard
            onInput={handleInput}
            onBackspace={handleBackspace}
            onSpace={handleSpace}
            onEnter={handleEnter}
          />

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              Hrvatski znakovi:
            </h2>
            <div className="flex flex-wrap gap-3">
              {['č', 'ć', 'š', 'ž', 'đ', 'Č', 'Ć', 'Š', 'Ž', 'Đ'].map((char) => (
                <button
                  key={char}
                  onClick={() => handleInput(char)}
                  className="px-6 py-3 bg-blue-100 text-blue-900 rounded-lg font-bold text-2xl
                           hover:bg-blue-200 active:scale-95 transition-all duration-100
                           border-2 border-blue-300"
                >
                  {char}
                </button>
              ))}
            </div>
          </div>
        </div>

        <footer className="mt-8 text-center text-gray-600">
          <p>Koristite fizičku tipkovnicu ili kliknite na gumbe</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
