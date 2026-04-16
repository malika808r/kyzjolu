import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Locate, MapPin, Users, ShieldAlert,
  BarChart2, PhoneCall, Timer, Home, WifiOff, X,
  Lightbulb, Eye, AlertTriangle, Heart, ShieldCheck
} from 'lucide-react';
import { useAppStore } from '../store/store';
import { supabase } from '../supabase';

// ────────────────────────────────────────────────
// ИКОНКИ LEAFLET
// ────────────────────────────────────────────────
const createFriendIcon = (imageUrl) => L.divIcon({
  className: 'bg-transparent border-0',
  html: `<div class="relative w-12 h-12"><div class="absolute inset-0 rounded-full bg-pink-400 animate-ping opacity-40"></div><img src="${imageUrl}" class="relative w-12 h-12 rounded-full border-2 border-pink-400 object-cover shadow-lg" /></div>`,
  iconSize: [48, 48], iconAnchor: [24, 24]
});

const createSafeHavenIcon = () => L.divIcon({
  className: 'bg-transparent border-0',
  html: `<div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg></div>`,
  iconSize: [40, 40], iconAnchor: [20, 20]
});

// CATEGORY_ICONS moved inside component to use t()

const createReportIcon = (category, icons) => {
  const cfg = icons[category] || icons.no_lighting;
  return L.divIcon({
    className: 'bg-transparent border-0',
    html: `<div style="background:${cfg.color}" class="w-9 h-9 rounded-full flex items-center justify-center shadow-lg border-2 border-white text-base">${cfg.emoji}</div>`,
    iconSize: [36, 36], iconAnchor: [18, 18]
  });
};

const createSosIcon = () => L.divIcon({
  className: 'bg-transparent border-0',
  html: `<div class="relative w-12 h-12 flex items-center justify-center">
    <div class="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-60"></div>
    <div class="relative w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-xl border-4 border-white animate-pulse">
      <span class="text-[10px] font-black text-white">SOS</span>
    </div>
  </div>`,
  iconSize: [48, 48], iconAnchor: [24, 24]
});

// ────────────────────────────────────────────────
// КОМПОНЕНТ ДЛЯ КЛИКА ПО КАРТЕ
// ────────────────────────────────────────────────
function MapClickHandler({ onMapClick }) {
  useMapEvents({ click: (e) => onMapClick(e.latlng) });
  return null;
}

// ────────────────────────────────────────────────
// УТИЛИТА: РАССТОЯНИЕ (м) МЕЖДУ ДВУМЯ ТОЧКАМИ
// ────────────────────────────────────────────────
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ────────────────────────────────────────────────
// SAFETY SCORE: считаем кол-во угроз рядом с маршрутом
// ────────────────────────────────────────────────
function calcSafetyScore(routePath, reports) {
  if (!routePath || routePath.length === 0 || reports.length === 0) return 100;
  const RADIUS = 150; // метров от маршрута
  let threats = 0;
  for (const report of reports) {
    if (report.category === 'safe_spot') continue;
    for (const [rlat, rlng] of routePath) {
      if (haversine(rlat, rlng, report.lat, report.lng) < RADIUS) {
        threats++;
        break; // считаем 1 раз на отчёт
      }
    }
  }
  // 0 угроз = 100%, каждая -8, мин 0
  return Math.max(0, 100 - threats * 8);
}

// ────────────────────────────────────────────────
const bishkekCenter = [42.8746, 74.5698];
// safeHavens moved inside component to use t()
const friends = [{ id: 1, name: 'Айдана', coords: [42.8780, 74.5800], image: 'https://images.unsplash.com/photo-1608229321710-1caa06bc5269?w=100&q=80' }];

