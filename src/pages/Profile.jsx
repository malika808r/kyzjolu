import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/store';
import { Edit2, Mail, Phone, MapPin, Save, X } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function Profile() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: user?.bio || '',
    skills: user?.skills?.join(', ') || '',
    location: user?.location || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateProfile({
      bio: formData.bio,
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      location: formData.location,
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-primary/20 to-purple-600/20 h-32 dark:from-primary/10 dark:to-purple-600/10"></div>

      <div className="max-w-2xl mx-auto px-4 -mt-16 relative z-10">
        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="text-6xl">{user?.avatar || '👤'}</div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {user?.firstName} {user?.lastName}
                </h1>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Edit2 size={24} className="text-primary" />
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('profile.bio')}
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('profile.skills')}
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="Web Development, Design, Marketing (comma separated)"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('profile.location')}
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, Country"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} className="flex-1">
                  <Save size={20} className="mr-2" />
                  {t('common.save')}
                </Button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-foreground hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                >
                  <X size={20} />
                  {t('common.cancel')}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {user?.bio && (
                <p className="text-foreground leading-relaxed">{user.bio}</p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                {user?.location && (
                  <div className="flex items-center gap-3">
                    <MapPin size={20} className="text-primary" />
                    <span className="text-foreground">{user.location}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Skills Section */}
        {user?.skills && user.skills.length > 0 && !isEditing && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-foreground mb-4">{t('profile.skills')}</h2>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-primary/10 dark:bg-primary/20 text-primary rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Activity Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-primary">0</div>
            <p className="text-sm text-muted-foreground">{t('profile.posts')}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-primary">0</div>
            <p className="text-sm text-muted-foreground">{t('profile.followers')}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-primary">0</div>
            <p className="text-sm text-muted-foreground">{t('profile.following')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}