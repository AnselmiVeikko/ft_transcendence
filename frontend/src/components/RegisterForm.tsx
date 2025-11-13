import { useState } from 'react'
import { useTranslation, Trans } from 'react-i18next'

const RegisterForm = ()=> {

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const RegisterURL = 'http://localhost:3000/api/register';

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
		};
		
		const username = target.username.value;
		const email = target.email.value;
		const password = target.password.value;

		try {
			const response = await fetch(RegisterURL, {
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

				<button
					type="submit"
					id="register"
					name="register"
					className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors mt-6">
					{t('register')}
				</button>
			</div>
		</form>
	)
}

export default RegisterForm;