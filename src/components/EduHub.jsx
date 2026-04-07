import { useState } from 'react';
import { Search, BookOpen, Play, Users, Clock, Star, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

const mockCourses = [
  {
    id: 1,
    title: 'React для начинающих',
    instructor: 'Анна Петрова',
    avatar: '👩‍💻',
    category: 'Frontend',
    level: 'Начинающий',
    duration: '8 часов',
    students: 1250,
    rating: 4.8,
    price: 'Бесплатно',
    description: 'Полный курс по React с нуля. Изучите основы, компоненты, хуки и создание приложений.',
    tags: ['React', 'JavaScript', 'Frontend'],
    thumbnail: 'https://via.placeholder.com/300x200',
  },
  {
    id: 2,
    title: 'UI/UX Design Fundamentals',
    instructor: 'Максим Иванов',
    avatar: '👨‍🎨',
    category: 'Design',
    level: 'Средний',
    duration: '12 часов',
    students: 890,
    rating: 4.9,
    price: '15 000₸',
    description: 'Основы дизайна интерфейсов. Теория цвета, типографика, композиция и пользовательский опыт.',
    tags: ['UI/UX', 'Design', 'Figma'],
    thumbnail: 'https://via.placeholder.com/300x200',
  },
  {
    id: 3,
    title: 'Python для Data Science',
    instructor: 'Елена Сидорова',
    avatar: '👩‍🔬',
    category: 'Data Science',
    level: 'Продвинутый',
    duration: '16 часов',
    students: 654,
    rating: 4.7,
    price: '25 000₸',
    description: 'Изучите Python для анализа данных, машинного обучения и визуализации.',
    tags: ['Python', 'Data Science', 'Machine Learning'],
    thumbnail: 'https://via.placeholder.com/300x200',
  },
];

const categories = [
  { id: 'all', label: 'Все курсы', icon: BookOpen },
  { id: 'frontend', label: 'Frontend', icon: BookOpen },
  { id: 'backend', label: 'Backend', icon: BookOpen },
  { id: 'design', label: 'Дизайн', icon: BookOpen },
  { id: 'datascience', label: 'Data Science', icon: BookOpen },
  { id: 'mobile', label: 'Mobile', icon: BookOpen },
];

const levels = ['Все уровни', 'Начинающий', 'Средний', 'Продвинутый'];

export default function EduHub() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('Все уровни');

  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' ||
                           course.category.toLowerCase() === selectedCategory;

    const matchesLevel = selectedLevel === 'Все уровни' || course.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Образовательный хаб</h1>
          <p className="text-muted-foreground">Изучайте новые навыки и развивайтесь в IT</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
          <input
            type="text"
            placeholder="Поиск курсов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-input rounded-lg bg-background"
          />
        </div>

        {/* Filters */}
        <div className="space-y-3">
          {/* Categories */}
          <div className="flex space-x-2 overflow-x-auto">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    'flex items-center space-x-2 px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors',
                    selectedCategory === category.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  )}
                >
                  <Icon size={16} />
                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>

          {/* Level Filter */}
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="w-full p-2 border border-input rounded-lg bg-background"
          >
            {levels.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>

        {/* Courses Grid */}
        <div className="grid gap-4">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-card border border-border rounded-lg overflow-hidden">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-32 object-cover"
              />

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{course.title}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs">
                        {course.avatar}
                      </div>
                      <span className="text-sm text-muted-foreground">{course.instructor}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 mb-1">
                      <Star size={14} className="text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{course.rating}</span>
                    </div>
                    <span className={cn(
                      'px-2 py-1 rounded-full text-xs',
                      course.level === 'Начинающий' ? 'bg-green-100 text-green-800' :
                      course.level === 'Средний' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    )}>
                      {course.level}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Clock size={14} />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users size={14} />
                      <span>{course.students}</span>
                    </div>
                  </div>
                  <span className="font-semibold text-primary">{course.price}</span>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {course.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <Button className="w-full">
                  <Play size={16} className="mr-2" />
                  Начать обучение
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
            <p>Курсы не найдены</p>
            <p className="text-sm">Попробуйте изменить фильтры поиска</p>
          </div>
        )}
      </div>
    </div>
  );
}