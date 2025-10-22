import { EmojiConfig } from '../types/keyboard';

export const defaultFavoriteEmojis = ['😊', '❤️', '😂', '👍', '🎉', '😍', '🔥', '✨'];

export const emojiCategories: Record<string, EmojiConfig[]> = {
  smileys: [
    { emoji: '😊', category: 'smileys', keywords: ['smile', 'happy'] },
    { emoji: '😂', category: 'smileys', keywords: ['laugh', 'joy'] },
    { emoji: '😍', category: 'smileys', keywords: ['love', 'heart eyes'] },
    { emoji: '😎', category: 'smileys', keywords: ['cool', 'sunglasses'] },
    { emoji: '🥰', category: 'smileys', keywords: ['love', 'hearts'] },
    { emoji: '😢', category: 'smileys', keywords: ['sad', 'cry'] },
    { emoji: '😭', category: 'smileys', keywords: ['crying', 'tears'] },
    { emoji: '😡', category: 'smileys', keywords: ['angry', 'mad'] },
    { emoji: '🤔', category: 'smileys', keywords: ['thinking', 'hmm'] },
    { emoji: '😴', category: 'smileys', keywords: ['sleep', 'tired'] },
  ],
  hearts: [
    { emoji: '❤️', category: 'hearts', keywords: ['love', 'heart', 'red'] },
    { emoji: '💙', category: 'hearts', keywords: ['blue heart', 'love'] },
    { emoji: '💚', category: 'hearts', keywords: ['green heart', 'love'] },
    { emoji: '💛', category: 'hearts', keywords: ['yellow heart', 'love'] },
    { emoji: '🧡', category: 'hearts', keywords: ['orange heart', 'love'] },
    { emoji: '💜', category: 'hearts', keywords: ['purple heart', 'love'] },
    { emoji: '🖤', category: 'hearts', keywords: ['black heart', 'love'] },
    { emoji: '💕', category: 'hearts', keywords: ['two hearts', 'love'] },
    { emoji: '💖', category: 'hearts', keywords: ['sparkling heart', 'love'] },
    { emoji: '💗', category: 'hearts', keywords: ['growing heart', 'love'] },
  ],
  gestures: [
    { emoji: '👍', category: 'gestures', keywords: ['thumbs up', 'like', 'ok'] },
    { emoji: '👎', category: 'gestures', keywords: ['thumbs down', 'dislike'] },
    { emoji: '👏', category: 'gestures', keywords: ['clap', 'applause'] },
    { emoji: '🙏', category: 'gestures', keywords: ['pray', 'please', 'thanks'] },
    { emoji: '👌', category: 'gestures', keywords: ['ok', 'perfect'] },
    { emoji: '✌️', category: 'gestures', keywords: ['peace', 'victory'] },
    { emoji: '🤝', category: 'gestures', keywords: ['handshake', 'deal'] },
    { emoji: '👋', category: 'gestures', keywords: ['wave', 'hello', 'bye'] },
    { emoji: '🤘', category: 'gestures', keywords: ['rock', 'metal'] },
    { emoji: '💪', category: 'gestures', keywords: ['strong', 'muscle'] },
  ],
  activities: [
    { emoji: '🎉', category: 'activities', keywords: ['party', 'celebration'] },
    { emoji: '🎊', category: 'activities', keywords: ['confetti', 'party'] },
    { emoji: '🎈', category: 'activities', keywords: ['balloon', 'party'] },
    { emoji: '🎁', category: 'activities', keywords: ['gift', 'present'] },
    { emoji: '🎂', category: 'activities', keywords: ['cake', 'birthday'] },
    { emoji: '🏆', category: 'activities', keywords: ['trophy', 'win'] },
    { emoji: '⚽', category: 'activities', keywords: ['football', 'soccer'] },
    { emoji: '🎮', category: 'activities', keywords: ['game', 'gaming'] },
    { emoji: '🎵', category: 'activities', keywords: ['music', 'note'] },
    { emoji: '🎸', category: 'activities', keywords: ['guitar', 'music'] },
  ],
  symbols: [
    { emoji: '🔥', category: 'symbols', keywords: ['fire', 'hot', 'lit'] },
    { emoji: '✨', category: 'symbols', keywords: ['sparkles', 'shine'] },
    { emoji: '⭐', category: 'symbols', keywords: ['star', 'favorite'] },
    { emoji: '💯', category: 'symbols', keywords: ['100', 'perfect'] },
    { emoji: '✅', category: 'symbols', keywords: ['check', 'done', 'yes'] },
    { emoji: '❌', category: 'symbols', keywords: ['x', 'no', 'wrong'] },
    { emoji: '⚠️', category: 'symbols', keywords: ['warning', 'caution'] },
    { emoji: '💬', category: 'symbols', keywords: ['chat', 'message'] },
    { emoji: '💭', category: 'symbols', keywords: ['thought', 'thinking'] },
    { emoji: '🔔', category: 'symbols', keywords: ['bell', 'notification'] },
  ],
};

export const getAllEmojis = (): EmojiConfig[] => {
  return Object.values(emojiCategories).flat();
};
