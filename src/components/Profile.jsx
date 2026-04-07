import { useState } from 'react';
import { Settings, Edit, MapPin, Calendar, Award, Star, Users, BookOpen, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

const mockUser = {
  name: 'Алексей Петров',
  avatar: '👨‍💻',
  role: 'Full Stack Developer',
  location: 'Алматы, Казахстан',
  bio: 'Passionate developer with 5+ years of experience in web development. Love creating amazing user experiences and solving complex problems.',
  joinDate: 'Март 2023',
  stats: {
    followers: 234,
    following: 156,
    posts: 42,
    events: 18,
  },
  skills: ['React', 'Node.js', 'Python', 'TypeScript', 'PostgreSQL', 'AWS'],
  achievements: [
    { title: 'Первый вклад в Open Source', date: '2023' },
    { title: 'Участник 10+ хакатонов', date: '2023' },
    { title: 'Ментор 20+ junior разработчиков', date: '2024' },
  ],
  recentActivity: [
    { type: 'post', content: 'Опубликовал новый пост о React hooks', time: '2 часа назад' },
    { type: 'event', content: 'Посетил митап по AI', time: '1 день назад' },
    { type: 'course', content: 'Завершил курс по Machine Learning', time: '3 дня назад' },
  ],
};

export default function Profile() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Обзор', icon: Users },
    { id: 'activity', label: 'Активность', icon: Calendar },
    { id: 'achievements', label: 'Достижения', icon: Award },
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold">Профиль</h1>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <Settings size={20} />
            </Button>
          </div>

          <div className="flex items-center space-x-4 mb-4">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl">
              {mockUser.avatar}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{mockUser.name}</h2>
              <p className="text-white/90">{mockUser.role}</p>
              <div className="flex items-center space-x-1 mt-1">
                <MapPin size={16} />
                <span className="text-sm">{mockUser.location}</span>
              </div>
            </div>
          </div>

          <p className="text-white/90 mb-4">{mockUser.bio}</p>

          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <Calendar size={14} />
              <span>Присоединился {mockUser.joinDate}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star size={14} className="text-yellow-300" />
              <span>4.8 рейтинг</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-card border-b border-border">
        <div className="grid grid-cols-4 gap-4 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{mockUser.stats.followers}</div>
            <div className="text-sm text-muted-foreground">Подписчики</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{mockUser.stats.following}</div>
            <div className="text-sm text-muted-foreground">Подписки</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{mockUser.stats.posts}</div>
            <div className="text-sm text-muted-foreground">Посты</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{mockUser.stats.events}</div>
            <div className="text-sm text-muted-foreground">Мероприятия</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex-1 flex items-center justify-center space-x-2 py-3 text-sm font-medium transition-colors',
                  activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Skills */}
            <div>
              <h3 className="font-semibold mb-3">Навыки</h3>
              <div className="flex flex-wrap gap-2">
                {mockUser.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="font-semibold mb-3">Быстрые действия</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="flex items-center space-x-2 h-auto py-3">
                  <Edit size={16} />
                  <span>Редактировать профиль</span>
                </Button>
                <Button variant="outline" className="flex items-center space-x-2 h-auto py-3">
                  <MessageCircle size={16} />
                  <span>Мои сообщения</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-4">
            <h3 className="font-semibold">Недавняя активность</h3>
            {mockUser.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  {activity.type === 'post' && <MessageCircle size={16} className="text-primary" />}
                  {activity.type === 'event' && <Calendar size={16} className="text-primary" />}
                  {activity.type === 'course' && <BookOpen size={16} className="text-primary" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{activity.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-4">
            <h3 className="font-semibold">Достижения</h3>
            {mockUser.achievements.map((achievement, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Award size={20} className="text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{achievement.title}</p>
                  <p className="text-sm text-muted-foreground">{achievement.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}