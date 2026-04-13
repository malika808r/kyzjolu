import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-pink-50 to-lime-50">
      <div className="text-center">
        <h1 className="text-6xl md:text-7xl font-bold text-pink-500 mb-4">404</h1>
        <p className="text-lg md:text-xl text-slate-600 mb-8">Упс! Кажется, эта дорога завела не туда.</p>
        <Link to="/" className="inline-block px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-semibold transition-colors">
          Вернуться на главную
        </Link>
      </div>
    </div>
  )
}