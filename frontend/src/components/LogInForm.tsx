import { useState } from 'react'
import { useTranslation, Trans } from 'react-i18next'

const LogInForm = ()=> {

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const LogInAPI = 'http://localhost:3000/api/user/login';

	const { t, i18n } = useTranslation();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setSuccess('');
		setLoading(loading);

		const target = e.target as typeof e.target & {
			username: { value: string };
			//email: { value: string };
			password: { value: string };
		};

		const userName = target.username.value;
		//const email = target.email.value;
		const password = target.password.value;

		if (!userName || !password) {
            setError(t('all_fields_required'));
            setLoading(false);
            return;
        }

		try {
			const response = await fetch(LogInAPI, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					userName,
					//email,
					password,
				}),
			});
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || t('registration_failed'));
			}
			setSuccess(t('registration_success'));
		} catch (err: unknown) {
			setError(t('registration_failed'));
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
				{/*<div>
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
				</div>*/}
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

				<button className="group relative z-0 h-12 overflow-hidden overflow-x-hidden rounded-md bg-neutral-950 px-8 py-2 text-neutral-50"
					type="submit"
					id="register"
					name="register"
					><span className="relative z-10">{t('log_in')}</span><span className="absolute inset-0 overflow-hidden rounded-md"><span className="absolute left-0 aspect-square w-full origin-center translate-x-full rounded-full bg-blue-500 transition-all duration-500 group-hover:-translate-x-0 group-hover:scale-150"></span></span>
				</button>
			</div>
		</form>
	)
}

export default LogInForm;
