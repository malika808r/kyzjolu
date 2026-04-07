import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../supabase';

export const useAppStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      login: (userData) => set({
        user: userData,
        isAuthenticated: true,
      }),
      
      logout: () => set({
        user: null,
        isAuthenticated: false,
      }),
      
      updateUser: (userData) => set((state) => ({
        user: { ...state.user, ...userData },
      })),
      
      language: 'ru',
      setLanguage: (lang) => set({ language: lang }),
      
      theme: 'light',
      toggleTheme: () => set((state) => ({
        theme: state.theme === 'light' ? 'dark' : 'light',
      })),
      setTheme: (theme) => set({ theme }),
      
      notifications: [],
      addNotification: (notification) => set((state) => ({
        notifications: [...state.notifications, { id: Date.now(), ...notification }],
      })),
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id),
      })),
    }),
    {
      name: 'kyzjolu-app-store',
      partialize: (state) => ({
        language: state.language,
        theme: state.theme,
      }),
    }
  )
);

// Auth Store
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      error: null,
      
      register: async (email, password, firstName, lastName) => {
        set({ loading: true, error: null });
        try {
          console.log('Starting registration for email:', email);
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
          });
          
          if (authError) {
            console.error('SignUp error:', authError);
            throw authError;
          }
          
          console.log('SignUp successful, user ID:', authData.user?.id);
          
          if (authData.user) {
            const { error: profileError } = await supabase.from('profiles').insert([
              {
                id: authData.user.id,
                email,
                first_name: firstName,
                last_name: lastName,
                avatar: '👤',
              },
            ]);
            
            if (profileError) {
              console.warn('Profile insert warning:', profileError);
            }
          }
          
          // После регистрации, попытаемся автоматически войти
          console.log('Attempting auto-login after registration...');
          const loginResult = await get().login(email, password);
          
          if (!loginResult.success) {
            console.warn('Auto-login failed after registration:', loginResult.error);
            // Даже если автоматический вход не удался, регистрация успешна
          }
          
          const userData = {
            id: authData.user.id,
            email,
            firstName,
            lastName,
            avatar: '👤',
          };
          
          set({ user: userData });
          useAppStore.getState().login(userData);
          return { success: true, user: userData };
        } catch (err) {
          console.error('Registration error details:', err);
          const errorMessage = err.message || 'Регистрация не удалась';
          set({ error: errorMessage });
          return { success: false, error: errorMessage };
        } finally {
          set({ loading: false });
        }
      },
      
      login: async (email, password, demoUserData = null) => {
        set({ loading: true, error: null });
        try {
          // Проверяем, это демо режим
          if (demoUserData) {
            console.log('Demo mode login');
            const userData = {
              ...demoUserData,
              isDemo: true,
            };
            set({ user: userData });
            useAppStore.getState().login(userData);
            return { success: true, user: userData };
          }
          
          console.log('Attempting login with email:', email);
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (error) {
            console.error('Auth error:', error);
            throw error;
          }
          
          console.log('Login successful, fetching profile...');
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
          
          if (profileError) {
            console.warn('Profile fetch warning:', profileError);
          }
          
          const userData = {
            id: data.user.id,
            email: data.user.email,
            firstName: profile?.first_name || '',
            lastName: profile?.last_name || '',
            avatar: profile?.avatar || '👤',
            bio: profile?.bio || '',
          };
          
          set({ user: userData });
          useAppStore.getState().login(userData);
          
          return { success: true, user: userData };
        } catch (err) {
          console.error('Login error details:', err);
          const errorMessage = err.message || 'Вход не удался';
          set({ error: errorMessage });
          return { success: false, error: errorMessage };
        } finally {
          set({ loading: false });
        }
      },
      
      logout: async () => {
        set({ loading: true });
        try {
          const currentUser = useAuthStore.getState().user;
          // Если это демо пользователь, просто выходим без вызова Supabase
          if (currentUser?.isDemo) {
            set({ user: null });
            useAppStore.getState().logout();
            return { success: true };
          }
          
          await supabase.auth.signOut();
          set({ user: null });
          useAppStore.getState().logout();
          return { success: true };
        } catch (err) {
          set({ error: err.message });
          return { success: false };
        } finally {
          set({ loading: false });
        }
      },
      
      initializeAuth: async () => {
        set({ loading: true });
        try {
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            const userData = {
              id: session.user.id,
              email: session.user.email,
              firstName: profile?.first_name || '',
              lastName: profile?.last_name || '',
              avatar: profile?.avatar || '👤',
              bio: profile?.bio || '',
            };
            
            set({ user: userData });
            useAppStore.getState().login(userData);
          }
        } catch (err) {
          console.error('Auth init error:', err);
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'kyzjolu-auth-store',
    }
  )
);

