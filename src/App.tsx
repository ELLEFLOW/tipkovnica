import { useState } from 'react';
import { Keyboard } from './components/Keyboard';

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

  return (
    <div className="h-screen w-full bg-gray-100 flex flex-col">
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
