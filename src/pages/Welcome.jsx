import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { MapPin, Heart, Users, Zap } from 'lucide-react';
import { Button } from '../components/ui/button';

const features = [
  {
    icon: Heart,
    title: 'Безопасность',
    description: 'SOS кнопка с мгновенной отправкой координат',
  },
  {
    icon: MapPin,
    title: 'Умная карта',
    description: 'Видь безопасные места и попутчиц вокруг',
  },
  {
    icon: Users,
    title: 'Сообщество',
    description: 'Найди поддержку и новых подруг',
  },
  {
    icon: Zap,
    title: 'Развитие',
    description: 'Благодаря воркшопам и курсам для профессионального роста',
  },
];

export default function Welcome() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <div className="mb-6">
            <span className="text-6xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              KyzJolu
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Твоя безопасность — наш приоритет
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Платформа для девушек, которая обеспечивает безопасность, поддержку сообщества и профессиональный рост в городской среде
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button
            onClick={() => navigate('/auth/login')}
            className="px-8 py-6 text-lg bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-semibold"
          >
            Вход
          </Button>
          <button
            onClick={() => navigate('/auth/register')}
            className="px-8 py-6 text-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-foreground border-2 border-pink-500 rounded-lg font-semibold transition-colors"
          >
            Регистрация
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-pink-100 dark:bg-pink-900/20 rounded-lg">
                    <Icon size={28} className="text-pink-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-4 bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
          <div className="text-center">
            <div className="text-3xl font-bold text-pink-500 mb-1">500K+</div>
            <div className="text-sm text-muted-foreground">Девушек</div>
          </div>
          <div className="text-center border-l border-r border-gray-200 dark:border-gray-700">
            <div className="text-3xl font-bold text-pink-500 mb-1">100+</div>
            <div className="text-sm text-muted-foreground">Городов</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-pink-500 mb-1">24/7</div>
            <div className="text-sm text-muted-foreground">Поддержка</div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-16 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-center mb-8 text-foreground">
            Что говорят пользователи
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                "Чувствую себя в безопасности благодаря SOS кнопке. Это приложение изменило, как я кораблюсь в городе."
              </p>
              <p className="font-semibold text-foreground">— Айгуль, Бишкек</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                "Нашла друзей и наставников в IT. Сообщество очень поддерживающее!"
              </p>
              <p className="font-semibold text-foreground">— Марина, Алматы</p>
            </div>
          </div>
        </div>

        {/* Trust Section */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">Доверяется компаниями и организациями</p>
          <div className="flex justify-center items-center gap-8 flex-wrap opacity-50">
            <span className="font-semibold">TechGirls Kyrgyzstan</span>
            <span className="font-semibold">IT Salon</span>
            <span className="font-semibold">Women in Tech</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-20 border-t border-gray-200 dark:border-gray-700 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center text-muted-foreground text-sm">
          <p>
            &copy; 2024 KyzJolu. Все права защищены. | 
            <a href="#" className="hover:text-primary ml-2">Политика конфиденциальности</a> | 
            <a href="#" className="hover:text-primary ml-2">Условия использования</a>
          </p>
        </div>
      </div>
    </div>
  );
}
