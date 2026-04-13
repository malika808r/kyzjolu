import { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { FileText, Calendar, Plus, X, Heart, MessageCircle } from 'lucide-react';

export default function SavedSection({ user }) {
  const [activeSubTab, setActiveSubTab] = useState('notes'); // notes | posts | profiles
  
  const [notes, setNotes] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [savedProfiles, setSavedProfiles] = useState([]);
  
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    // 1. Мероприятия (Заметки)
    const { data: nData } = await supabase.from('notes').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    if (nData) setNotes(nData);

    // 2. Сохраненные посты
    const { data: pData } = await supabase
      .from('saved_posts')
      .select('post_id, posts(*, profiles:user_id(first_name, last_name, avatar))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
      
    if (pData) {
      const formattedPosts = pData.map(saved => ({
        id: saved.posts.id,
        content: saved.posts.content,
        image_url: saved.posts.image_url,
        likes_count: saved.posts.likes_count,
        comments_count: saved.posts.comments_count,
        authorName: saved.posts.profiles?.first_name ? `${saved.posts.profiles.first_name} ${saved.posts.profiles.last_name || ''}` : 'Пользователь',
        authorAvatar: (saved.posts.profiles?.avatar && saved.posts.profiles?.avatar !== '👤') ? saved.posts.profiles?.avatar : 'https://cdn-icons-png.flaticon.com/512/847/847969.png',
        time: new Date(saved.posts.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }));
      setSavedPosts(formattedPosts);
    }

    // 3. Сохраненные пользователи
    const { data: uData } = await supabase
      .from('saved_users')
      .select('saved_profile_id, profiles!saved_users_saved_profile_id_fkey(id, first_name, last_name, avatar, interests, skills)')
      .eq('user_id', user.id);
      
    if (uData) {
      const formattedUsers = uData.map(saved => ({
        id: saved.profiles?.id,
        name: saved.profiles?.first_name ? `${saved.profiles.first_name} ${saved.profiles.last_name || ''}` : '',
        image: (saved.profiles?.avatar && saved.profiles.avatar !== '👤') ? saved.profiles.avatar : 'https://cdn-icons-png.flaticon.com/512/847/847969.png',
        tags: saved.profiles?.interests || [],
        skills: saved.profiles?.skills || []
      })).filter(u => u.name);
      setSavedProfiles(formattedUsers);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    const { data } = await supabase.from('notes').insert([{ user_id: user.id, content: newNote }]).select().single();
    if (data) {
      setNotes([data, ...notes]);
      setNewNote('');
    }
  };

  const handleDeleteNote = async (id) => {
    await supabase.from('notes').delete().eq('id', id);
    setNotes(notes.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Под-вкладки */}
      <div className="flex bg-white/50 dark:bg-slate-800/50 p-1 rounded-2xl mx-5">
        <button onClick={() => setActiveSubTab('notes')} className={`flex-1 py-1.5 text-[13px] font-bold rounded-xl transition-colors ${activeSubTab === 'notes' ? 'bg-white dark:bg-slate-700 text-pink-500 shadow-sm' : 'text-slate-800 dark:text-slate-200 font-black uppercase tracking-wide'}`}>Мероприятия</button>
        <button onClick={() => setActiveSubTab('posts')} className={`flex-1 py-1.5 text-[13px] font-bold rounded-xl transition-colors ${activeSubTab === 'posts' ? 'bg-white dark:bg-slate-700 text-pink-500 shadow-sm' : 'text-slate-800 dark:text-slate-200 font-black uppercase tracking-wide'}`}>Посты</button>
        <button onClick={() => setActiveSubTab('profiles')} className={`flex-1 py-1.5 text-[13px] font-bold rounded-xl transition-colors ${activeSubTab === 'profiles' ? 'bg-white dark:bg-slate-700 text-pink-500 shadow-sm' : 'text-slate-800 dark:text-slate-200 font-black uppercase tracking-wide'}`}>Люди</button>
      </div>

      <div className="px-5 pb-20">
        
        {/* === МЕРОПРИЯТИЯ === */}
        {activeSubTab === 'notes' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input 
                 type="text" 
                 value={newNote}
                 onChange={(e) => setNewNote(e.target.value)}
                 placeholder="Добавить мероприятие или план..." 
                 className="flex-1 bg-white dark:bg-slate-800 border-none px-4 py-3 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-900 transition-shadow dark:text-white"
              />
              <button onClick={handleAddNote} className="bg-pink-500 text-white p-3 rounded-2xl active:scale-95 transition-transform"><Plus size={20} /></button>
            </div>
            {notes.length === 0 && <p className="text-center text-sm text-slate-700 dark:text-slate-300 font-black uppercase tracking-widest py-10">Тут будут ваши запланированные мероприятия 📅</p>}
            {notes.map(note => (
              <div key={note.id} className="relative bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                <button onClick={() => handleDeleteNote(note.id)} className="absolute top-3 right-3 text-slate-700 hover:text-red-600 dark:text-slate-400 font-black"><X size={16} /></button>
                <div className="flex gap-2 text-slate-800 dark:text-slate-200"><Calendar size={18} className="text-pink-400 mt-0.5" /> <p className="text-sm font-medium whitespace-pre-wrap">{note.content}</p></div>
              </div>
            ))}
          </div>
        )}

        {/* === ПОСТЫ === */}
        {activeSubTab === 'posts' && (
          <div className="space-y-4">
            {savedPosts.length === 0 && <p className="text-center text-sm text-slate-700 dark:text-slate-300 font-black uppercase tracking-widest py-10">Вы еще не сохраняли посты 🔖</p>}
            {savedPosts.map(post => (
              <div key={post.id} className="bg-white/80 dark:bg-slate-800/80 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex gap-3 mb-2">
                  <img src={post.authorAvatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white">{post.authorName}</h3>
                    <p className="text-[10px] text-slate-700 dark:text-slate-300 font-black uppercase tracking-wider">{post.time}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium mb-3">{post.content}</p>
                {post.image_url && <img src={post.image_url} className="w-full h-auto max-h-[300px] object-cover rounded-xl mb-3" />}
                <div className="flex items-center gap-4 text-slate-700 dark:text-slate-200 text-xs font-black uppercase tracking-wide">
                  <div className="flex items-center gap-1"><Heart size={14}/> {post.likes_count}</div>
                  <div className="flex items-center gap-1"><MessageCircle size={14}/> {post.comments_count}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* === ЛЮДИ === */}
        {activeSubTab === 'profiles' && (
          <div className="grid grid-cols-2 gap-3">
            {savedProfiles.length === 0 && <p className="col-span-2 text-center text-sm text-slate-700 dark:text-slate-300 font-black uppercase tracking-widest py-10">Вы еще не сохраняли людей 👩‍💻</p>}
            {savedProfiles.map(p => (
              <div key={p.id} className="flex flex-col items-center p-4 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm text-center">
                <img src={p.image} className="w-14 h-14 rounded-full object-cover mb-2 border-2 border-pink-100 dark:border-slate-600" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-white w-full truncate">{p.name}</h3>
                <p className="text-[10px] text-pink-500 font-medium w-full truncate">{p.tags?.[0] || 'Пользователь'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