// Posts Store
export const usePostStore = create((set, get) => ({
  posts: [],
  loading: false,
  
  fetchPosts: async (type = 'all') => {
    set({ loading: true });
    try {
      let query = supabase
        .from('posts')
        .select('*, profiles(first_name, last_name, avatar)')
        .order('created_at', { ascending: false });
      
      if (type !== 'all') {
        query = query.eq('type', type);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      set({ posts: data || [] });
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      set({ loading: false });
    }
  },
  
  createPost: async (post) => {
    const user = useAppStore.getState().user;
    if (!user) return { success: false };
    
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            user_id: user.id,
            content: post.content,
            type: post.type || 'all',
          },
        ])
        .select('*, profiles(first_name, last_name, avatar)');
      
      if (error) throw error;
      
      set((state) => ({
        posts: [data[0], ...state.posts],
      }));
      
      return { success: true };
    } catch (err) {
      console.error('Failed to create post:', err);
      return { success: false };
    }
  },
  
  deletePost: async (postId) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);
      
      if (error) throw error;
      
      set((state) => ({
        posts: state.posts.filter((p) => p.id !== postId),
      }));
      
      return { success: true };
    } catch (err) {
      console.error('Failed to delete post:', err);
      return { success: false };
    }
  },
  
  likePost: async (postId) => {
    const user = useAppStore.getState().user;
    if (!user) return { success: false };
    
    try {
      const post = get().posts.find((p) => p.id === postId);
      const { data: existingLike } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();
      
      if (existingLike) {
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
        
        await supabase
          .from('posts')
          .update({ likes_count: Math.max(0, (post?.likes_count || 1) - 1) })
          .eq('id', postId);
      } else {
        await supabase
          .from('post_likes')
          .insert([{ post_id: postId, user_id: user.id }]);
        
        await supabase
          .from('posts')
          .update({ likes_count: (post?.likes_count || 0) + 1 })
          .eq('id', postId);
      }
      
      await get().fetchPosts();
      return { success: true };
    } catch (err) {
      console.error('Failed to like post:', err);
      return { success: false };
    }
  },
}));

// Events Store
export const useEventStore = create((set, get) => ({
  events: [],
  loading: false,
  
  fetchEvents: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*, profiles(first_name, last_name, avatar)')
        .order('datetime', { ascending: true });
      
      if (error) throw error;
      
      set({ events: data || [] });
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      set({ loading: false });
    }
  },
  
  createEvent: async (event) => {
    const user = useAppStore.getState().user;
    if (!user) return { success: false };
    
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([
          {
            user_id: user.id,
            title: event.title,
            description: event.description,
            datetime: event.datetime,
            location: event.location,
            category: event.category || 'networking',
          },
        ])
        .select('*, profiles(first_name, last_name, avatar)');
      
      if (error) throw error;
      
      set((state) => ({
        events: [data[0], ...state.events],
      }));
      
      return { success: true };
    } catch (err) {
      console.error('Failed to create event:', err);
      return { success: false };
    }
  },
  
  deleteEvent: async (eventId) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);
      
      if (error) throw error;
      
      set((state) => ({
        events: state.events.filter((e) => e.id !== eventId),
      }));
      
      return { success: true };
    } catch (err) {
      console.error('Failed to delete event:', err);
      return { success: false };
    }
  },
  
  registerForEvent: async (eventId) => {
    const user = useAppStore.getState().user;
    if (!user) return { success: false };
    
    try {
      const { error } = await supabase
        .from('event_registrations')
        .insert([{ event_id: eventId, user_id: user.id }]);
      
      if (error) throw error;
      
      await get().fetchEvents();
      return { success: true };
    } catch (err) {
      console.error('Failed to register for event:', err);
      return { success: false };
    }
  },
}));

// Chat Store
export const useChatStore = create((set, get) => ({
  chats: [],
  messages: {},
  loading: false,
  
  fetchChats: async () => {
    const user = useAppStore.getState().user;
    if (!user) return;
    
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*, sender:sender_id(first_name, last_name, avatar)')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const groupedChats = {};
      data?.forEach((msg) => {
        const otherId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
        if (!groupedChats[otherId]) {
          groupedChats[otherId] = [];
        }
        groupedChats[otherId].push(msg);
      });
      
      set({ chats: Object.keys(groupedChats), messages: groupedChats });
    } catch (err) {
      console.error('Failed to fetch chats:', err);
    } finally {
      set({ loading: false });
    }
  },
  
  fetchMessages: async (userId) => {
    const currentUser = useAppStore.getState().user;
    if (!currentUser) return;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${currentUser.id})`)
        .order('created_at');
      
      if (error) throw error;
      
      set((state) => ({
        messages: { ...state.messages, [userId]: data || [] },
      }));
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  },
  
  sendMessage: async (receiverId, content) => {
    const user = useAppStore.getState().user;
    if (!user) return { success: false };
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            sender_id: user.id,
            receiver_id: receiverId,
            content: content,
          },
        ])
        .select();
      
      if (error) throw error;
      
      set((state) => ({
        messages: {
          ...state.messages,
          [receiverId]: [...(state.messages[receiverId] || []), data[0]],
        },
      }));
      
      return { success: true };
    } catch (err) {
      console.error('Failed to send message:', err);
      return { success: false };
    }
  },
}));
