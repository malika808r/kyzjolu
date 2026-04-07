import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuthStore } from '../store/store'

export default function Auth() {
  const navigate = useNavigate()
  const { loading, register, login } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    const result = await login(email, password)
    if (result.success) {
      navigate('/app/feed')
    } else {
      setError(result.error || 'Вход не удался')
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setError('')
    const [firstName, lastName] = email.split('@')[0].split('.')
    const result = await register(email, password, firstName || 'User', lastName || '')
    if (result.success) {
      navigate('/app/feed')
    } else {
      setError(result.error || 'Регистрация не удалась')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center', backgroundColor: '#f8f9fa' }}>
      <div className="card" style={{ margin: '0 20px', textAlign: 'center', padding: '40px 20px' }}>
        <h2 style={{color: '#F080A0', fontSize: '28px', marginBottom: '10px'}}>KyzJolu</h2>
        <p style={{ color: '#666', marginBottom: '30px' }}>Твой путь к безопасности и поддержке</p>
        
        {error && (
          <div style={{ color: '#d32f2f', padding: '10px', marginBottom: '15px', borderRadius: '4px', backgroundColor: '#ffebee' }}>
            {error}
          </div>
        )}
        
        <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ padding: '12px 15px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px' }}
          />
          <input 
            type="password" 
            placeholder="Пароль" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ padding: '12px 15px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px' }}
          />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
            <button 
              className="btn-green" 
              onClick={isLogin ? handleLogin : handleSignUp} 
              disabled={loading}
              style={{ cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
            >
              {loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Создать аккаунт')}
            </button>
            <button 
              type="button"
              style={{ background: 'none', border: '1px solid #F080A0', color: '#F080A0', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
              }}
            >
              {isLogin ? 'Создать аккаунт' : 'Уже есть аккаунт? Войти'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}