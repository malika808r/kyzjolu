import { useState } from 'react';
import { Search, MapPin, Filter, MessageCircle, UserPlus } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

const mockUsers = [
  {
    id: 1,
    name: 'Алексей К.',
    avatar: '👨‍💻',
    role: 'Full Stack Developer',
    skills: ['React', 'Node.js', 'Python'],
    location: 'Алматы',
    interests: ['Web Development', 'AI', 'Open Source'],
    availability: 'Доступен для проектов',
    rating: 4.8,
  },
  {
    id: 2,
    name: 'Мария С.',
    avatar: '👩‍🎨',
    role: 'UI/UX Designer',
    skills: ['Figma', 'Adobe XD', 'Sketch'],
    location: 'Алматы',
    interests: ['Product Design', 'Mobile UI', 'Branding'],
    availability: 'Ищу команду',
    rating: 4.9,
  },
  {
    id: 3,
    name: 'Дмитрий В.',
    avatar: '👨‍🏫',
    role: 'Data Scientist',
    skills: ['Python', 'Machine Learning', 'SQL'],
    location: 'Астана',
    interests: ['AI', 'Big Data', 'Analytics'],
    availability: 'Менторство',
    rating: 4.7,
  },
  {
    id: 4,
    name: 'Екатерина М.',
    avatar: '👩‍🔬',
    role: 'DevOps Engineer',
    skills: ['Docker', 'Kubernetes', 'AWS'],
    location: 'Алматы',
    interests: ['Cloud', 'Infrastructure', 'CI/CD'],
    availability: 'Открыта к сотрудничеству',
    rating: 4.6,
  },
];

const skills = ['React', 'Python', 'JavaScript', 'UI/UX', 'Node.js', 'Machine Learning', 'DevOps', 'Mobile'];

export function FindCompanion() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [locationFilter, setLocationFilter] = useState('');

  const toggleSkill = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSkills = selectedSkills.length === 0 ||
                         selectedSkills.some(skill => user.skills.includes(skill));

    const matchesLocation = !locationFilter || user.location === locationFilter;

    return matchesSearch && matchesSkills && matchesLocation;
  });

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
          <input
            type="text"
            placeholder="Поиск по имени, роли или навыкам..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-input rounded-lg bg-background"
          />
        </div>

        {/* Filters */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium">Фильтры</span>
          </div>

          {/* Location Filter */}
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full p-2 border border-input rounded-lg bg-background"
          >
            <option value="">Все города</option>
            <option value="Алматы">Алматы</option>
            <option value="Астана">Астана</option>
          </select>

          {/* Skills Filter */}
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={cn(
                  'px-3 py-1 rounded-full text-sm transition-colors',
                  selectedSkills.includes(skill)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* Users List */}
        <div className="space-y-3">
          {filteredUsers.map((user) => (
            <div key={user.id} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-xl">
                  {user.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium">{user.name}</h3>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-muted-foreground">★</span>
                      <span className="text-sm">{user.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-primary mb-2">{user.role}</p>
                  <p className="text-sm text-muted-foreground mb-2">{user.availability}</p>

                  <div className="flex items-center space-x-1 text-sm text-muted-foreground mb-2">
                    <MapPin size={14} />
                    <span>{user.location}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {user.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      <MessageCircle size={16} className="mr-1" />
                      Написать
                    </Button>
                    <Button size="sm" variant="outline">
                      <UserPlus size={16} className="mr-1" />
                      Добавить
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <UserPlus size={48} className="mx-auto mb-4 opacity-50" />
            <p>Пользователи не найдены</p>
            <p className="text-sm">Попробуйте изменить фильтры поиска</p>
          </div>
        )}
      </div>
    </div>
  );
}



export default FindCompanion;