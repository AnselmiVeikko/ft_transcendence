import { useState } from 'react'
import { useTranslation, Trans } from 'react-i18next'

const RegisterForm = ()=> {

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const RegisterAPI = 'http://localhost:3000/user/registration';

	// 't' is for translation, 'i18n' is the instance for control
	const { t, i18n } = useTranslation();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setSuccess('');
		setLoading(loading);

		const target = e.target as typeof e.target & {
			username: { value: string };
			email: { value: string };
			password: { value: string };
			confirmPassword: { value: string };
		};

		const username = target.username.value;
		const email = target.email.value;
		const password = target.password.value;
		const confirmPassword = target.confirmPassword.value;

		if (password !== confirmPassword) {
            setError(t('password_mismatch')); // You need this translation key
            setLoading(false);
            return; // Stop the function if they don't match
        }
		if (!username || !email || !password || !confirmPassword) {
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
					username,
					email,
					password,
				}),
			});
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || t('registration_failed'));
			}
			setSuccess(t('registration_success'));
		} catch (err: unknown) {
			//const message = err instanceof Error ? err.message : String(err);
			setError(/* message ||  */t('registration_failed'));
		} finally {
			setLoading(false);
		}
	}

	return (
		<form onSubmit={handleSubmit}>
				{error && (
				<div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
					{error}
				</div>
			)}
			{success && (
				<div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
					{success}
				</div>
			)}
			<div className="space-y-4">
				<div>
					<label htmlFor="username" className="block text-left text-sm font-medium mb-2">
						{t('username')}
					</label>
					<input
						type="text"
						id="username"
						name="username"
						autoComplete="username"
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder={t('enter-username')}
						/>
				</div>
				<div>
					<label htmlFor="email" className="block text-left text-sm font-medium mb-2">
						{t('email')}
					</label>
					<input
						type="email"
						id="email"
						name="email"
						autoComplete="email"
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder={t('enter-email')}
					/>
				</div>
				<div>
					<label htmlFor="password" className="block text-left text-sm font-medium mb-2">
						{t('password')}
					</label>
					<input
						type="password"
						id="password"
						name="password"
						autoComplete="new-password"
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder={t('enter-password')}
					/>
				</div>
				<div>
					<label htmlFor="confirmPassword" className="block text-left text-sm font-medium mb-2">
						{t('confirm_password')}
					</label>
					<input
						type="password"
						id="confirmPassword"
						name="confirmPassword"
						autoComplete="new-password"
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder={t('confirm_password')}
					/>
				</div>
				<button className="group relative z-0 h-12 overflow-hidden overflow-x-hidden rounded-md bg-neutral-950 px-8 py-2 text-neutral-50"
					type="submit"
					id="register"
					name="register"
					><span className="relative z-10">{t('register')}</span><span className="absolute inset-0 overflow-hidden rounded-md"><span className="absolute left-0 aspect-square w-full origin-center translate-x-full rounded-full bg-blue-500 transition-all duration-500 group-hover:-translate-x-0 group-hover:scale-150"></span></span>
				</button>
			</div>
		</form>
	)
}

export default RegisterForm;
