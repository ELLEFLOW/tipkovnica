import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { defaultFavoriteEmojis, emojiCategories } from '../data/emojiData';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface EmojiPanelProps {
  onEmojiSelect: (emoji: string) => void;
}

export function EmojiPanel({ onEmojiSelect }: EmojiPanelProps) {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [favoriteEmojis, setFavoriteEmojis] = useState<string[]>(defaultFavoriteEmojis);
  const [selectedCategory, setSelectedCategory] = useState<string>('smileys');

  useEffect(() => {
    if (user) {
      loadFavoriteEmojis();
    }
  }, [user]);

  const loadFavoriteEmojis = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_favorite_emojis')
      .select('emoji, position')
      .eq('user_id', user.id)
      .order('position');

    if (!error && data && data.length > 0) {
      setFavoriteEmojis(data.map(item => item.emoji));
    }
  };

  const handleEmojiClick = (emoji: string) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    onEmojiSelect(emoji);
  };

  const handleToggleExpand = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="flex items-center gap-1 px-2 py-2 overflow-x-auto scrollbar-hide">
        {favoriteEmojis.map((emoji, index) => (
          <button
            key={index}
            onClick={() => handleEmojiClick(emoji)}
            className="flex-shrink-0 w-10 h-10 text-2xl hover:bg-gray-100 active:bg-gray-200
                     rounded-lg transition-colors flex items-center justify-center"
          >
            {emoji}
          </button>
        ))}

        <button
          onClick={handleToggleExpand}
          className="flex-shrink-0 w-10 h-10 text-gray-600 hover:bg-gray-100 active:bg-gray-200
                   rounded-lg transition-colors flex items-center justify-center ml-auto"
        >
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50">
          <div className="flex gap-1 px-2 py-2 overflow-x-auto scrollbar-hide border-b border-gray-200">
            {Object.keys(emojiCategories).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-full transition-colors
                  ${selectedCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-8 gap-1 p-2 max-h-48 overflow-y-auto">
            {emojiCategories[selectedCategory]?.map((emojiConfig, index) => (
              <button
                key={index}
                onClick={() => handleEmojiClick(emojiConfig.emoji)}
                className="w-full aspect-square text-2xl hover:bg-gray-200 active:bg-gray-300
                         rounded-lg transition-colors flex items-center justify-center"
              >
                {emojiConfig.emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
