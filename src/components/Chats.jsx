import { useState } from 'react';
import { Search, MessageCircle, MoreHorizontal, Send } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

const mockChats = [
  {
    id: 1,
    user: {
      name: 'Анна Петрова',
      avatar: '👩‍💻',
      role: 'Frontend Developer',
    },
    lastMessage: 'Спасибо за помощь с React! Очень полезно было.',
    timestamp: '10 мин назад',
    unread: 2,
    online: true,
  },
  {
    id: 2,
    user: {
      name: 'Максим Иванов',
      avatar: '👨‍🎨',
      role: 'UI/UX Designer',
    },
    lastMessage: 'Когда следующая встреча?',
    timestamp: '1 час назад',
    unread: 0,
    online: false,
  },
  {
    id: 3,
    user: {
      name: 'Команда React',
      avatar: '⚛️',
      role: 'Групповой чат',
    },
    lastMessage: 'Елена: Кто-нибудь пробовал React 19?',
    timestamp: '2 часа назад',
    unread: 5,
    online: true,
  },
  {
    id: 4,
    user: {
      name: 'TechHub Алматы',
      avatar: '🏢',
      role: 'Сообщество',
    },
    lastMessage: 'Новое мероприятие: Python Workshop',
    timestamp: 'Вчера',
    unread: 1,
    online: false,
  },
];

const mockMessages = [
  { id: 1, text: 'Привет! Как дела?', sender: 'other', timestamp: '10:30' },
  { id: 2, text: 'Привет! Всё хорошо, спасибо. А у тебя?', sender: 'me', timestamp: '10:31' },
  { id: 3, text: 'Тоже неплохо. Работаю над новым проектом.', sender: 'other', timestamp: '10:32' },
  { id: 4, text: 'Звучит интересно! Расскажи подробнее.', sender: 'me', timestamp: '10:33' },
  { id: 5, text: 'Это мобильное приложение для фитнеса. Использую React Native.', sender: 'other', timestamp: '10:34' },
];

export function Chats() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = mockChats.filter(chat =>
    chat.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sendMessage = () => {
    if (message.trim()) {
      // В реальном приложении здесь был бы API вызов
      console.log('Отправка сообщения:', message);
      setMessage('');
    }
  };

  return (
    <div className="h-full flex flex-col">
      {!selectedChat ? (
        // Chat List
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <input
                type="text"
                placeholder="Поиск чатов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background"
              />
            </div>

            <div className="space-y-2">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className="flex items-center space-x-3 p-3 bg-card border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <div className="relative">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-lg">
                      {chat.user.avatar}
                    </div>
                    {chat.online && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium truncate">{chat.user.name}</h3>
                      <span className="text-xs text-muted-foreground">{chat.timestamp}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                  </div>

                  {chat.unread > 0 && (
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">
                      {chat.unread}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // Chat View
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedChat(null)}
              >
                ←
              </Button>
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-lg">
                {selectedChat.user.avatar}
              </div>
              <div>
                <h3 className="font-medium">{selectedChat.user.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedChat.user.role}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreHorizontal size={20} />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {mockMessages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'flex',
                  msg.sender === 'me' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-xs px-4 py-2 rounded-lg',
                    msg.sender === 'me'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  <p>{msg.text}</p>
                  <span className="text-xs opacity-70 mt-1 block">{msg.timestamp}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-border">
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Напишите сообщение..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1 px-4 py-2 border border-input rounded-lg bg-background"
              />
              <Button onClick={sendMessage} size="icon">
                <Send size={20} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}