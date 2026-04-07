import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePostStore } from '../store/store';
import { useAppStore } from '../store/store';
import { Heart, MessageCircle, Share, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';

export default function Feed({ type = 'all' }) {
  const { t } = useTranslation();
  const posts = usePostStore((state) => state.posts);
  const loading = usePostStore((state) => state.loading);
  const fetchPosts = usePostStore((state) => state.fetchPosts);
  const createPost = usePostStore((state) => state.createPost);
  const deletePost = usePostStore((state) => state.deletePost);
  const likePost = usePostStore((state) => state.likePost);
  const user = useAppStore((state) => state.user);
  const [newPost, setNewPost] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPosts(type);
  }, [type, fetchPosts]);

  const handleCreatePost = async () => {
    if (newPost.trim() && user) {
      const result = await createPost({
        content: newPost,
      });
      if (result.success) {
        setNewPost('');
      }
    }
  };

  const filteredPosts = posts.filter(post => {
    const authorName = post.profiles
      ? `${post.profiles.first_name} ${post.profiles.last_name}`
      : 'Unknown';

    return (
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      authorName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto py-6 px-4 space-y-6">
        {/* Search Bar */}
        <div>
          <input
            type="text"
            placeholder={t('common.search') || 'Search...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Create Post Card */}
        {user && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex gap-4">
              <div className="text-3xl">{user.avatar || '👤'}</div>
              <div className="flex-1">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder={t('feed.writePost') || "What's on your mind?"}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  rows="3"
                />
                <div className="mt-3 flex justify-end gap-2">
                  <button
                    onClick={() => setNewPost('')}
                    className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {t('common.cancel')}
                  </button>
                  <Button onClick={handleCreatePost} disabled={!newPost.trim()}>
                    {t('feed.post') || 'Post'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Posts Feed */}
        <div className="space-y-4">
          {loading && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
              <p className="text-muted-foreground text-lg">{t('common.loading') || 'Loading...'}</p>
            </div>
          )}
          {!loading && filteredPosts.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
              <p className="text-muted-foreground text-lg">
                {searchTerm
                  ? t('common.noResults')
                  : t('feed.noPosts') || 'No posts yet. Be the first to share!'}
              </p>
            </div>
          ) : (
            filteredPosts.map((post) => {
              const authorName = post.profiles
                ? `${post.profiles.first_name} ${post.profiles.last_name}`
                : 'Unknown';
              const authorAvatar = post.profiles?.avatar || '👤';
              const authorId = post.user_id;
              const createdAt = post.created_at;

              return (
                <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{authorAvatar}</div>
                      <div>
                        <h3 className="font-bold text-foreground">
                          {authorName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                  {user?.id === authorId && (
                    <button
                      onClick={() => deletePost(post.id)}
                      className="p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      title="Delete post"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>

                <p className="text-foreground mb-4 whitespace-pre-wrap">{post.content}</p>

                {post.image && (
                  <img
                    src={post.image}
                    alt="Post"
                    className="w-full rounded-lg mb-4 max-h-96 object-cover"
                  />
                )}

                <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => likePost(post.id)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors flex-1 justify-center',
                      'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    )}
                  >
                    <Heart
                      size={20}
                    />
                    <span className="text-sm">{post.likes_count || 0}</span>
                  </button>

                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-1 justify-center">
                    <MessageCircle size={20} />
                    <span className="text-sm">{post.comments_count || 0}</span>
                  </button>

                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-1 justify-center">
                    <Share size={20} />
                  </button>
                </div>
              </div>
            )})
          )}
        </div>
      </div>
    </div>
  );
}