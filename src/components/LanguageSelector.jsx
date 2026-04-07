import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/store';
import { Globe } from 'lucide-react';
import { Button } from './ui/button';

export default function LanguageSelector() {
  const { i18n, t } = useTranslation();
  const { language, setLanguage } = useAppStore();
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'ru', label: 'Русский' },
    { code: 'ky', label: 'Кыргызча' },
  ];

  const handleLanguageChange = (code) => {
    i18n.changeLanguage(code);
    setLanguage(code);
  };

  return (
    <div className="flex items-center gap-2">
      <Globe size={20} className="text-muted-foreground" />
      <div className="flex gap-1">
        {languages.map(lang => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              language === lang.code
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80 text-muted-foreground'
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  );
}
