import { useState } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import PolicyModal from './PolicyModal.tsx'

const RegisterForm = ()=> {

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [acceptTerms, setAcceptTerms] = useState(false);
	const [isModalLoading, setIsModalLoading] = useState(false);
	const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', htmlContent: '' });
	const RegisterAPI = '/api/user/registration';

	const { t } = useTranslation();
	const navigate = useNavigate();

	const fetchAndOpenModal = async (type: 'tos' | 'privacy') => {
		setIsModalLoading(true);
		try {
			const filePath = `/legal/${type}.html`;
			const response = await fetch(filePath);

			if (!response.ok) throw new Error(t('could_not_load_document'));

			const html = await response.text();

			setModalConfig({
				isOpen: true,
				title: type === 'tos' ? t('terms') : t('privacy_policy'),
				htmlContent: html
			});
		} catch (err) {
			console.error("Error loading legal file:", err);
			setModalConfig({
				isOpen: true,
				title: t('error'),
				htmlContent: "<p>Unable to load document. Please try again later.</p>"
			});
		}
		setIsModalLoading(false);
	}

	const openTerms = (e: React.MouseEvent) => {
		e.preventDefault();
		fetchAndOpenModal('tos');
	};

	const openPrivacy = (e: React.MouseEvent) => {
		e.preventDefault();
		fetchAndOpenModal('privacy');
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setSuccess('');
		setLoading(true);

		const target = e.target as typeof e.target & {
			username: { value: string };
			email: { value: string };
			password: { value: string };
			confirmPassword: { value: string };
			acceptTerms: { value: boolean };
		};

		const userName = target.username.value;
		const email = target.email.value;
		const password = target.password.value;
		const confirmPassword = target.confirmPassword.value;

		if (!acceptTerms) {
			setError(t('terms_must_accept'));
			setLoading(false);
			return;
		}
		if (password !== confirmPassword) {
            setError(t('password_mismatch'));
            setLoading(false);
            return;
        }
		if (!userName || !email || !password || !confirmPassword) {
            setError(t('all_fields_required'));
            setLoading(false);
            return;
        }

		try {
			const response = await fetch(RegisterAPI, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					userName,
					email,
					password,
				}),
			});
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || t('registration_failed'));
			}
			setSuccess(t('registration_success'));
			navigate('/');

		} catch (err: unknown) {
			setError(t('registration_failed'));
		} finally {
			setLoading(false);
		}
	}

	const formStyle = "block text-left dark:text-white text-sm font-medium mb-2";
	const formFieldStyle = "dark:text-white w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";

	return (
		<form onSubmit={handleSubmit}>
				{error && (
				<div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
					{error}
				</div>
			)}
			{success && !loading && (
				<div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
					{success}
				</div>
			)}
			<div className="space-y-4">
				<div>
					<label htmlFor="username" className={`${formStyle}`}>
						{t('username')}
					</label>
					<input
						type="text"
						id="username"
						name="username"
						autoComplete="username"
                		minLength={2}
                		maxLength={20}
						className={`${formFieldStyle}`}
						placeholder={t('enter-username')}
						/>
				</div>
				<div>
					<label htmlFor="email" className={`${formStyle}`}>
						{t('email')}
					</label>
					<input
						type="email"
						id="email"
						name="email"
						autoComplete="email"
                		minLength={6}
                		maxLength={30}
						className={`${formFieldStyle}`}
						placeholder={t('enter-email')}
					/>
				</div>
				<div>
					<label htmlFor="password" className={`${formStyle}`}>
						{t('password')}
					</label>
					<input
						type="password"
						id="password"
						name="password"
						autoComplete="new-password"
						minLength={4}
                		maxLength={30}
						className={`${formFieldStyle}`}
						placeholder={t('enter-password')}
					/>
				</div>
				<div>
					<label htmlFor="confirmPassword" className={`${formStyle}`}>
						{t('confirm_password')}
					</label>
					<input
						type="password"
						id="confirmPassword"
						name="confirmPassword"
						autoComplete="new-password"
						minLength={4}
                		maxLength={30}
						className={`${formFieldStyle}`}
						placeholder={t('confirm_password')}
					/>
				</div>
				<div className="flex items-start space-x-3 py-2">
					<input
						type="checkbox"
						id="acceptTerms"
						name="acceptTerms"
						checked={acceptTerms}
						onChange={(e) => setAcceptTerms(e.target.checked)}
						className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5 cursor-pointer"
					/>
					<label htmlFor="acceptTerms" className={`${formStyle}`}>
						<Trans i18nKey="terms_and_privacy">
                            <button 
								type="button"
								className="text-blue-600 dark:text-blue-300 hover:underline"
								onClick={openTerms}
							>
							</button>
							<button 
								type="button"
								className="text-blue-600 dark:text-blue-300 hover:underline"
								onClick={openPrivacy}
							>
							</button>
                        </Trans>
					</label>
				</div>
				<button className="group relative z-0 h-12 overflow-hidden overflow-x-hidden rounded-md bg-linear-to-br from-blue-500 to-indigo-500 px-8 py-2 text-neutral-50 transform hover:scale-[1.10] duration-300"
					type="submit"
					id="register"
					name="register"
					><span className="relative z-10">{t('register')}</span><span className="absolute inset-0 overflow-hidden rounded-md"><span className="absolute left-0 aspect-square w-full origin-center translate-x-full rounded-full bg-blue-600 transition-all duration-300 group-hover:-translate-x-0 group-hover:scale-150"></span></span>
				</button>
			</div>
			<PolicyModal 
				isOpen={modalConfig.isOpen} 
				onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
				title={modalConfig.title}
				htmlContent={modalConfig.htmlContent}
			/>
		</form>
		
	)
}

export default RegisterForm;
