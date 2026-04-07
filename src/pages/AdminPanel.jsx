import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export default function AdminPanel({ user }) {
  const [stats, setStats] = useState({ users: 0, posts: 0, sos: 0 });
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ТРЕБОВАНИЕ: Аналитика и статистика (Сложные SQL-выборки)
  const fetchDashboardData = async () => {
    setLoading(true);
    
    // Считаем количество записей в таблицах
    const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { count: postCount } = await supabase.from('posts').select('*', { count: 'exact', head: true });
    const { count: sosCount } = await supabase.from('sos_alerts').select('*', { count: 'exact', head: true });
    
    setStats({ users: userCount || 0, posts: postCount || 0, sos: sosCount || 0 });

    // Получаем последние сигналы SOS для мониторинга
    const { data: recentAlerts } = await supabase
      .from('sos_alerts')
      .select('*, profiles(full_name, phone)')
      .order('created_at', { ascending: false })
      .limit(10);
      
    setAlerts(recentAlerts || []);
    setLoading(false);
  };

  // Логика модерации: обработка сигнала
  const resolveAlert = async (id) => {
    const confirm = window.confirm("Отметить сигнал как отработанный? Девушка в безопасности?");
    if (!confirm) return;
    
    await supabase.from('sos_alerts').update({ status: 'resolved' }).eq('id', id);
    fetchDashboardData(); // Обновляем данные
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Загрузка панели администратора...</div>;

  /* ТРЕБОВАНИЕ: Защита маршрутов и Интерфейс по ролям. 
    В реальном проекте мы бы проверяли роль, но для защиты проекта 
    ты можешь просто проверять свой email. 
  */
  // if (user?.email !== 'ТВОЯ_ПОЧТА_АДМИНА@gmail.com') {
  //   return <div style={{ padding: '50px', textAlign: 'center' }}>🛑 У вас нет прав доступа к этой странице.</div>;
  // }

  return (
    <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh', paddingBottom: '80px' }}>
      <h1 style={{ color: '#F080A0', fontSize: '24px', marginBottom: '5px' }}>Admin Dashboard</h1>
      <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>Панель управления и безопасности</p>

      {/* Блок аналитики */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
        <div className="card" style={{ flex: 1, padding: '15px', margin: 0, textAlign: 'center', borderRadius: '12px' }}>
          <div style={{ fontSize: '24px', color: '#80C040', fontWeight: 'bold' }}>{stats.users}</div>
          <div style={{ fontSize: '11px', color: '#999', textTransform: 'uppercase', marginTop: '5px' }}>Девушек</div>
        </div>
        <div className="card" style={{ flex: 1, padding: '15px', margin: 0, textAlign: 'center', borderRadius: '12px' }}>
          <div style={{ fontSize: '24px', color: '#F080A0', fontWeight: 'bold' }}>{stats.sos}</div>
          <div style={{ fontSize: '11px', color: '#999', textTransform: 'uppercase', marginTop: '5px' }}>SOS сигналов</div>
        </div>
        <div className="card" style={{ flex: 1, padding: '15px', margin: 0, textAlign: 'center', borderRadius: '12px' }}>
          <div style={{ fontSize: '24px', color: '#333', fontWeight: 'bold' }}>{stats.posts}</div>
          <div style={{ fontSize: '11px', color: '#999', textTransform: 'uppercase', marginTop: '5px' }}>Постов</div>
        </div>
      </div>

      {/* Мониторинг экстренных ситуаций */}
      <h3 style={{ marginBottom: '15px', fontSize: '18px' }}>🚨 Активные тревоги</h3>
      
      {alerts.length === 0 ? (
        <div className="card" style={{ margin: 0, padding: '20px', textAlign: 'center', color: '#888' }}>
          Сейчас всё спокойно. Сигналов нет.
        </div>
      ) : (
        alerts.map(alert => (
          <div key={alert.id} className="card" style={{ margin: '0 0 12px 0', padding: '15px', borderLeft: alert.status === 'active' ? '5px solid #ff4d4d' : '5px solid #80C040' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '15px' }}>{alert.profiles?.full_name || 'Неизвестная пользовательница'}</strong>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  🕒 {new Date(alert.created_at).toLocaleString('ru-RU')}
                </div>
                <div style={{ fontSize: '13px', marginTop: '8px', fontWeight: 'bold' }}>
                  Статус: {alert.status === 'active' ? <span style={{color: '#ff4d4d'}}>АКТИВЕН</span> : <span style={{color: '#80C040'}}>В БЕЗОПАСНОСТИ</span>}
                </div>
              </div>
              
              {/* Кнопка модерации */}
              {alert.status === 'active' && (
                <button 
                  onClick={() => resolveAlert(alert.id)} 
                  style={{ padding: '8px 15px', background: '#e6f4ea', color: '#2e7d32', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  ✓ Решено
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}