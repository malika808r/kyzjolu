import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { supabase } from '../supabase';

// Компонент для автоматического центрирования карты на пользователе
function RecenterMap({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.setView(coords, 15);
  }, [coords, map]);
  return null;
}

export default function MapView({ user }) {
  const [position, setPosition] = useState([42.8746, 74.5698]); // По умолчанию центр Бишкека
  const [isLocating, setIsLocating] = useState(false);

  // Функция определения местоположения (Geolocation API)
  const findMe = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
        setIsLocating(false);
      },
      (err) => {
        alert("Не удалось получить доступ к GPS");
        setIsLocating(false);
      }
    );
  };

  // Функция SOS (Отправка данных в Supabase)
  const handleSOS = async () => {
    const confirmSOS = window.confirm("ВНИМАНИЕ! Отправить сигнал SOS? Это уведомит ближайших пользователей.");
    
    if (confirmSOS) {
      const { error } = await supabase.from('sos_alerts').insert([
        { 
          user_id: user.id, 
          latitude: position[0], 
          longitude: position[1],
          status: 'active'
        }
      ]);

      if (error) {
        alert("Ошибка при отправке сигнала: " + error.message);
      } else {
        alert("🔴 СИГНАЛ ОТПРАВЛЕН! Помощь в пути.");
      }
    }
  };

  return (
    <div style={{ height: '100%', position: 'relative' }}>
      
      {/* Поле поиска поверх карты (по Figma) */}
      <div style={{ position: 'absolute', top: '15px', left: '15px', right: '15px', zIndex: 1000 }}>
        <input 
          type="text" 
          className="search-input" 
          placeholder="🔍 Куда вы направляетесь?" 
          style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)', border: 'none' }}
        />
      </div>

      {/* Сама карта */}
      <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={position}>
          <Popup>Вы здесь</Popup>
        </Marker>
        <RecenterMap coords={position} />
      </MapContainer>

      {/* Кнопка Моя локация */}
      <button 
        onClick={findMe}
        style={{ position: 'absolute', bottom: '110px', right: '20px', zIndex: 1000, width: '50px', height: '50px', borderRadius: '50%', border: 'none', background: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.2)', cursor: 'pointer', fontSize: '20px' }}
      >
        🎯
      </button>

      {/* ГЛАВНАЯ КНОПКА SOS */}
      <button 
        className="sos-btn" 
        onClick={handleSOS}
        style={{ zIndex: 1000 }}
      >
        SOS
      </button>

    </div>
  );
}