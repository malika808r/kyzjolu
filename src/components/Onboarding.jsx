import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronRight, MapPin, Users, GraduationCap, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

const slides = [
  {
    title: 'Добро пожаловать в KyzJolu!',
    description: 'Приложение для поиска единомышленников и развития в сфере IT',
    icon: Heart,
    color: 'text-pink-500',
  },
  {
    title: 'Найди своё место',
    description: 'Используй карту для поиска мероприятий и сообществ рядом с тобой',
    icon: MapPin,
    color: 'text-blue-500',
  },
  {
    title: 'Присоединяйся к сообществу',
    description: 'Общайся, делись опытом и находи новых друзей в IT',
    icon: Users,
    color: 'text-green-500',
  },
  {
    title: 'Развивайся вместе',
    description: 'Получай доступ к образовательным материалам и курсам',
    icon: GraduationCap,
    color: 'text-purple-500',
  },
];

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate('/app/feed');
    }
  };

  const skip = () => {
    navigate('/app/feed');
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="text-center mb-8">
          <div className={cn(
            'w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto',
            slide.color,
            'bg-white dark:bg-gray-800 shadow-lg'
          )}>
            <Icon size={40} />
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-4">
            {slide.title}
          </h1>

          <p className="text-lg text-muted-foreground max-w-sm">
            {slide.description}
          </p>
        </div>

        <div className="flex space-x-2 mb-8">
          {slides.map((_, index) => (
            <div
              key={index}
              className={cn(
                'w-2 h-2 rounded-full transition-colors',
                index === currentSlide
                  ? 'bg-primary'
                  : 'bg-muted-foreground/30'
              )}
            />
          ))}
        </div>

        <div className="w-full max-w-sm space-y-4">
          <Button
            onClick={nextSlide}
            className="w-full"
            size="lg"
          >
            {currentSlide === slides.length - 1 ? 'Начать' : 'Далее'}
            <ChevronRight className="ml-2" size={20} />
          </Button>

          {currentSlide < slides.length - 1 && (
            <Button
              onClick={skip}
              variant="ghost"
              className="w-full"
            >
              Пропустить
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}