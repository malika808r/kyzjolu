import { AlertCircle, Users, MessageSquare, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function AdminPanel() {
  const { t, i18n } = useTranslation();
  const [stats, setStats] = useState({ users: 0, posts: 0, sos: 0, comments: 0 });
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Получаем статистику
      const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { count: postCount } = await supabase.from('posts').select('*', { count: 'exact', head: true });
      
      setStats({ 
        users: userCount || 0, 
        posts: postCount || 0, 
        sos: 0, 
        comments: 0 
      });

      // Получаем недавние посты для модерации
      const { data: recentPosts } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
        
      setAlerts(recentPosts || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center text-slate-800 font-black py-20">
        {t('admin.loading')}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-1">{t('admin.dashboard')}</h1>
        <p className="text-slate-800 font-bold uppercase tracking-widest">{t('admin.subtitle')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <Users size={18} className="text-lime-500" />
            <span className="text-[10px] text-slate-800 font-black uppercase tracking-wider mb-2">{t('admin.users')}</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">{stats.users}</div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare size={18} className="text-lime-500" />
            <span className="text-[10px] text-slate-800 font-black uppercase tracking-wider mb-2">{t('admin.posts')}</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">{stats.posts}</div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={18} className="text-red-500" />
            <span className="text-[10px] text-slate-800 font-black uppercase tracking-wider mb-2">{t('admin.sos')}</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">{stats.sos}</div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={18} className="text-yellow-500" />
            <span className="text-[10px] text-slate-800 font-black uppercase tracking-wider mb-2">{t('admin.moderation')}</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">{alerts.length}</div>
        </div>
      </div>

      {/* Recent Posts for Moderation */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-4">{t('admin.recentPosts')}</h2>
        
        {alerts.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center text-slate-800 font-black uppercase tracking-widest bg-slate-50 border border-slate-100 py-16">
            {t('admin.noPosts')}
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map(post => (
              <div 
                key={post.id} 
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900 font-bold truncate">{post.content}</p>
                    <div className="flex gap-2 mt-2 text-[10px] text-slate-700 dark:text-slate-300 font-black uppercase tracking-widest mt-2">
                      <span>📅 {new Date(post.created_at).toLocaleDateString(i18n.language === 'ru' ? 'ru-RU' : 'en-US')}</span>
                      <span>👤 ID: {post.user_id.substring(0, 8)}</span>
                    </div>
                  </div>
                  <button className="px-3 py-1 text-xs bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors whitespace-nowrap">
                    {t('admin.hide')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
        <h3 className="text-lg font-bold text-red-700 mb-3 flex items-center gap-2">
          <AlertTriangle size={18} /> {t('admin.emergency')}
        </h3>
        <div className="space-y-2 text-sm text-red-700">
          <p className="font-semibold">{t('admin.sosInfo')}</p>
          <p>📍 {t('admin.coordsSent')}</p>
          <p>📞 {t('admin.callTrusted')}</p>
          <p>{t('admin.adminNotify')}</p>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-[10px] text-slate-800 dark:text-slate-200 text-center p-4 font-black uppercase tracking-widest">
        {t('admin.autoUpdate')} {new Date().toLocaleTimeString(i18n.language === 'ru' ? 'ru-RU' : 'en-US')}
      </div>
    </div>
  );
}
                