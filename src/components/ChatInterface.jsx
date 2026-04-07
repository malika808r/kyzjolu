import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useChatStore, useAuthStore } from '../store/store';
import { Send, Phone, Video } from 'lucide-react';
import { Button } from './ui/button';

export default function ChatInterface() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState('');

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && activeChat) {
      useChatStore.getState().sendMessage(activeChat, message);
      setMessage('');
    }
  };

  return (
    <div className="h-screen flex bg-gray-100 dark:bg-gray-900">
      {/* Chat List */}
      <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-foreground">{t('navigation.chats')}</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {/* Chat items would go here */}
          <div className="text-center text-muted-foreground py-12">
            {t('common.noResults')}
          </div>
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-foreground">Chat</h3>
                <p className="text-sm text-muted-foreground">Online</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Phone size={20} />
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Video size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {/* Messages would go here */}
            </div>

            <form onSubmit={sendMessage} className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button type="submit">
                <Send size={20} />
              </Button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center">
            <div>
              <p className="text-muted-foreground text-lg">{t('common.selectItem')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
