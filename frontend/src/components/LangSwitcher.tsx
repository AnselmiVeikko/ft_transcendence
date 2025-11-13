import { useState } from 'react'
import { useTranslation, Trans } from 'react-i18next'

const LangSwitcher = ()=> {

	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const handleLanguageChange = (lng: string) => {
    	i18n.changeLanguage(lng);
		setIsMenuOpen(false); 
	};

	// 't' is for translation, 'i18n' is the instance for control
	const { t, i18n } = useTranslation();
  	
	const toggleMenu = () => {
    	setIsMenuOpen(!isMenuOpen);
	};

	return (
		<div className="absolute top-4 end-4 z-20"> 
			<div className="relative">
				<button
					className="flex items-center px-4 py-2 bg-white text-gray-800 font-medium rounded-full shadow-lg hover:bg-gray-100 transition duration-150 border border-gray-200"
					onClick={toggleMenu}
					aria-expanded={isMenuOpen}
				>
				<span className="hidden sm:inline">{i18n.language.toUpperCase()}</span>
				</button>
				{isMenuOpen && (
				<div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
						<button
							onClick={() => handleLanguageChange('en')}
							className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition duration-150 ${
								i18n.language === 'en' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
							}`}
						>
							{t('language_en')}
						</button>
						<button
							onClick={() => handleLanguageChange('fi')}
							className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition duration-150 ${
								i18n.language === 'fi' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
							}`}
						>
							{t('language_fi')}
						</button>
					</div>
				)}
			</div>
		</div>
	)
}

export default LangSwitcher;