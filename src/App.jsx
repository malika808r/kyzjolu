import { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import { ThemeProvider } from 'next-themes';
import i18n from './i18n/config';
import { router } from './routes.jsx';
import { useAppStore, useAuthStore } from './store/store';

export default function App() {
  const { language, theme } = useAppStore();
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <I18nextProvider i18n={i18n}>
        <RouterProvider router={router} />
      </I18nextProvider>
    </ThemeProvider>
  );
}
