import { Link } from 'react-router'

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '100px 20px' }}>
      <h1 style={{ fontSize: '80px', color: '#F080A0', marginBottom: '0' }}>404</h1>
      <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>Упс! Кажется, эта дорога завела не туда.</p>
      <Link to="/" className="btn-green" style={{ textDecoration: 'none', display: 'inline-block', width: 'auto', padding: '12px 30px' }}>
        Вернуться на главную
      </Link>
    </div>
  )
}