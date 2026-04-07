import { useState } from 'react';
import { HelpCircle, MessageCircle, FileText, Phone, Mail, Search, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

const faqCategories = [
  {
    id: 'account',
    title: 'Аккаунт и профиль',
    icon: '👤',
    questions: [
      { id: 1, question: 'Как изменить пароль?', answer: 'Перейдите в настройки профиля и выберите "Изменить пароль".' },
      { id: 2, question: 'Как загрузить фото профиля?', answer: 'В профиле нажмите на аватар и выберите новое изображение.' },
      { id: 3, question: 'Как удалить аккаунт?', answer: 'Свяжитесь с поддержкой через форму обратной связи.' },
    ],
  },
  {
    id: 'events',
    title: 'Мероприятия',
    icon: '📅',
    questions: [
      { id: 4, question: 'Как создать мероприятие?', answer: 'На карте нажмите "+" и заполните форму создания события.' },
      { id: 5, question: 'Как найти мероприятия рядом?', answer: 'Используйте карту или фильтры поиска по категориям.' },
      { id: 6, question: 'Как отменить регистрацию?', answer: 'В деталях мероприятия нажмите "Отменить участие".' },
    ],
  },
  {
    id: 'community',
    title: 'Сообщество',
    icon: '👥',
    questions: [
      { id: 7, question: 'Как написать сообщение?', answer: 'Перейдите в чаты и выберите собеседника или создайте новый чат.' },
      { id: 8, question: 'Как найти единомышленников?', answer: 'Используйте вкладку "Найти" в сообществе с фильтрами по навыкам.' },
      { id: 9, question: 'Как заблокировать пользователя?', answer: 'В профиле пользователя нажмите "Заблокировать".' },
    ],
  },
  {
    id: 'learning',
    title: 'Обучение',
    icon: '📚',
    questions: [
      { id: 10, question: 'Как записаться на курс?', answer: 'В образовательном хабе выберите курс и нажмите "Начать обучение".' },
      { id: 11, question: 'Есть ли бесплатные курсы?', answer: 'Да, многие курсы доступны бесплатно в разделе "Бесплатно".' },
      { id: 12, question: 'Как получить сертификат?', answer: 'После завершения курса сертификат будет доступен в профиле.' },
    ],
  },
];

const contactMethods = [
  {
    id: 'chat',
    title: 'Онлайн-чат',
    description: 'Быстрая помощь 24/7',
    icon: MessageCircle,
    available: true,
  },
  {
    id: 'email',
    title: 'Email поддержка',
    description: 'support@kyzjolu.kz',
    icon: Mail,
    available: true,
  },
  {
    id: 'phone',
    title: 'Телефон',
    description: '+7 (727) 123-45-67',
    icon: Phone,
    available: false,
  },
];

export default function Support() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const filteredCategories = faqCategories.filter(category =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.questions.some(q =>
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <HelpCircle size={32} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Поддержка</h1>
          <p className="text-muted-foreground">Как мы можем вам помочь?</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
          <input
            type="text"
            placeholder="Поиск по вопросам..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-input rounded-lg bg-background"
          />
        </div>

        {/* FAQ Categories */}
        {!selectedCategory ? (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Часто задаваемые вопросы</h2>
            <div className="grid gap-3">
              {filteredCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category)}
                  className="flex items-center space-x-4 p-4 bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-2xl">
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{category.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {category.questions.length} вопросов
                    </p>
                  </div>
                  <ChevronRight size={20} className="text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedCategory(null)}
              >
                ←
              </Button>
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-xl">
                {selectedCategory.icon}
              </div>
              <h2 className="text-lg font-semibold">{selectedCategory.title}</h2>
            </div>

            <div className="space-y-3">
              {selectedCategory.questions.map((question) => (
                <div key={question.id} className="border border-border rounded-lg">
                  <button
                    onClick={() => setExpandedQuestion(
                      expandedQuestion === question.id ? null : question.id
                    )}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                  >
                    <span className="font-medium">{question.question}</span>
                    <ChevronRight
                      size={20}
                      className={cn(
                        'text-muted-foreground transition-transform',
                        expandedQuestion === question.id && 'rotate-90'
                      )}
                    />
                  </button>
                  {expandedQuestion === question.id && (
                    <div className="px-4 pb-4">
                      <p className="text-muted-foreground">{question.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Methods */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Связаться с нами</h2>
          <div className="grid gap-3">
            {contactMethods.map((method) => {
              const Icon = method.icon;
              return (
                <div
                  key={method.id}
                  className={cn(
                    'flex items-center space-x-4 p-4 border border-border rounded-lg',
                    method.available
                      ? 'bg-card hover:bg-muted/50 cursor-pointer transition-colors'
                      : 'bg-muted/50 opacity-60'
                  )}
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon size={24} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{method.title}</h3>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </div>
                  {method.available && (
                    <ChevronRight size={20} className="text-muted-foreground" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Additional Help */}
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <FileText size={20} className="text-primary mt-0.5" />
            <div>
              <h3 className="font-medium mb-1">Не нашли ответ?</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Если вы не нашли ответ на свой вопрос, свяжитесь с нашей командой поддержки.
                Мы ответим в течение 24 часов.
              </p>
              <Button size="sm">
                Написать в поддержку
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}