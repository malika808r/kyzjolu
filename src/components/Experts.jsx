import { useState } from 'react';
import { Search, Star, MessageCircle, Calendar, Award, Users } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

const mockExperts = [
  {
    id: 1,
    name: 'Александр Сергеев',
    avatar: '👨‍🏫',
    title: 'Senior React Developer',
    company: 'TechCorp',
    rating: 4.9,
    reviews: 127,
    experience: '8 лет',
    specializations: ['React', 'TypeScript', 'Node.js'],
    hourlyRate: 5000,
    availability: 'Доступен',
    description: 'Опытный разработчик с экспертизой в современных веб-технологиях. Помогаю с архитектурой приложений и код-ревью.',
    achievements: ['100+ завершенных проектов', 'Ментор 50+ junior разработчиков'],
  },
  {
    id: 2,
    name: 'Елена Волкова',
    avatar: '👩‍🎨',
    title: 'Lead UI/UX Designer',
    company: 'Design Studio',
    rating: 4.8,
    reviews: 89,
    experience: '6 лет',
    specializations: ['UI/UX Design', 'Figma', 'User Research'],
    hourlyRate: 4500,
    availability: 'Занята до мая',
    description: 'Специализируюсь на создании интуитивных интерфейсов. Опыт работы с продуктами B2B и B2C.',
    achievements: ['15+ дизайн-систем', 'Победитель UX Awards 2023'],
  },
  {
    id: 3,
    name: 'Дмитрий Новиков',
    avatar: '👨‍🔬',
    title: 'Data Science Expert',
    company: 'AI Solutions',
    rating: 4.7,
    reviews: 156,
    experience: '10 лет',
    specializations: ['Machine Learning', 'Python', 'Big Data'],
    hourlyRate: 6000,
    availability: 'Доступен',
    description: 'Эксперт в области машинного обучения и анализа данных. Помогаю с ML проектами от идеи до продакшена.',
    achievements: ['PhD в Computer Science', '20+ публикаций', 'CTO стартапа'],
  },
  {
    id: 4,
    name: 'Мария Иванова',
    avatar: '👩‍💼',
    title: 'Product Manager',
    company: 'ProductLab',
    rating: 4.6,
    reviews: 73,
    experience: '7 лет',
    specializations: ['Product Strategy', 'Agile', 'Analytics'],
    hourlyRate: 5500,
    availability: 'Доступен',
    description: 'Помогаю командам строить продукты, которые решают реальные проблемы пользователей.',
    achievements: ['5+ успешных продуктов', 'Certified Scrum Master'],
  },
];

export function Experts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');

  const specializations = ['React', 'UI/UX Design', 'Machine Learning', 'Product Management', 'Python', 'TypeScript', 'Node.js'];

  const filteredExperts = mockExperts.filter(expert => {
    const matchesSearch = expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         expert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         expert.specializations.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSpecialization = !selectedSpecialization ||
                                 expert.specializations.includes(selectedSpecialization);

    return matchesSearch && matchesSpecialization;
  });

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
          <input
            type="text"
            placeholder="Поиск экспертов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-input rounded-lg bg-background"
          />
        </div>

        {/* Specializations Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedSpecialization('')}
            className={cn(
              'px-3 py-1 rounded-full text-sm transition-colors',
              !selectedSpecialization
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            Все
          </button>
          {specializations.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialization(spec)}
              className={cn(
                'px-3 py-1 rounded-full text-sm transition-colors',
                selectedSpecialization === spec
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {spec}
            </button>
          ))}
        </div>

        {/* Experts List */}
        <div className="space-y-4">
          {filteredExperts.map((expert) => (
            <div key={expert.id} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-2xl">
                  {expert.avatar}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{expert.name}</h3>
                      <p className="text-primary">{expert.title}</p>
                      <p className="text-sm text-muted-foreground">{expert.company}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        <Star size={16} className="text-yellow-500 fill-current" />
                        <span className="font-medium">{expert.rating}</span>
                        <span className="text-sm text-muted-foreground">({expert.reviews})</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{expert.experience}</p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">{expert.description}</p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {expert.specializations.map((spec) => (
                      <span
                        key={spec}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Award size={14} />
                        <span>{expert.achievements[0]}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users size={14} />
                        <span>{expert.achievements[1]}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg">{expert.hourlyRate}₸/час</p>
                      <p className={cn(
                        'text-sm',
                        expert.availability === 'Доступен' ? 'text-green-600' : 'text-orange-600'
                      )}>
                        {expert.availability}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button className="flex-1">
                      <MessageCircle size={16} className="mr-2" />
                      Связаться
                    </Button>
                    <Button variant="outline">
                      <Calendar size={16} className="mr-2" />
                      Записаться
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredExperts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Award size={48} className="mx-auto mb-4 opacity-50" />
            <p>Эксперты не найдены</p>
            <p className="text-sm">Попробуйте изменить критерии поиска</p>
          </div>
        )}
      </div>
    </div>
  );
}