import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { FileText, Trash2, Download, ArrowLeft } from 'lucide-react';

interface SavedText {
  id: string;
  title: string;
  content: string;
  char_count: number;
  word_count: number;
  created_at: string;
}

export function SavedTextsPage({ onBack }: { onBack: () => void }) {
  const { user } = useAuth();
  const [texts, setTexts] = useState<SavedText[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedText, setSelectedText] = useState<SavedText | null>(null);

  useEffect(() => {
    loadTexts();
  }, [user]);

  const loadTexts = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('saved_texts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setTexts(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Jeste li sigurni da želite obrisati ovaj tekst?')) return;

    const { error } = await supabase
      .from('saved_texts')
      .delete()
      .eq('id', id);

    if (!error) {
      setTexts(texts.filter(t => t.id !== id));
      if (selectedText?.id === id) {
        setSelectedText(null);
      }
    }
  };

  const handleDownload = (text: SavedText) => {
    const blob = new Blob([text.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${text.title}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
          <h1 className="text-4xl font-bold text-gray-800">Spremljeni tekstovi</h1>
        </div>

        {texts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">Nemate spremljenih tekstova</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {texts.map((text) => (
                <div
                  key={text.id}
                  className={`bg-white rounded-xl shadow-lg p-4 cursor-pointer transition-all ${
                    selectedText?.id === text.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedText(text)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {text.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {text.content}
                      </p>
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span>{text.char_count} znakova</span>
                        <span>{text.word_count} riječi</span>
                        <span>{new Date(text.created_at).toLocaleDateString('hr-HR')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(text);
                      }}
                      className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm
                               hover:bg-blue-600 transition-colors flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      Preuzmi
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(text.id);
                      }}
                      className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm
                               hover:bg-red-600 transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Obriši
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {selectedText && (
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8 h-fit">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {selectedText.title}
                </h2>
                <div className="mb-4 flex gap-4 text-sm text-gray-600">
                  <span>{selectedText.char_count} znakova</span>
                  <span>{selectedText.word_count} riječi</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-sans text-gray-800">
                    {selectedText.content}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
