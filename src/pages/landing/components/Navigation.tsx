import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { cn } from '../../../lib/cn';

export default function Navigation() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { label: t('nav.features'), href: '#features' },
    { label: t('nav.howItWorks'), href: '#how-it-works' },
    { label: t('nav.forWorkers'), href: '#workers' },
    { label: t('nav.forBusinesses'), href: '#businesses' },
    { label: t('nav.pricing'), href: '#pricing' },
    { label: t('nav.faq'), href: '#faq' },
  ];

  const languages = [
    { code: 'en', label: '🇦🇺' },
    { code: 'pt-BR', label: '🇧🇷' },
    { code: 'es', label: '🇪🇸' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#" className="text-2xl font-bold text-primary">
              {t('nav.logo')}
            </a>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="flex items-center space-x-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => i18n.changeLanguage(lang.code)}
                  className={`text-2xl px-2 py-1 rounded transition-all ${
                    i18n.language === lang.code
                      ? 'opacity-100 scale-110'
                      : 'opacity-50 hover:opacity-75'
                  }`}
                  aria-label={`Switch to ${lang.code}`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* Theme Toggle */}
            <button
              type="button"
              className={cn(
                'relative w-20 h-10 rounded-full border border-border inline-flex items-center cursor-pointer transition-colors duration-200 bg-muted',
                theme === 'dark' && 'bg-primary/15'
              )}
              onClick={toggleTheme}
              role="switch"
              aria-checked={theme === 'dark'}
              aria-label={
                theme === 'dark' ? t('nav.theme.switchToLight') : t('nav.theme.switchToDark')
              }
            >
              {/* Sliding circle */}
              <span
                className={cn(
                  'absolute top-1 w-8 h-8 rounded-full bg-background shadow-lg transition-transform duration-200 ease-in-out',
                  theme === 'dark' ? 'translate-x-10' : 'translate-x-1'
                )}
                aria-hidden="true"
              />
              {/* Sun icon */}
              <span
                className={cn(
                  'absolute left-2.5 w-5 h-5 inline-flex items-center justify-center transition-colors duration-200',
                  theme === 'light' ? 'text-primary' : 'text-muted-foreground'
                )}
                aria-hidden="true"
              >
                <Sun className="size-5" strokeWidth={1.8} aria-hidden="true" />
              </span>
              {/* Moon icon */}
              <span
                className={cn(
                  'absolute right-2.5 w-5 h-5 inline-flex items-center justify-center transition-colors duration-200',
                  theme === 'dark' ? 'text-primary' : 'text-muted-foreground'
                )}
                aria-hidden="true"
              >
                <Moon className="size-5" strokeWidth={1.8} aria-hidden="true" />
              </span>
            </button>

            {/* CTA Button */}
            <a
              href="#"
              className="hidden sm:inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              {t('nav.getStarted')}
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
