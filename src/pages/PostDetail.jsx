import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

export default function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPost()
  }, [id])

  const fetchPost = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('posts')
      .select('*, profiles(full_name)')
      .eq('id', id)
      .single()
    setPost(data)
    setLoading(false)
  }

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div className="loading-spinner"></div>
        <span style={{ marginLeft: '10px' }}>Загрузка поста...</span>
      </div>
    )
  }

  if (!post) {
    return <div style={{ padding: '20px' }}>Пост не найден.</div>
  }

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#F080A0', marginBottom: '20px' }}>
        ← Назад в ленту
      </button>
      <div className="post-card">
        <div className="post-header">
          <div className="post-avatar">{post.profiles?.full_name?.[0] || '👤'}</div>
          <strong>{post.profiles?.full_name || 'Аноним'}</strong>
        </div>
        <p className="post-content" style={{fontSize: '18px'}}>{post.content}</p>
        <div className="post-time">{new Date(post.created_at).toLocaleString()}</div>
      </div>
      {/* Здесь можно добавить секцию комментариев в будущем */}
    </div>
  )
}