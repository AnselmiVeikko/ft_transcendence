import { useTranslation } from 'react-i18next'

interface PolicyModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	htmlContent: string;
}

const PolicyModal = ({ isOpen, onClose, title, htmlContent }: PolicyModalProps) => {
	
	const { t } = useTranslation();
	
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-md">
			<div className="bg-white w-full max-w-2xl max-h-[80vh] rounded-xl shadow-2xl flex flex-col">
				<div
					className="p-12 mt-6 overflow-y-auto rounded-xl text-gray-600 leading-relaxed prose max-w-none"
					title={title}
					dangerouslySetInnerHTML={{ __html: htmlContent }}
                />

                <div className="p-4">
                    <button onClick={onClose} className="px-6 py-2 bg-blue-600 text-white rounded-lg">
                        {t('close')}
                    </button>
                </div>
            </div>
		</div>
	)
}

export default PolicyModal;