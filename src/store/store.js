import { create } from 'zustand';
import { supabase } from '../supabase';

export const useAppStore = create((set, get) => ({
  // ==========================================
  // 1. АВТОРИЗАЦИЯ И ПОЛЬЗОВАТЕЛЬ (AUTH)
  // ==========================================
  user: null,
  isInitializing: true,
  loading: false,
  
  checkAuth: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      set({ user: session?.user || null, isInitializing: false });
    } catch (error) {
      console.error('checkAuth error:', error);
      set({ isInitializing: false });
    }
  },
  
  login: async (email, password, demoUserData = null) => {
    set({ loading: true });
    try {
      if (demoUserData) {
        set({ user: demoUserData, loading: false });
        return { success: true, user: demoUserData };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      set({ user: data.user, loading: false });
      return { success: true, user: data.user };
    } catch (error) {
      set({ loading: false });
      return { success: false, error: error.message };
    }
  },

  register: async (email, password, firstName, lastName) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { firstName, lastName },
        },
      });

      if (error) throw error;
      set({ user: data.user, loading: false });
      return { success: true, user: data.user };
    } catch (error) {
      set({ loading: false });
      return { success: false, error: error.message };
    }
  },
  
  logout: async () => {
    try {
      await supabase.auth.signOut();
      set({ user: null });
      return { success: true };
    } catch (error) {
      console.error('logout error:', error);
      return { success: false, error: error.message };
    }
  },

  updateProfile: async (newData) => {
    try {
      const user = get().user;
      if (!user) return { success: false, error: 'No user signed in' };

      // Update in Supabase auth User metadata
      const { data, error } = await supabase.auth.updateUser({
        data: newData
      });

      if (error) throw error;
      
      // Update local state
      set({ user: data.user });
      return { success: true };
    } catch (error) {
      console.error('updateProfile error:', error);
      return { success: false, error: error.message };
    }
  },

  // ==========================================
  // 2. КАРТА И БЕЗОПАСНОСТЬ (MAP & SOS)
  // ==========================================
  markers: [],
  
  fetchMarkers: async () => {
    const { data, error } = await supabase.from('map_markers').select('*');
    if (error) {
      console.error("Ошибка загрузки маркеров:", error);
    } else {
      set({ markers: data });
    }
  },

  triggerSOSBackend: async (lat, lng) => {
    // get() позволяет нам получить текущего пользователя внутри хранилища
    const user = get().user; 
    
    if (!user) {
      console.warn("Для отправки SOS нужно войти в аккаунт");
      return; 
    }
    
    const { error } = await supabase.from('sos_alerts').insert([
      { 
        user_id: user.id, 
        lat: lat, 
        lng: lng, 
        status: 'active' 
      }
    ]);
    
    if (error) console.error("Ошибка отправки SOS:", error);
  },

  // ==========================================
  // 3. НАБЛЮДЕНИЯ ПОЛЬЗОВАТЕЛЯ (OBSERVATIONS)
  // ==========================================
  observations: [],
  addObservation: (obs) => set((state) => ({ observations: [obs, ...state.observations] })),

  // ==========================================
  // 4. НАСТРОЙКИ (SETTINGS / LANGUAGE)
  // ==========================================
  language: localStorage.getItem('app-language') || 'ru',

  setLanguage: (lang) => {
    localStorage.setItem('app-language', lang);
    set({ language: lang });
  }
}));

// Экспортируем второе имя (useAuthStore), чтобы старые файлы, 
// где ты использовала useAuthStore, не сломались и продолжали работать.
export const useAuthStore = useAppStore;