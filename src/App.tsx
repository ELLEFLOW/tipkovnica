import { useState } from 'react';
import { Keyboard } from './components/Keyboard';
import { Type, Save, LogOut, User, FileText, Settings } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { supabase } from './lib/supabase';

function App({ onShowSavedTexts, onShowAdmin }: { onShowSavedTexts: () => void; onShowAdmin: () => void }) {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { user, signOut } = useAuth();

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

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Type className="w-10 h-10 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-800">
                Hrvatska Tipkovnica
              </h1>
            </div>
            {user && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <User className="w-5 h-5" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <button
                  onClick={onShowAdmin}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg font-medium
                           hover:bg-purple-600 transition-colors duration-200 flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Admin
                </button>
                <button
                  onClick={onShowSavedTexts}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium
                           hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Tekstovi
                </button>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg font-medium
                           hover:bg-gray-600 transition-colors duration-200 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Odjava
                </button>
              </div>
            )}
          </div>
          <p className="text-lg text-gray-600">
            Mobilna tipkovnica za hrvatski, kajkavski i engleski jezik
          </p>
        </header>

        {saveSuccess && (
          <div className="mb-4 p-4 bg-green-100 border border-green-300 rounded-xl text-green-700">
            Tekst uspješno spremljen!
          </div>
        )}

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="text-xl font-semibold text-gray-700">
                Vaš tekst:
              </label>
              <div className="flex gap-2">
                {user && (
                  <button
                    onClick={() => setShowSaveModal(true)}
                    disabled={!text}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium
                             hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed
                             transition-colors duration-200 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Spremi
                  </button>
                )}
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
