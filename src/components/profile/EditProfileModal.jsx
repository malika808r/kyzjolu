import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/store';

export default function EditProfileModal({ 
  isOpen, 
  onClose, 
  profileData, 
  setProfileData,
  allSkills,
  allInterests,
  toggleSkill,
  toggleInterest,
  handleAvatarUpload
}) {
  const { t } = useTranslation();

  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');

  const addSkill = () => {
    if (skillInput.trim() && !profileData.skills.includes(skillInput.trim())) {
      setProfileData({ ...profileData, skills: [...profileData.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setProfileData({ ...profileData, skills: profileData.skills.filter(s => s !== skill) });
  };

  const addInterest = () => {
    if (interestInput.trim() && !profileData.interests.includes(interestInput.trim())) {
      setProfileData({ ...profileData, interests: [...profileData.interests, interestInput.trim()] });
      setInterestInput('');
    }
  };

  const removeInterest = (interest) => {
    setProfileData({ ...profileData, interests: profileData.interests.filter(i => i !== interest) });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: '100%' }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: '100%' }} 
          className="fixed inset-0 z-[4000] bg-white dark:bg-slate-900 flex flex-col transition-colors duration-300"
        >
          <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">{t('profile.editProfile')}</h2>
            <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-800 dark:text-slate-200 font-black">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex flex-col items-center gap-3">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-pink-100 dark:border-pink-900/50 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                 {profileData.avatarUrl ? (
                   <img src={profileData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                 ) : (
                   <div className="text-3xl font-black text-pink-500">{profileData.firstName.charAt(0)}</div>
                 )}
              </div>
              <label className="px-4 py-2 bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 text-sm font-bold rounded-xl cursor-pointer hover:bg-pink-100 dark:hover:bg-pink-900/50 transition-colors">
                {t('profile.uploadAvatar')}
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-black text-slate-800 dark:text-slate-200 mb-1 block uppercase tracking-wide">{t('profile.firstName')}</label>
                <input 
                  type="text" 
                  value={profileData.firstName} 
                  onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm font-bold text-slate-900 dark:text-white focus:border-pink-500 transition-all placeholder:text-slate-400" 
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-800 dark:text-slate-200 mb-1 block uppercase tracking-wide">{t('profile.lastName')}</label>
                <input 
                  type="text" 
                  value={profileData.lastName} 
                  onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm font-bold text-slate-900 dark:text-white focus:border-pink-500 transition-all placeholder:text-slate-400" 
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-black text-slate-800 dark:text-slate-200 mb-1 block uppercase tracking-wide">{t('profile.bio')}</label>
              <textarea 
                value={profileData.bio || ''} 
                onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                placeholder={t('profile.bioPlaceholder')}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm font-bold text-slate-900 dark:text-white focus:border-pink-500 min-h-[80px] resize-none transition-all placeholder:text-slate-400" 
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-800 dark:text-slate-200 mb-2 block uppercase tracking-wide">{t('profile.skills')}</label>
              <div className="flex gap-2 mb-2">
                <input 
                  type="text" 
                  value={skillInput} 
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                  placeholder={t('profile.addSkillPlaceholder')}
                  className="flex-1 p-2.5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm font-bold text-slate-900 dark:text-white focus:border-pink-500 transition-all placeholder:text-slate-400"
                />
                <button type="button" onClick={addSkill} className="p-2.5 bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-400 rounded-xl hover:bg-pink-200 dark:hover:bg-pink-900/70 transition-colors">
                  <Plus size={20} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map(skill => (
                  <div key={skill} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-bold bg-lime-100 dark:bg-lime-900/50 text-lime-600 dark:text-lime-300">
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)} className="hover:text-lime-800 dark:hover:text-lime-100 outline-none"><XCircle size={14} /></button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-black text-slate-800 dark:text-slate-200 mb-2 block uppercase tracking-wide">{t('profile.interests')}</label>
              <div className="flex gap-2 mb-2">
                <input 
                  type="text" 
                  value={interestInput} 
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addInterest(); } }}
                  placeholder={t('profile.interestsPlaceholder')}
                  className="flex-1 p-2.5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm font-bold text-slate-900 dark:text-white focus:border-pink-500 transition-all placeholder:text-slate-400"
                />
                <button type="button" onClick={addInterest} className="p-2.5 bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-400 rounded-xl hover:bg-pink-200 dark:hover:bg-pink-900/70 transition-colors">
                  <Plus size={20} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profileData.interests.map(interest => (
                  <div key={interest} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-bold bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-300">
                    {interest}
                    <button type="button" onClick={() => removeInterest(interest)} className="hover:text-pink-800 dark:hover:text-pink-100 outline-none"><XCircle size={14} /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <button 
              onClick={async () => {
                 const { updateProfile } = useAppStore.getState();
                 await updateProfile({
                   firstName: profileData.firstName,
                   lastName: profileData.lastName,
                   bio: profileData.bio,
                   skills: profileData.skills,
                   interests: profileData.interests,
                   avatarUrl: profileData.avatarUrl
                 });
                 onClose();
              }}
              className="w-full py-4 bg-gradient-to-r from-pink-500 to-lime-500 rounded-2xl text-white font-bold shadow-lg active:scale-95 transition-all text-center"
            >
              {t('profile.save')}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
