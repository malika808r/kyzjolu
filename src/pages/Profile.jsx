import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/store';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, Sun, Moon,
  LogOut, MapPin, Shield, UserPlus, Phone, X, Check
} from 'lucide-react';
import i18nConfig from '../i18n/config';
import { supabase } from '../supabase';

import SavedSection from '../components/profile/SavedSection';
import EditProfileModal from '../components/profile/EditProfileModal';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, language, setLanguage, observations } = useAppStore();
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();

  const [activeTab, setActiveTab] = useState('profile');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // ---- ДОВЕРЕННЫЕ КОНТАКТЫ (Supabase) ----
  const [trustedContacts, setTrustedContacts] = useState([]);
  const [contactsLoading, setContactsLoading] = useState(true);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [contactSaved, setContactSaved] = useState(false);

  // Загружаем контакты при монтировании
  useEffect(() => {
    if (user) fetchContacts();
  }, [user]);

  const fetchContacts = async () => {
    setContactsLoading(true);
    const { data, error } = await supabase
      .from('trusted_contacts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });
    if (!error && data) setTrustedContacts(data);
    setContactsLoading(false);
  };

  const addContact = async () => {
    const phone = newContactPhone.trim();
    const name = newContactName.trim() || 'Контакт';
    if (!phone || !user) return;

    const { data, error } = await supabase
      .from('trusted_contacts')
      .insert([{ user_id: user.id, name, phone }])
      .select()
      .single();

    if (!error && data) {
      setTrustedContacts(prev => [...prev, data]);
      setNewContactName('');
      setNewContactPhone('');
      setContactSaved(true);
      setTimeout(() => setContactSaved(false), 2000);
    }
  };

  const removeContact = async (id) => {
    const { error } = await supabase
      .from('trusted_contacts')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    if (!error) setTrustedContacts(prev => prev.filter(c => c.id !== id));
  };

  const [profileData, setProfileData] = useState({
    firstName: user?.user_metadata?.firstName || 'Малика',
    lastName: user?.user_metadata?.lastName || '',
    email: user?.email || 'malika@example.com',
    bio: user?.user_metadata?.bio || '',
    skills: user?.user_metadata?.skills || ['Frontend', 'UI/UX', 'Менторство'],
    interests: user?.user_metadata?.interests || ['Кодинг', 'Волонтерство', 'Чтение'],
    avatarUrl: user?.user_metadata?.avatarUrl || null
  });

  const allInterests = ['Кодинг', 'Чтение', 'Волонтерство', 'Дизайн', 'Путешествия', 'Спорт', 'Музыка', 'Искусство'];
  const allSkills = ['UI/UX', 'Frontend', 'Backend', 'Маркетинг', 'Менторство', 'Копирайтинг', 'Менеджмент', 'SMM'];

  const toggleInterest = (interest) => {
    setProfileData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const toggleSkill = (skill) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return alert('Файл слишком большой');
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileData(prev => ({ ...prev, avatarUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) navigate('/');
  };

  const toggleLanguage = () => {
    const newLang = language === 'ru' ? 'en' : language === 'en' ? 'ky' : 'ru';
    setLanguage(newLang);
    i18nConfig.changeLanguage(newLang);
  };

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <div className="min-h-full w-full overflow-y-auto overflow-x-hidden no-scrollbar bg-gradient-to-br from-indigo-50 via-pink-50 to-lime-50 dark:from-slate-900 dark:via-lime-950 dark:to-slate-900 transition-colors duration-500">

      {/* HEADER COVER */}
      <div className="relative overflow-visible mb-16">
        <div className="h-48 w-full bg-gradient-to-br from-pink-400 via-lime-500 to-lime-600 dark:from-pink-800 dark:via-lime-900 dark:to-lime-900 relative overflow-hidden rounded-b-[40px] shadow-sm transition-colors duration-500">
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="absolute -top-10 -right-10 w-40 h-40 bg-pink-300 dark:bg-pink-500 rounded-full blur-3xl" />
          <motion.div animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.6, 0.4] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} className="absolute -bottom-10 -left-10 w-48 h-48 bg-lime-400 dark:bg-lime-600 rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(white 2px, transparent 2px)', backgroundSize: '20px 20px' }} />
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 -bottom-12 z-10 flex flex-col items-center w-full">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, type: 'spring' }} className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-pink-400 via-lime-400 to-lime-400 rounded-full blur-lg opacity-60 animate-pulse" />
            <div className="relative w-28 h-28 rounded-full border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden bg-white dark:bg-slate-800 flex items-center justify-center text-4xl font-black text-pink-500 transition-colors duration-500">
              {profileData.avatarUrl
                ? <img src={profileData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                : profileData.firstName.charAt(0)
              }
            </div>
          </motion.div>
        </div>
      </div>

      {/* NAME / EMAIL */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center px-5 mb-6">
        <h1 className="text-2xl font-black bg-gradient-to-r from-pink-600 via-lime-600 to-lime-600 dark:from-pink-400 dark:via-lime-400 dark:to-lime-400 bg-clip-text text-transparent mb-1">
          {profileData.firstName} {profileData.lastName}
        </h1>
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-3">{profileData.email}</p>
        
        {profileData.bio && (
          <p className="text-sm text-slate-900 dark:text-slate-200 max-w-md mx-auto mb-4">{profileData.bio}</p>
        )}

        <button
          onClick={() => setIsEditModalOpen(true)}
          className="px-4 py-1.5 bg-white/50 dark:bg-slate-800/50 rounded-full text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm border border-white dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 transition-colors active:scale-95"
        >
          {t('profile.editProfile')}
        </button>
      </motion.div>

      {/* TABS */}
      <div className="flex gap-2 mx-5 mb-6 p-1 bg-white/50 dark:bg-slate-800/70 rounded-[18px] border border-white dark:border-slate-700 shadow-sm backdrop-blur-md">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-2 font-bold text-[13px] rounded-2xl transition-all ${activeTab === 'profile' ? 'bg-white dark:bg-slate-700 shadow-sm text-pink-500' : 'text-slate-800 dark:text-slate-200'}`}
        >
          Профиль
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex-1 py-2 font-bold text-[13px] rounded-2xl transition-all ${activeTab === 'saved' ? 'bg-white dark:bg-slate-700 shadow-sm text-pink-500' : 'text-slate-800 dark:text-slate-200'}`}
        >
          Сохраненное
        </button>
      </div>

      {/* TAB CONTENT: PROFILE */}
      {activeTab === 'profile' && (
        <div className="px-5 pb-24 space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-[24px] shadow-sm border border-white dark:border-slate-700 overflow-hidden">
            <div className="p-2">
              <button onClick={toggleLanguage} className="w-full flex items-center justify-between p-3 hover:bg-white/50 dark:hover:bg-slate-700/50 rounded-2xl transition-all group active:scale-[0.98]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-lime-100 dark:bg-lime-900/50 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-lime-600 dark:text-lime-400" />
                  </div>
                  <span className="text-slate-800 dark:text-white font-bold text-sm">{t('common.language')}</span>
                </div>
                <span className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-lg">{language}</span>
              </button>

              <button onClick={toggleTheme} className="w-full flex items-center justify-between p-3 hover:bg-white/50 dark:hover:bg-slate-700/50 rounded-2xl transition-all group active:scale-[0.98]">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${theme === 'dark' ? 'bg-indigo-100 dark:bg-indigo-900/50' : 'bg-amber-100'}`}>
                    {theme === 'dark'
                      ? <Moon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      : <Sun className="w-5 h-5 text-amber-600" />
                    }
                  </div>
                  <span className="text-slate-800 dark:text-white font-bold text-sm">{t('common.theme')}</span>
                </div>
                <span className="text-xs text-slate-800 dark:text-slate-200 font-bold">
                  {theme === 'dark' ? t('common.dark') : t('common.light')}
                </span>
              </button>

            </div>
          </motion.div>

          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3">{t('profile.skills')} & {t('profile.interests')}</h3>
            <div className="flex flex-wrap gap-2">
              {profileData.skills.map(s => (
                <span key={s} className="px-3 py-1 bg-lime-100 dark:bg-lime-900/40 text-lime-600 dark:text-lime-300 rounded-full text-xs font-bold border border-lime-200 dark:border-lime-800 shadow-sm">{s}</span>
              ))}
              {profileData.interests.map(i => (
                <span key={i} className="px-3 py-1 bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-300 rounded-full text-xs font-bold border border-pink-200 dark:border-pink-800 shadow-sm">{i}</span>
              ))}
            </div>
          </div>

          {/* ===== ДОВЕРЕННЫЕ КОНТАКТЫ ===== */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-red-100 dark:bg-red-900/40 rounded-xl flex items-center justify-center">
                <Shield size={16} className="text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Доверенные контакты</h3>
            </div>
            <p className="text-xs text-slate-800 dark:text-slate-200 mb-4 font-medium">
              При нажатии SOS им автоматически улетит SMS с твоей геопозицией.
            </p>

            {/* Список контактов */}
            <div className="space-y-2 mb-4">
              <AnimatePresence>
                {contactsLoading ? (
                  <div className="flex justify-center py-6">
                    <div className="w-6 h-6 rounded-full border-2 border-pink-300 border-t-pink-500 animate-spin" />
                  </div>
                ) : trustedContacts.length === 0 ? (
                  <div className="p-4 text-center bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 text-sm">
                    Нет контактов — добавь первый 👇
                  </div>
                ) : (
                  trustedContacts.map(contact => (
                    <motion.div
                      key={contact.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-800/70 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 to-lime-400 flex items-center justify-center text-white font-black text-sm">
                          {contact.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-white">{contact.name}</p>
                          <p className="text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1">
                            <Phone size={11} /> {contact.phone}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeContact(contact.id)}
                        className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors active:scale-90"
                      >
                        <X size={14} />
                      </button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Форма добавления */}
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-slate-100 dark:border-slate-700 p-4 space-y-3">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">Добавить контакт</p>
              <input
                type="text"
                placeholder="Имя (напр. Мама)"
                value={newContactName}
                onChange={e => setNewContactName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl outline-none text-sm font-medium text-slate-800 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-800 transition-all border border-transparent focus:border-pink-200 dark:focus:border-pink-800"
              />
              <div className="flex gap-2">
                <input
                  type="tel"
                  placeholder="+7 (700) 000-00-00"
                  value={newContactPhone}
                  onChange={e => setNewContactPhone(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addContact()}
                  className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl outline-none text-sm font-medium text-slate-800 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-800 transition-all border border-transparent focus:border-pink-200 dark:focus:border-pink-800"
                />
                <button
                  onClick={addContact}
                  disabled={!newContactPhone.trim()}
                  className={`px-4 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95 flex items-center gap-2 ${
                    contactSaved
                      ? 'bg-green-500 text-white'
                      : 'bg-gradient-to-r from-pink-500 to-lime-500 text-white disabled:opacity-40'
                  }`}
                >
                  {contactSaved ? <Check size={18} /> : <UserPlus size={18} />}
                </button>
              </div>
            </div>
          </motion.div>

          {/* ===== МОИ НАБЛЮДЕНИЯ ===== */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3">{t('profile.myObservations')}</h3>
            {observations.length === 0 ? (
              <div className="p-5 text-center bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm font-medium">
                {t('profile.noObservations')}
              </div>
            ) : (
              <div className="space-y-3">
                {[...observations].reverse().map(obs => (
                  <div key={obs.id} className="p-4 bg-white dark:bg-slate-800/70 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500 mt-1 flex-shrink-0">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-white mb-1">{obs.desc}</p>
                      <p className="text-[10px] text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wide">
                        {new Date(obs.time).toLocaleDateString()} {new Date(obs.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <motion.button
            onClick={handleLogout}
            className="w-full py-4 bg-white dark:bg-slate-800 text-red-500 dark:text-red-400 rounded-2xl font-bold shadow-sm border border-white dark:border-slate-700 flex items-center justify-center gap-2 transition-colors duration-500 active:scale-95"
          >
            <LogOut className="w-5 h-5" /> {t('common.logout')}
          </motion.button>
        </div>
      )}

      {/* TAB CONTENT: SAVED */}
      {activeTab === 'saved' && (
        <SavedSection user={user} />
      )}

      {/* EDIT MODAL */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profileData={profileData}
        setProfileData={setProfileData}
        allSkills={allSkills}
        allInterests={allInterests}
        toggleSkill={toggleSkill}
        toggleInterest={toggleInterest}
        handleAvatarUpload={handleAvatarUpload}
      />
    </div>
  );
}