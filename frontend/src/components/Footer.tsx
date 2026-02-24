import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PolicyModal from './PolicyModal.tsx';

const Footer = () => {
  const { t } = useTranslation();
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    htmlContent: '',
  });

  const fetchAndOpenModal = async (type: 'tos' | 'privacy') => {
    try {
      const filePath = `/legal/${type}.html`;
      const response = await fetch(filePath);

      if (!response.ok) throw new Error(t('could_not_load_document'));

      const html = await response.text();

      setModalConfig({
        isOpen: true,
        title: type === 'tos' ? t('terms') : t('privacy_policy'),
        htmlContent: html,
      });
    } catch (err) {
      console.error('Error loading legal file:', err);
      setModalConfig({
        isOpen: true,
        title: t('error'),
        htmlContent: `<p>${t('unable_to_load_document') || 'Unable to load document.'}</p>`,
      });
    }
  };

  return (
	<>
    <footer className="w-full py-3 relative z-10 max-w-fit px-4 
                   rounded-full border border-indigo-200/20 dark:border-indigo-900/30 
                   bg-white/80 dark:bg-gray-900/80 backdrop-blur-md 
                   shadow-lg shadow-indigo-500/10 transition-all transform hover:border-indigo-500/40 hover:shadow-indigo-500/20 hover:duration-300">
      <div className="max-w-7xl mx-auto px-4 flex md:flex-row justify-center items-center gap-8">

        <div className="flex space-x-6">
          <button
            onClick={() => fetchAndOpenModal('tos')}
            className="text-xs md:text-sm bg-clip-text text-transparent bg-linear-to-r from-indigo-500 dark:from-indigo-400 to-blue-400 hover:bg-linear-to-bl transition-colors active:scale-95"
          >
            {t('terms')}
          </button>
          <button
            onClick={() => fetchAndOpenModal('privacy')}
            className="text-xs md:text-sm bg-clip-text text-transparent bg-linear-to-r from-indigo-500 dark:from-indigo-400 to-blue-400 hover:bg-linear-to-bl transition-colors active:scale-95"
          >
            {t('privacy_policy')}
          </button>
        </div>
      </div>
    </footer>
	<PolicyModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
        title={modalConfig.title}
        htmlContent={modalConfig.htmlContent}
      />
	</>
  );
};

export default Footer;
