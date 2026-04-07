import { useState } from 'react';
import { Heart, MessageCircle, Share, MoreHorizontal, MapPin, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

const mockPosts = [
  {
    id: 1,
    author: {
      name: 'Анна Петрова',
      avatar: '👩‍💻',
      role: 'Frontend Developer',
    },
    content: 'Сегодня прошла отличная встреча React разработчиков! Обсудили новые фичи React 19 и лучшие практики. Спасибо всем участникам! 🚀',
    timestamp: '2 часа назад',
    location: 'TechHub, Алматы',
    likes: 24,
    comments: 8,
    shares: 3,
    images: [],
    tags: ['React', 'JavaScript', 'Meetup'],
  },
  {
    id: 2,
    author: {
      name: 'Максим Иванов',
      avatar: '👨‍🎨',
      role: 'UI/UX Designer',
    },
    content: 'Закончил новый дизайн для мобильного приложения. Фокус на минимализме и пользовательском опыте. Что думаете?',
    timestamp: '4 часа назад',
    location: 'Коворкинг Space',
    likes: 42,
    comments: 15,
    shares: 7,
    images: ['https://via.placeholder.com/400x300'],
    tags: ['UI/UX', 'Design', 'Mobile'],
  },
  {
    id: 3,
    author: {
      name: 'Елена Сидорова',
      avatar: '👩‍🏫',
      role: 'Python Mentor',
    },
    content: 'Организую бесплатный воркшоп по Python для начинающих! Будем изучать основы и создавать первое приложение. Дата: 15 марта, 18:00. Регистрация в комментариях 📚',
    timestamp: '6 часов назад',
    location: 'Онлайн',
    likes: 67,
    comments: 23,
    shares: 12,
    images: [],
    tags: ['Python', 'Обучение', 'Workshop'],
  },
];

export function Feed() {
  const [likedPosts, setLikedPosts] = useState(new Set());

  const toggleLike = (postId) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-4">
        {mockPosts.map((post) => (
          <div key={post.id} className="bg-card border border-border rounded-lg p-4">
            {/* Author */}
            <div className="flex items-start space-x-3 mb-3">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-lg">
                {post.author.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{post.author.name}</h3>
                    <p className="text-sm text-muted-foreground">{post.author.role}</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal size={16} />
                  </Button>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                  <Clock size={14} />
                  <span>{post.timestamp}</span>
                  <MapPin size={14} />
                  <span>{post.location}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="mb-3">
              <p className="text-foreground">{post.content}</p>
            </div>

            {/* Images */}
            {post.images.length > 0 && (
              <div className="mb-3">
                <img
                  src={post.images[0]}
                  alt="Post content"
                  className="w-full rounded-lg"
                />
              </div>
            )}

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleLike(post.id)}
                  className={cn(
                    'flex items-center space-x-1',
                    likedPosts.has(post.id) && 'text-red-500'
                  )}
                >
                  <Heart
                    size={16}
                    className={likedPosts.has(post.id) ? 'fill-current' : ''}
                  />
                  <span>{post.likes + (likedPosts.has(post.id) ? 1 : 0)}</span>
                </Button>

                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                  <MessageCircle size={16} />
                  <span>{post.comments}</span>
                </Button>

                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                  <Share size={16} />
                  <span>{post.shares}</span>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}