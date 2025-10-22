import { useState } from 'react';
import { Keyboard } from './components/Keyboard';
import { User, Save, FileText, Trash2 } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { supabase } from './lib/supabase';

function App({ onShowSavedTexts, onShowAdmin }: { onShowSavedTexts: () => void; onShowAdmin: () => void }) {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { user } = useAuth();

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

  const handleSaveText = async () => {
    if (!user) {
      alert('Morate biti prijavljeni za spremanje teksta');
      return;
    }

    if (!text.trim()) {
      setSaveError('Tekst ne može biti prazan');
      return;
    }

    setSaveError('');

    const { error } = await supabase.from('saved_texts').insert({
      user_id: user.id,
      title: title.trim() || 'Bez naslova',
      content: text,
      language: 'hrvatski',
    });

    if (error) {
      setSaveError('Greška pri spremanju: ' + error.message);
    } else {
      setSaveSuccess(true);
      setShowSaveModal(false);
      setTitle('');
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  return (
    <div className="h-screen w-full bg-white flex flex-col overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white text-blue-600 rounded-lg flex items-center justify-center font-bold text-xl">
            T
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">Hrvatska Tipkovnica</h1>
            <p className="text-xs text-blue-100">Mobilna tipkovnica za hrvatski, kajkavski i engleski jezik</p>
          </div>
        </div>
        {user && (
          <button className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center">
            <User className="w-4 h-4" />
          </button>
        )}
      </div>

      {saveSuccess && (
        <div className="mx-4 mt-2 p-3 bg-green-100 border border-green-300 rounded-lg text-green-700 text-sm">
          Tekst uspješno spremljen!
        </div>
      )}

      <div className="flex-1 flex flex-col px-4 pt-4 pb-2 overflow-hidden">
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <label className="text-base font-semibold text-gray-800">Vaš tekst:</label>
            <div className="flex gap-2">
              {user && (
                <>
                  <button
                    onClick={() => setShowSaveModal(true)}
                    disabled={!text}
                    className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm font-medium
                             hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed
                             transition-colors flex items-center gap-1"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Spremi
                  </button>
                  <button
                    onClick={onShowSavedTexts}
                    className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm font-medium
                             hover:bg-blue-600 transition-colors flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Kopiraj
                  </button>
                  <button
                    onClick={handleClear}
                    disabled={!text}
                    className="px-3 py-1.5 bg-gray-400 text-white rounded-lg text-sm font-medium
                             hover:bg-gray-500 disabled:bg-gray-300 disabled:cursor-not-allowed
                             transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Obriši sve
                  </button>
                </>
              )}
            </div>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-[180px] p-3 text-base border-2 border-gray-300 rounded-lg
                     focus:border-blue-500 focus:outline-none resize-none font-sans bg-gray-50"
            placeholder="Počnite pisati koristeći tipkovnicu ispod..."
          />
          <div className="mt-1 text-xs text-gray-500">
            Znakova: {text.length}
          </div>
        </div>

        <div className="flex-1 min-h-0">
          <Keyboard
            onInput={handleInput}
            onBackspace={handleBackspace}
            onSpace={handleSpace}
            onEnter={handleEnter}
          />
        </div>
      </div>

      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Spremi tekst</h2>

            {saveError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
                {saveError}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Naslov (opciono)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="Unesite naslov..."
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pregled teksta
              </label>
              <div className="p-3 bg-gray-50 rounded-lg max-h-32 overflow-y-auto text-sm">
                {text.substring(0, 200)}{text.length > 200 ? '...' : ''}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSaveText}
                className="flex-1 py-3 bg-green-600 text-white rounded-lg font-semibold
                         hover:bg-green-700 transition-colors duration-200"
              >
                Spremi
              </button>
              <button
                onClick={() => {
                  setShowSaveModal(false);
                  setTitle('');
                  setSaveError('');
                }}
                className="flex-1 py-3 bg-gray-300 text-gray-800 rounded-lg font-semibold
                         hover:bg-gray-400 transition-colors duration-200"
              >
                Odustani
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
