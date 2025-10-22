import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Upload, Database, Users, FileText, Trash2 } from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalTexts: number;
  totalDictionaryWords: number;
  totalUserWords: number;
}

export function AdminPage({ onBack }: { onBack: () => void }) {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalTexts: 0,
    totalDictionaryWords: 0,
    totalUserWords: 0,
  });
  const [loading, setLoading] = useState(true);
  const [importText, setImportText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('hrvatski');
  const [importLoading, setImportLoading] = useState(false);
  const [importMessage, setImportMessage] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);

    const [usersResult, textsResult, dictResult, userWordsResult] = await Promise.all([
      supabase.from('user_profiles').select('id', { count: 'exact', head: true }),
      supabase.from('saved_texts').select('id', { count: 'exact', head: true }),
      supabase.from('dictionary').select('id', { count: 'exact', head: true }),
      supabase.from('user_words').select('id', { count: 'exact', head: true }),
    ]);

    setStats({
      totalUsers: usersResult.count || 0,
      totalTexts: textsResult.count || 0,
      totalDictionaryWords: dictResult.count || 0,
      totalUserWords: userWordsResult.count || 0,
    });

    setLoading(false);
  };

  const handleImportWords = async () => {
    if (!importText.trim()) {
      setImportMessage('Unesite riječi za import');
      return;
    }

    setImportLoading(true);
    setImportMessage('');

    const words = importText
      .split('\n')
      .map(w => w.trim())
      .filter(w => w.length > 0);

    const uniqueWords = [...new Set(words)];

    const wordsToInsert = uniqueWords.map(word => ({
      word: word.toLowerCase(),
      language: selectedLanguage,
      frequency: 1,
    }));

    const batchSize = 500;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < wordsToInsert.length; i += batchSize) {
      const batch = wordsToInsert.slice(i, i + batchSize);
      const { error } = await supabase
        .from('dictionary')
        .upsert(batch, { onConflict: 'word,language', ignoreDuplicates: true });

      if (error) {
        errorCount += batch.length;
      } else {
        successCount += batch.length;
      }
    }

    setImportMessage(
      `Import završen! Uspješno: ${successCount}, Greške: ${errorCount}`
    );
    setImportText('');
    loadStats();
    setImportLoading(false);
  };

  const handleClearDictionary = async () => {
    if (!confirm(`Jeste li sigurni da želite obrisati SVE riječi za jezik: ${selectedLanguage}?`)) {
      return;
    }

    const { error } = await supabase
      .from('dictionary')
      .delete()
      .eq('language', selectedLanguage);

    if (error) {
      setImportMessage('Greška pri brisanju: ' + error.message);
    } else {
      setImportMessage(`Sve riječi za jezik ${selectedLanguage} su obrisane`);
      loadStats();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-700">Učitavanje...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-4xl font-bold text-gray-800">Admin Panel</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-8 h-8 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-700">Korisnici</h3>
            </div>
            <p className="text-4xl font-bold text-gray-800">{stats.totalUsers}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-8 h-8 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-700">Tekstovi</h3>
            </div>
            <p className="text-4xl font-bold text-gray-800">{stats.totalTexts}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Database className="w-8 h-8 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-700">Rječnik</h3>
            </div>
            <p className="text-4xl font-bold text-gray-800">{stats.totalDictionaryWords}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Database className="w-8 h-8 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-700">Korisničke riječi</h3>
            </div>
            <p className="text-4xl font-bold text-gray-800">{stats.totalUserWords}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Upload className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">Import Rječnika</h2>
          </div>

          {importMessage && (
            <div className={`mb-4 p-4 rounded-lg ${
              importMessage.includes('Greška')
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'
            }`}>
              {importMessage}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Odaberi jezik
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            >
              <option value="hrvatski">Hrvatski</option>
              <option value="kajkavski">Kajkavski</option>
              <option value="english">English</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Unesite riječi (jedna riječ po liniji)
            </label>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              className="w-full min-h-[300px] p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none font-mono text-sm"
              placeholder="auto&#10;avion&#10;bicikl&#10;..."
            />
            <p className="mt-2 text-sm text-gray-600">
              Broj riječi: {importText.split('\n').filter(w => w.trim().length > 0).length}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleImportWords}
              disabled={importLoading || !importText.trim()}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold
                       hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                       transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <Upload className="w-5 h-5" />
              {importLoading ? 'Importanje...' : 'Importaj riječi'}
            </button>

            <button
              onClick={handleClearDictionary}
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold
                       hover:bg-red-700 transition-colors duration-200 flex items-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              Obriši sve ({selectedLanguage})
            </button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Upute za import:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Unesite jednu riječ po liniji</li>
              <li>• Duplikati će biti automatski ignorirani</li>
              <li>• Import radi u batch-evima od 500 riječi</li>
              <li>• CSV format: samo riječi, bez zareza ili navodnika</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
