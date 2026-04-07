import { useState } from 'react';
import { MapPin, Search, Filter, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

const mockEvents = [
  {
    id: 1,
    title: 'React Meetup',
    location: 'ТЦ Галерея, Алматы',
    time: '19:00',
    attendees: 45,
    category: 'tech',
    coordinates: { lat: 43.238949, lng: 76.889709 },
  },
  {
    id: 2,
    title: 'Python Workshop',
    location: 'TechHub, Алматы',
    time: '18:30',
    attendees: 23,
    category: 'education',
    coordinates: { lat: 43.256670, lng: 76.928610 },
  },
  {
    id: 3,
    title: 'UI/UX Design Meetup',
    location: 'Coworking Space, Алматы',
    time: '20:00',
    attendees: 67,
    category: 'design',
    coordinates: { lat: 43.222015, lng: 76.851248 },
  },
];

const categories = [
  { id: 'all', label: 'Все', color: 'bg-gray-100 text-gray-800' },
  { id: 'tech', label: 'Технологии', color: 'bg-blue-100 text-blue-800' },
  { id: 'education', label: 'Обучение', color: 'bg-green-100 text-green-800' },
  { id: 'design', label: 'Дизайн', color: 'bg-purple-100 text-purple-800' },
  { id: 'networking', label: 'Нетворкинг', color: 'bg-pink-100 text-pink-800' },
];

export default function HomeMap() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = mockEvents.filter(event => {
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Карта мероприятий</h1>
          <Button size="icon" variant="outline">
            <Filter size={20} />
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
          <input
            type="text"
            placeholder="Поиск мероприятий..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background"
          />
        </div>

        {/* Categories */}
        <div className="flex space-x-2 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                'px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors',
                selectedCategory === category.id
                  ? category.color
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        {/* Mock Map Background */}
        <div className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <MapPin size={48} className="mx-auto mb-2" />
            <p>Карта мероприятий</p>
            <p className="text-sm">Интеграция с картами в разработке</p>
          </div>
        </div>

        {/* Event Markers */}
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="absolute transform -translate-x-1/2 -translate-y-full"
            style={{
              left: `${Math.random() * 60 + 20}%`,
              top: `${Math.random() * 60 + 20}%`,
            }}
          >
            <div className="bg-primary text-primary-foreground p-2 rounded-lg shadow-lg">
              <MapPin size={16} />
            </div>
          </div>
        ))}
      </div>

      {/* Events List */}
      <div className="bg-white dark:bg-gray-900 border-t border-border max-h-64 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Ближайшие мероприятия</h2>
            <Button size="sm">
              <Plus size={16} className="mr-1" />
              Создать
            </Button>
          </div>

          <div className="space-y-3">
            {filteredEvents.map((event) => (
              <div key={event.id} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <MapPin size={20} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">{event.location}</p>
                  <p className="text-sm text-muted-foreground">{event.time} • {event.attendees} участников</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}