// ────────────────────────────────────────────────
export default function MapView() {
  const { t, i18n } = useTranslation();
  const { triggerSOSBackend, user, addObservation, sosAlerts, addSosAlert, setSosAlerts } = useAppStore();

  const CATEGORY_ICONS = {
    no_lighting:   { color: '#f59e0b', emoji: '💡', label: t('map.categories.no_lighting'),     bg: '#fef3c7' },
    suspicious:    { color: '#ef4444', emoji: '👥', label: t('map.categories.suspicious'),    bg: '#fee2e2' },
    dark_zone:     { color: '#7c3aed', emoji: '🌑', label: t('map.categories.dark_zone'),     bg: '#ede9fe' },
    unsafe_infra:  { color: '#f97316', emoji: '⚠️', label: t('map.categories.unsafe_infra'),  bg: '#ffedd5' },
    safe_spot:     { color: '#22c55e', emoji: '✅', label: t('map.categories.safe_spot'),     bg: '#dcfce7' },
  };

  const safeHavens = [
    { id: 1, coords: [42.8760, 74.5750], name: 'Sierra', type: t('map.safeHavens.partner'), code: t('map.safeHavens.code') },
    { id: 2, coords: [42.8680, 74.5820], name: 'Нэман (24/7)', type: t('map.safeHavens.urgent'), code: t('map.safeHavens.cashier') },
  ];

  const [sosActive, setSosActive] = useState(false);
  const [sosStatus, setSosStatus] = useState('idle');
  const [sheetOpen, setSheetOpen] = useState(true);
  const [companionActive, setCompanionActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);
  const [routeActive, setRouteActive] = useState(false);
  const [routePath, setRoutePath] = useState(null);
  const [safetyScore, setSafetyScore] = useState(null);
  const [activeNotification, setActiveNotification] = useState(null); // { id, type: 'sos', message }

  const sosTimerRef = useRef(null);

  // ── Отчёты с базы ──
  const [reports, setReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(true);

  // ── Форма добавления ──
  const [isAddingReport, setIsAddingReport] = useState(false);
  const [pendingLatLng, setPendingLatLng] = useState(null); // координаты клика по карте
  const [reportCategory, setReportCategory] = useState('no_lighting');
  const [reportText, setReportText] = useState('');
  const [reportIsAnon, setReportIsAnon] = useState(true);
  const [reportSaving, setReportSaving] = useState(false);

  // ── Загрузка отчётов ──
  const fetchReports = useCallback(async () => {
    setReportsLoading(true);
    const { data, error } = await supabase
      .from('safety_reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);
    if (!error && data) setReports(data);
    setReportsLoading(false);
  }, []);

  const fetchActiveSOS = useCallback(async () => {
    // Получаем последние активные SOS за 24 часа
    const { data, error } = await supabase
      .from('sos_alerts')
      .select('*')
      .eq('status', 'active')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
    if (!error && data) setSosAlerts(data);
  }, [setSosAlerts]);

  useEffect(() => {
    fetchReports();
    fetchActiveSOS();

    // Realtime: новые отчёты появляются без перезагрузки
    const channel = supabase.channel('safety_reports_realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'safety_reports' }, payload => {
        setReports(prev => [payload.new, ...prev]);
      })
      .subscribe();

    // SOS channel
    const sosChannel = supabase.channel('sos_alerts_channel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sos_alerts' }, payload => {
        addSosAlert(payload.new);
        
        if (payload.new.user_id !== user?.id) {
          if (navigator.vibrate) navigator.vibrate([500, 200, 500]);
          setActiveNotification({
            id: payload.new.id,
            type: 'sos',
            message: t('map.sosAlert')
          });
          // Авто-скрытие уведомления через 8 сек
          setTimeout(() => setActiveNotification(null), 8000);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(sosChannel);
    };
  }, [fetchReports, fetchActiveSOS, addSosAlert, user, t]);

  // ── Виртуальная попутчица ──
  useEffect(() => {
    let timer;
    if (companionActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(p => p - 1), 1000);
    } else if (companionActive && timeLeft === 0) {
      triggerSOS();
    }
    return () => clearInterval(timer);
  }, [companionActive, timeLeft]);

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  // ── OSRM маршрут ──
  const fetchOSRMRoute = async (start, end) => {
    try {
      const url = `https://router.project-osrm.org/route/v1/walking/${start[1]},${start[0]};${end[1]},${end[0]}?geometries=geojson`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.routes?.length > 0) {
        const path = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
        setRoutePath(path);
        const score = calcSafetyScore(path, reports);
        setSafetyScore(score);
        return path;
      }
    } catch {
      const path = [start, end];
      setRoutePath(path);
      setSafetyScore(calcSafetyScore(path, reports));
    }
  };

  // ── SOS ──
  const triggerSOS = () => {
    setSosStatus('locating');

    const sendWithCoords = async (lat, lng) => {
      let contacts = [];
      if (user) {
        const { data } = await supabase.from('trusted_contacts').select('phone').eq('user_id', user.id);
        if (data) contacts = data;
      }
      const mapsLink = `http://maps.google.com/maps?q=${lat},${lng}`;
      const smsBody = encodeURIComponent(`SOS! Мне нужна помощь! Геопозиция: ${mapsLink}`);
      
      if (contacts.length > 0) {
        window.location.href = `sms:${contacts.map(c => c.phone).join(',')}?body=${smsBody}`;
      } else {
        // Если контакты не заданы, все равно открываем SMS приложение, чтобы пользователь мог ввести номер вручную
        window.location.href = `sms:?body=${smsBody}`;
      }

      if (navigator.onLine) triggerSOSBackend(lat, lng);
      setSosStatus('sent');
      setTimeout(() => { setSosStatus('idle'); }, 5000);
    };

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => sendWithCoords(pos.coords.latitude, pos.coords.longitude),
        () => sendWithCoords(bishkekCenter[0], bishkekCenter[1]),
        { timeout: 5000, enableHighAccuracy: true }
      );
    } else {
      sendWithCoords(bishkekCenter[0], bishkekCenter[1]);
    }
  };

  // ── Клик по карте → форма добавления ──
  const handleMapClick = (latlng) => {
    if (!user) return;
    setPendingLatLng(latlng);
    setIsAddingReport(true);
    setSheetOpen(false);
  };

  // ── Сохранение отчёта в Supabase ──
  const submitReport = async () => {
    if (!pendingLatLng || !user) return;
    setReportSaving(true);

    const { error } = await supabase.from('safety_reports').insert([{
      user_id: reportIsAnon ? null : user.id,
      lat: pendingLatLng.lat,
      lng: pendingLatLng.lng,
      category: reportCategory,
      description: reportText.trim() || null,
      is_anonymous: reportIsAnon,
    }]);

    if (!error) {
      addObservation({ id: Date.now(), desc: reportText || CATEGORY_ICONS[reportCategory].label, time: new Date().toISOString() });
    }

    setReportSaving(false);
    setIsAddingReport(false);
    setReportText('');
    setReportCategory('no_lighting');
    setPendingLatLng(null);
  };

  // ── Цвет Safety Score ──
  const scoreColor = safetyScore >= 80 ? 'text-green-500' : safetyScore >= 50 ? 'text-yellow-500' : 'text-red-500';
  const scoreBg = safetyScore >= 80 ? 'bg-green-50' : safetyScore >= 50 ? 'bg-yellow-50' : 'bg-red-50';
  const scoreLabel = safetyScore >= 80 ? t('map.score.safe') : safetyScore >= 50 ? t('map.score.moderate') : t('map.score.dangerous');

  return (
    <div className="relative w-full h-full bg-gray-100 dark:bg-slate-900 overflow-hidden z-0 transition-colors">

      {/* OVERLAY */}
      <AnimatePresence>
        {isAddingReport && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-[1500] bg-black/40 backdrop-blur-sm"
            onClick={() => setIsAddingReport(false)}
          />
        )}
      </AnimatePresence>

      {/* КАРТА */}
      <MapContainer center={bishkekCenter} zoom={14} zoomControl={false} className="absolute inset-0 w-full h-full z-0">
        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
        <MapClickHandler onMapClick={handleMapClick} />

        {/* Маршрут */}
        {routeActive && routePath && (
          <Polyline positions={routePath} color="#ec4899" weight={6} opacity={0.85} />
        )}

        {/* Красная зона плотности угроз (автоматически вычисляем кластеры) */}
        {reports
          .filter(r => r.category !== 'safe_spot')
          .slice(0, 30)
          .map(r => (
            <Circle key={r.id}
              center={[r.lat, r.lng]}
              radius={80}
              pathOptions={{ color: 'transparent', fillColor: CATEGORY_ICONS[r.category]?.color || '#ef4444', fillOpacity: 0.15 }}
            />
          ))
        }

        {/* Маркеры отчётов */}
        {reports.map(r => (
          <Marker key={r.id} position={[r.lat, r.lng]} icon={createReportIcon(r.category, CATEGORY_ICONS)}>
            <Popup className="rounded-xl">
              <div className="font-bold" style={{ color: CATEGORY_ICONS[r.category]?.color }}>
                {CATEGORY_ICONS[r.category]?.emoji} {CATEGORY_ICONS[r.category]?.label}
              </div>
              {r.description && <div className="text-sm text-slate-600 mt-1">{r.description}</div>}
              <div className="text-[10px] text-slate-700 dark:text-slate-200 font-bold">{new Date(r.created_at).toLocaleDateString()}</div>
            </Popup>
          </Marker>
        ))}

        {/* Безопасные места */}
        {safeHavens.map(s => (
          <Marker key={s.id} position={s.coords} icon={createSafeHavenIcon()}>
            <Popup divider>
              <div className="font-black text-green-600 mb-1 flex items-center gap-1"><Home size={14}/> {t('map.categories.safe_spot')}</div>
              <div className="font-bold text-slate-900">{s.name}</div>
              <div className="text-xs text-slate-800 dark:text-slate-300 font-bold mb-1">{s.type}</div>
              <div className="bg-green-50 text-green-700 p-1.5 rounded text-xs font-bold">{s.code}</div>
            </Popup>
          </Marker>
        ))}

        {/* Подруги */}
        {friends.map(f => (
          <Marker key={f.id} position={f.coords} icon={createFriendIcon(f.image)}>
            <Popup><b>{f.name}</b></Popup>
          </Marker>
        ))}

        {/* АКТИВНЫЕ SOS СИГНАЛЫ */}
        {sosAlerts.filter(a => a.status === 'active').map(a => (
          <Marker key={a.id} position={[a.lat, a.lng]} icon={createSosIcon()}>
            <Popup>
              <div className="flex flex-col items-center gap-2 p-1 text-center">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 animate-pulse">
                  <ShieldAlert size={20} />
                </div>
                <div className="text-red-600 font-black text-sm uppercase leading-tight">
                  {t('map.sosAlert')}
                </div>
                <div className="text-[10px] text-slate-600 font-bold">
                  {new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${a.lat},${a.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 w-full py-1.5 bg-red-600 text-white rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm"
                >
                  {t('map.helpNeeded')}
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* ВЕРХНЯЯ ПАНЕЛЬ */}
      <AnimatePresence>
        {companionActive ? (
          <motion.div initial={{ y: -100 }} animate={{ y: 0 }}
            className="absolute top-6 left-4 right-4 z-[1000] bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-2xl shadow-xl border border-pink-100 p-4">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-500 animate-pulse">
                  <PhoneCall size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">{t('map.companion.active')}</p>
                  <p className="text-xs text-pink-500 font-semibold flex items-center gap-1">
                    <Timer size={12}/> {formatTime(timeLeft)} {t('map.companion.autoSos')}
                  </p>
                </div>
              </div>
            </div>
            <button onClick={() => setCompanionActive(false)}
              className="w-full py-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl font-bold shadow-md active:scale-95 transition-all flex items-center justify-center gap-2">
              <Home size={18}/> {t('map.companion.safe')}
            </button>
          </motion.div>
        ) : (
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="absolute top-6 left-4 right-4 z-[1000] flex gap-2">
            <div onClick={() => setSheetOpen(true)}
              className="flex-1 flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-lg cursor-pointer">
              <Search className="w-5 h-5 text-slate-700" />
              <span className="text-slate-900 dark:text-slate-100 text-sm font-black">{t('map.whereGo')}</span>
            </div>
            <button onClick={() => { setCompanionActive(true); setTimeLeft(600); }}
              className="px-4 rounded-2xl bg-gradient-to-br from-pink-500 to-lime-500 text-white shadow-lg flex items-center gap-2 font-bold text-sm active:scale-95 transition-all">
              <Users size={18}/> {t('map.go')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* УВЕДОМЛЕНИЕ О SOS */}
      <AnimatePresence>
        {activeNotification && (
          <motion.div 
            initial={{ y: -50, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 0.9 }}
            className="absolute top-24 left-4 right-4 z-[2000] bg-red-600 text-white p-4 rounded-2xl shadow-2xl border-4 border-white dark:border-slate-800 flex items-center gap-4 cursor-pointer"
            onClick={() => {
              const alert = sosAlerts.find(a => a.id === activeNotification.id);
              if (alert) {
                // В будущем центрирование
                setActiveNotification(null);
              }
            }}
          >
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-red-600 shadow-inner flex-shrink-0 animate-pulse">
              <ShieldAlert size={28} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-black uppercase tracking-wider animate-bounce">{t('map.sosAlert')}</p>
              <p className="text-xs font-bold opacity-90">{t('map.helpNeeded')}</p>
            </div>
            <button onClick={(e) => { e.stopPropagation(); setActiveNotification(null); }} className="w-8 h-8 flex items-center justify-center">
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ОФЛАЙН */}
      {!navigator.onLine && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[1000] bg-red-100 text-red-600 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
          <WifiOff size={14}/> {t('map.offlineMode')}
        </div>
      )}

      {/* ПОДСКАЗКА: кликни по карте */}
      {!sheetOpen && !isAddingReport && user && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="absolute top-24 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-bold text-slate-800 dark:text-slate-100 shadow-md border border-slate-200 dark:border-slate-700 whitespace-nowrap font-black">
          {t('map.clickToMark')}
        </motion.div>
      )}

      {/* КНОПКИ УПРАВЛЕНИЯ */}
      <motion.button
        className="absolute bottom-32 left-4 z-[1000] w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center text-slate-700 dark:text-slate-300 active:scale-90 transition-all"
        whileTap={{ scale: 0.9 }}
        onClick={() => setSheetOpen(s => !s)}
      >
        <BarChart2 className="w-5 h-5 text-pink-500" />
      </motion.button>

      {/* SOS */}
      <div className="absolute bottom-32 right-4 z-[1000]">
        <div className="relative flex flex-col items-center gap-2">
          <motion.div
            className="absolute inset-0 rounded-full bg-red-500"
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ filter: 'blur(8px)' }}
          />
          <motion.button
            onPointerDown={() => { sosTimerRef.current = setTimeout(triggerSOS, 1500); setSosStatus('locating'); }}
            onPointerUp={() => { clearTimeout(sosTimerRef.current); if (sosStatus !== 'sent') setSosStatus('idle'); }}
            onPointerLeave={() => { clearTimeout(sosTimerRef.current); if (sosStatus !== 'sent') setSosStatus('idle'); }}
            className={`relative w-20 h-20 rounded-full shadow-2xl flex flex-col items-center justify-center text-white transition-colors duration-300 ${
              sosStatus === 'sent' ? 'bg-green-500' :
              sosStatus === 'locating' ? 'bg-orange-500' :
              'bg-gradient-to-br from-red-500 to-red-600'
            }`}
            whileTap={{ scale: 0.95 }}
            disabled={sosStatus !== 'idle'}
          >
            {sosStatus === 'locating' ? (
              <><div className="animate-spin rounded-full h-7 w-7 border-b-2 border-white mb-0.5" /><span className="text-[9px] font-black uppercase tracking-widest">{t('common.loading')}</span></>
            ) : sosStatus === 'sent' ? (
              <><span className="text-2xl">✓</span><span className="text-[9px] font-black uppercase tracking-widest">{t('map.sosSent')}</span></>
            ) : (
              <span className="text-2xl font-black drop-shadow-md">SOS</span>
            )}
          </motion.button>
          {sosStatus === 'idle' && (
            <p className="text-[10px] font-bold text-red-600 dark:text-red-400 bg-white/80 dark:bg-slate-800/80 px-2 py-0.5 rounded-full whitespace-nowrap backdrop-blur-sm">{t('map.holdSos')}</p>
          )}
          {sosStatus === 'sent' && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-4 -right-16 z-50">
              <p className="text-[10px] font-bold text-green-600 bg-white/80 px-2 py-0.5 rounded-full whitespace-nowrap">{t('map.sosSent')}</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* МОДАЛЬНОЕ ОКНО ДОБАВЛЕНИЯ ОТЧЁТА */}
      <AnimatePresence>
        {isAddingReport && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="absolute bottom-0 left-0 right-0 z-[2000] bg-white dark:bg-slate-900 rounded-t-[32px] shadow-2xl p-6 border border-slate-100 dark:border-slate-800"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-black text-slate-800 dark:text-white">{t('map.addMarker')}</h3>
              <button onClick={() => setIsAddingReport(false)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-700">
                <X size={16}/>
              </button>
            </div>

            {/* Категории */}
            <p className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-widest font-black mb-3">{t('map.problemType')}</p>
            <div className="grid grid-cols-2 gap-2 mb-5">
              {Object.entries(CATEGORY_ICONS).map(([key, cfg]) => (
                <button key={key}
                  onClick={() => setReportCategory(key)}
                  style={{
                    background: reportCategory === key ? cfg.color : undefined,
                    borderColor: reportCategory === key ? cfg.color : undefined,
                  }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-2xl text-sm font-bold border-2 transition-all ${
                    reportCategory === key
                      ? 'text-white border-transparent shadow-md scale-[1.02]'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-700 font-black'
                  }`}
                >
                  <span className="text-base">{cfg.emoji}</span>
                  <span className="leading-tight text-left text-xs">{cfg.label}</span>
                </button>
              ))}
            </div>

            {/* Описание */}
            <textarea
              className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-pink-500 transition-all min-h-[80px] font-black placeholder:text-slate-400"
              placeholder={t('map.describeProblem')}
              value={reportText}
              onChange={e => setReportText(e.target.value)}
            />

            {/* Анонимность */}
            <label className="flex items-center gap-3 mb-5 cursor-pointer">
              <input type="checkbox" checked={reportIsAnon} onChange={e => setReportIsAnon(e.target.checked)} className="w-4 h-4 rounded accent-pink-500" />
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{t('map.anonymous')}</span>
            </label>

            <button
              onClick={submitReport}
              disabled={reportSaving}
              className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-lime-500 text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-all disabled:opacity-60"
            >
              {reportSaving ? t('common.loading') : t('map.publishOnMap')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* НИЖНЯЯ ШТОРКА */}
      <AnimatePresence>
        {sheetOpen && (
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 right-0 z-[1000] bg-white dark:bg-slate-900 rounded-t-[32px] shadow-2xl transition-colors">
            <div className="p-6 pb-28">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-black text-slate-800 dark:text-white">{t('map.safeRoute')}</h2>
                <button onClick={() => setSheetOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors">✕</button>
              </div>

              {/* Поля маршрута */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                  <div className="w-3 h-3 rounded-full bg-lime-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('map.currentLocation')}</span>
                </div>
                <div className="flex items-center gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                  <MapPin className="w-4 h-4 text-pink-500" />
                  <input type="text" placeholder={t('map.destination')} className="flex-1 bg-transparent outline-none text-sm font-black text-slate-900 dark:text-white placeholder:text-slate-400" />
                </div>
              </div>

              {/* Кнопки */}
              <div className="flex gap-2 mb-5">
                <button
                  onClick={async () => {
                    const end = [42.8780, 74.5800];
                    await fetchOSRMRoute(bishkekCenter, end);
                    setRouteActive(true);
                    setSheetOpen(false);
                  }}
                  className="flex-[2] py-3.5 bg-gradient-to-r from-pink-500 to-lime-500 text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <ShieldCheck size={18}/> {t('map.findSafeRoute')}
                </button>
                <button
                  onClick={() => { setSheetOpen(false); setIsAddingReport(true); setPendingLatLng({ lat: bishkekCenter[0], lng: bishkekCenter[1] }); }}
                  className="flex-[1] flex items-center justify-center gap-1 py-3.5 bg-red-50 dark:bg-red-900/30 text-red-600 rounded-2xl font-bold border border-red-200 dark:border-red-900/50 active:scale-95 transition-all"
                >
                  <ShieldAlert size={18}/>
                </button>
              </div>

              {/* Safety Score */}
              {safetyScore !== null && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex items-center gap-4 p-4 rounded-2xl mb-5 ${scoreBg} dark:bg-slate-800/50`}>
                  <div className={`text-4xl font-black ${scoreColor}`}>{safetyScore}<span className="text-lg">%</span></div>
                  <div>
                    <p className={`font-black ${scoreColor}`}>{scoreLabel} {t('map.safeRoute')}</p>
                    <p className="text-xs text-slate-800 dark:text-slate-200 mt-1 font-bold">
                      {t('map.analyzed')} {reports.filter(r => r.category !== 'safe_spot').length} {t('map.reportsNearby')}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Легенда отчётов */}
              <div>
                <p className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
                  {t('map.crowdsource')} {reportsLoading ? '...' : `(${reports.length})`}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {Object.entries(CATEGORY_ICONS).map(([key, cfg]) => {
                    const count = reports.filter(r => r.category === key).length;
                    return (
                      <div key={key} className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 dark:bg-slate-800 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300">
                        <span>{cfg.emoji}</span>
                        <span>{cfg.label.split(' ')[0]}</span>
                        <span className="font-black" style={{ color: cfg.color }}>{count}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Последние отчёты */}
                <div className="max-h-[180px] overflow-y-auto space-y-2 no-scrollbar">
                  {reports.slice(0, 8).map(r => {
                    const cfg = CATEGORY_ICONS[r.category];
                    return (
                      <div key={r.id} className="flex items-start gap-3 p-3"
                        style={{ background: cfg.bg + '80', borderRadius: '14px' }}>
                        <span className="text-base mt-0.5">{cfg.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-black" style={{ color: cfg.color }}>{cfg.label}</p>
                          {r.description && <p className="text-xs text-slate-600 dark:text-slate-300 truncate">{r.description}</p>}
                          <p className="text-[10px] text-slate-700 dark:text-slate-300 font-black mt-1">
                            {r.is_anonymous ? t('map.anonymous') : t('map.member')} · {new Date(r.created_at).toLocaleDateString(i18n.language, { day: 'numeric', month: 'short' })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  {reports.length === 0 && !reportsLoading && (
                    <p className="text-center text-sm text-slate-400 py-4">{t('map.beFirst')}</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
