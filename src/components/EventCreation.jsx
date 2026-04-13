import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/store';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Button } from './ui/button';

export default function EventCreation() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    maxParticipants: 50,
    category: 'meetup',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.location) {
      setError('Заполните все обязательные поля');
      return;
    }

    setLoading(true);
    setError('');
    try {
      // TODO: Реализовать сохранение события в Supabase
      console.log('Event created:', formData);
      navigate('/app/feed');
    } catch (err) {
      setError('Ошибка при создании события');
      console.error('Error creating event:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-1">{t('events.createEvent')}</h1>
        <p className="text-slate-800 font-bold">{t('events.createDescription')}</p>
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-lg text-red-600 text-sm border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleCreateEvent} className="space-y-6 bg-white p-6 rounded-2xl">
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-2 font-black uppercase tracking-wide">
            {t('events.eventTitle')}
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Музыкальный фестиваль"
            className="w-full px-4 py-2 border border-state-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-900 mb-2 font-black uppercase tracking-wide">
            {t('events.description')}
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Опишите мероприятие..."
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            rows="4"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2 font-black uppercase tracking-wide">
              {t('events.date')}
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2 font-black uppercase tracking-wide">
              {t('events.time')}
            </label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-900 mb-2 font-black uppercase tracking-wide">
            {t('events.location')}
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="г. Бишкек, Парк молодежи"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2 font-black uppercase tracking-wide">
              {t('events.maxParticipants')}
            </label>
            <input
              type="number"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleChange}
              min="1"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2 font-black uppercase tracking-wide">
              {t('events.eventCategory')}
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="meetup">Встречи</option>
              <option value="workshop">Воркшопы</option>
              <option value="conference">Конференции</option>
              <option value="sport">Спорт</option>
              <option value="culture">Культура</option>
            </select>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-white"
        >
          {loading ? 'Создаю...' : 'Создать мероприятие'}
        </Button>
      </form>
    </div>
  );
}
