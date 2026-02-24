import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDarkMode } from '../hooks/useDarkMode'; 
import { Sun, Moon, Settings, Languages } from 'lucide-react'; 

const SettingsMenu = ()=> {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const { themePreference, setMode, appliedTheme } = useDarkMode();

    // 't' is for translation, 'i18n' is the instance for control
    const { t, i18n } = useTranslation();

    const handleLanguageChange = (lng: string) => {
        i18n.changeLanguage(lng);
		setIsMenuOpen(false); 
    };
    const handleThemeChange = (mode: 'dark' | 'light' | 'system') => {
        setMode(mode);
        // setIsMenuOpen(false); // maybe not close the settings if the user wants to preview changes?
    };
    
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setIsMenuOpen(false);
			}
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    // Helper to determine the next theme for a simple toggle button
    const getNextMode = (current: typeof themePreference) => {
        if (current === 'light') return 'dark';
        if (current === 'dark') return 'system';
        return 'light'; // if current is 'system'
    };
    
    const ThemeIcon = appliedTheme === 'dark' ? Moon : Sun;

    return (
        <div className="absolute end-4 z-20">
            <div className="relative" ref={menuRef}>
                <button
                    className="flex items-center gap-1.5 px-4 py-2 font-medium rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 duration-150 
                   bg-white/80 dark:bg-gray-900/80 backdrop-blur-md 
                   shadow-lg shadow-indigo-500/10 transition-all transform hover:border-indigo-500/40 hover:shadow-indigo-500/20 hover:duration-300 text-xs md:text-sm bg-clip-text text-transparent bg-linear-to-r from-indigo-500 dark:from-indigo-400 to-blue-400 hover:bg-linear-to-bl active:scale-95"
                    onClick={toggleMenu}
                    aria-expanded={isMenuOpen}
                >
                    <Settings size={20} className='text-gray-800 dark:text-white' />
                    <span className="inline">{t('settings')}</span>
                </button>
                {isMenuOpen && (
                <div className="absolute right-0 bottom-full mb-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        
                        {/* dark / light mode selection */}
                        <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                            <h4 className="text-sm font-semibold mb-1 text-gray-500 dark:text-gray-400 px-2">{t('theme')}</h4>
                            <button
                                onClick={() => handleThemeChange(getNextMode(themePreference))}
                                className="w-full text-left flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150 text-gray-700 dark:text-gray-300 rounded-lg"
                            >
                                <ThemeIcon size={20} className="text-blue-500" />
                                <span>{t(`${themePreference}`)}</span>
                            </button>
                        </div>
                        
                        {/* language selection */}
                        <div className="p-2">
                            <h4 className="text-sm font-semibold mb-1 text-gray-500 dark:text-gray-400 px-2">{t('language')}</h4>
                            <button
                                onClick={() => handleLanguageChange('en')}
                                className={`w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150 ${
                                    i18n.language === 'en' 
                                        ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-medium' 
                                        : 'text-gray-700 dark:text-gray-300'
                                }`}
                            >
                                <Languages size={20} />
                                {t('language_en')}
                            </button>
                            <button
                                onClick={() => handleLanguageChange('fi')}
                                className={`w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150 ${
                                    i18n.language === 'fi' 
                                        ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-medium' 
                                        : 'text-gray-700 dark:text-gray-300'
                                }`}
                            >
                                <Languages size={20} />
                                {t('language_fi')}
                            </button>
							<button
                                onClick={() => handleLanguageChange('sv')}
                                className={`w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150 ${
                                    i18n.language === 'sv' 
                                        ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-medium' 
                                        : 'text-gray-700 dark:text-gray-300'
                                }`}
                            >
                                <Languages size={20} />
                                {t('language_sv')}
                            </button>
                        </div>

                    </div>
                )}
            </div>
       </div>
    )
}

export default SettingsMenu;