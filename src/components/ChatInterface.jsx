import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Send, Smile } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { useAppStore } from '../store/store';

  const roomInfoMap = {
    'home': { title: t('community.rooms.home.title'), color: 'text-pink-500' },
    'it': { title: t('community.rooms.it.title'), color: 'text-lime-500' },
    'sport': { title: t('community.rooms.sport.title'), color: 'text-pink-500' },
    'food': { title: t('community.rooms.food.title'), color: 'text-lime-500' },
    'general': { title: t('community.rooms.general.title'), color: 'text-indigo-500' }
  };

export default function ChatInterface() {
  const { t } = useTranslation();
  const { user } = useAppStore();
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  
  const messagesEndRef = useRef(null);
  const roomInfo = roomInfoMap[roomId] || { title: 'Комната', color: 'text-pink-500' };

  useEffect(() => {
    if (user && roomId) {
      loadMessages();
    }
  }, [user, roomId]);

  const loadMessages = async () => {
    // Используем таблицу posts для хранения сообщений комнат
    const { data: msgs, error } = await supabase
      .from('posts')
      .select('*, profiles(first_name, last_name, avatar)')
      .eq('type', `room_${roomId}`)
      .order('created_at', { ascending: true })
      .limit(100); // берем последние 100 для производительности MVP

    if (error) console.error("Error loading room messages:", error);
    if (msgs) {
      setMessages(msgs);
      scrollToBottom();
    }
  };

  useEffect(() => {
    if (!roomId) return;

    const channel = supabase.channel(`realtime:room_${roomId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'posts',
        filter: `type=eq.room_${roomId}`
      }, payload => {
        // Мы загрузили без join'а в realtime, поэтому делаем быстрый fetch автору
        fetchNewMessageWithProfile(payload.new.id);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [roomId]);

  const fetchNewMessageWithProfile = async (msgId) => {
    const { data } = await supabase
      .from('posts')
      .select('*, profiles(first_name, last_name, avatar)')
      .eq('id', msgId)
      .single();
      
    if (data) {
      // Избегаем дублирования если realtime сработал позже локального стейта (наш собственный insert)
      setMessages(prev => {
        if (prev.find(m => m.id === msgId)) return prev;
        return [...prev, data];
      });
      scrollToBottom();
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    const text = newMessage.trim();
    setNewMessage(''); // Очищаем инпут сразу

    // Оптимистичное добавление для плавности
    const tempId = 'temp-' + Date.now();
    const optimisticMsg = {
      id: tempId,
      user_id: user.id,
      content: text,
      created_at: new Date().toISOString(),
      profiles: {
        first_name: user?.user_metadata?.firstName || user?.email?.split('@')[0] || 'Участница',
        last_name: user?.user_metadata?.lastName || '',
        avatar: user?.user_metadata?.avatarUrl || null
      }
    };
    
    setMessages(prev => [...prev, optimisticMsg]);
    scrollToBottom();

    const { data, error } = await supabase.from('posts').insert([{
      user_id: user.id,
      content: text,
      type: `room_${roomId}`
    }]).select().single();
    
    if (error) {
      // откатываем если ошибка
      setMessages(prev => prev.filter(m => m.id !== tempId));
    }
  };

  return (
    <div className="h-[calc(100dvh-100px)] md:h-screen flex flex-col overflow-hidden bg-gradient-to-br from-[#FEFBFF] to-[#F8FBFF] dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      
      <div className="flex flex-col h-full bg-[#F8F9FA]/50 dark:bg-slate-900/50 relative">
        {/* Header */}
        <div className="px-4 py-3 flex items-center bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-700/50 z-10 sticky top-0">
          <button 
            onClick={() => navigate('/app/chats')} 
            className="p-2 mr-2 rounded-xl hover:bg-pink-50 dark:hover:bg-slate-700/50 transition-colors text-pink-500"
          >
            <ArrowLeft size={22} />
          </button>
          
          <div>
            <h3 className={`font-bold text-slate-800 dark:text-white text-[16px] leading-tight flex items-center gap-2`}>
              {roomInfo.title}
            </h3>
            <p className="text-xs font-semibold text-lime-500">{t('chat.globalRoom')}</p>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 no-scrollbar flex flex-col">
          <div className="text-center text-xs font-bold text-slate-400 my-2 bg-white/50 dark:bg-slate-800/50 w-fit mx-auto px-3 py-1 rounded-full">
              {t('chat.welcomeToCommunity')}
          </div>

          {messages.length === 0 && (
            <div className="text-center my-auto text-slate-400 text-sm">
              {t('chat.firstMessage')} 👋
            </div>
          )}

          {messages.map((msg) => {
            const isSent = msg.user_id === user?.id;
            return (
              <div key={msg.id} className={`flex max-w-[85%] ${isSent ? 'self-end' : 'self-start'} gap-2`}>
                {!isSent && (
                  <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 mt-auto mb-1">
                    {msg.profiles?.avatar ? (
                      <img src={msg.profiles.avatar} className="w-full h-full object-cover" alt="avatar" />
                    ) : (
                      <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500">
                        {msg.profiles?.first_name?.charAt(0) || '👤'}
                      </div>
                    )}
                  </div>
                )}
                
                <div className={`flex flex-col ${isSent ? 'items-end' : 'items-start'}`}>
                  {!isSent && (
                    <span className="text-[10px] text-slate-400 font-bold ml-1 mb-0.5">
                      {msg.profiles?.first_name} {msg.profiles?.last_name}
                    </span>
                  )}
                  <div 
                    className={`px-4 py-2.5 rounded-2xl shadow-sm text-[15px] ${
                      isSent 
                        ? 'bg-gradient-to-br from-pink-500 to-lime-500 text-white rounded-br-sm' 
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-sm border border-gray-50 dark:border-slate-700/50'
                    }`}
                  >
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold mt-1 px-1">
                    {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 mb-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-t border-gray-100 dark:border-slate-700/50">
          <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex items-center gap-2 max-w-4xl mx-auto">
            <button type="button" className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors">
              <Smile size={22} />
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={t('chat.typeMessage')}
              className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-xl outline-none text-sm focus:ring-2 focus:ring-pink-100 dark:focus:ring-pink-900 transition-all text-slate-800 dark:text-white"
            />
            <button 
              type="submit"
              disabled={!newMessage.trim()}
              className="p-3 rounded-xl bg-gradient-to-r from-pink-500 to-lime-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 active:scale-95 transition-all shadow-md flex items-center justify-center"
            >
              <Send size={18} className="translate-x-[1px]" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}