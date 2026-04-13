import { ArrowLeft, Heart, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function PostDetail() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('posts')
      .select('*, profiles(first_name, last_name, avatar)')
      .eq('id', id)
      .single();
    setPost(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10 text-pink-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mr-3"></div>
        {t('feed.loadingPost')}
      </div>
    );
  }

  if (!post) {
    return (
      <div className="p-10 text-center text-slate-500">
        <p className="text-lg font-semibold">{t('feed.postNotFound')}</p>
        <button onClick={() => navigate(-1)} className="text-pink-500 mt-2 hover:underline">
          {t('feed.goBack')}
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* Кнопка Назад */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-slate-500 hover:text-pink-600 transition-colors mb-6 font-medium"
      >
        <ArrowLeft size={20} />
        {t('feed.backToFeed')}
      </button>

      {/* Карточка поста */}
      <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-5">
            {post.profiles?.avatar ? (
              <img src={post.profiles.avatar} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold text-xl">
                {post.profiles?.first_name?.charAt(0) || 'A'}
              </div>
            )}
          <div>
            <h3 className="font-bold text-lg text-slate-800 leading-tight">
              {post.profiles?.first_name} {post.profiles?.last_name || ''}
            </h3>
            <p className="text-sm text-slate-400">
              {new Date(post.created_at).toLocaleString(i18n.language === 'ru' ? 'ru-RU' : i18n.language === 'ky' ? 'ky-KG' : 'en-US', { 
                day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' 
              })}
            </p>
          </div>
        </div>

        <p className="text-base text-slate-700 leading-relaxed mb-6 whitespace-pre-wrap">
          {post.content}
        </p>

        <div className="flex items-center gap-6 pt-4 border-t border-gray-50">
          <button className="flex items-center gap-2 text-slate-400 hover:text-pink-500 transition-colors">
            <Heart size={22} /> 
            <span className="font-semibold">{post.likes_count || 0}</span>
          </button>
          <button className="flex items-center gap-2 text-slate-400 hover:text-lime-500 transition-colors">
            <MessageCircle size={22} /> 
            <span className="font-semibold">{post.comments_count || 0}</span>
          </button>
        </div>
      </div>
    </div>
  );
}