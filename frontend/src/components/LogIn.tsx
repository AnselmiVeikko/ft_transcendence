import { useState } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { Link } from 'react-router-dom'
import LangSwitcher from './LangSwitcher.tsx'
import LogInForm from './LogInForm.tsx'
import PongBG from '../../public/PongBG.png'

const LogIn = ()=> {
	const [username, setUsername] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	//const [loading, setLoading] = useState(false)

	const { t, i18n } = useTranslation();

	return (
		<div className="flex flex-col lg:flex-row min-h-screen">
			<div className="hidden lg:block lg:w-1/2 relative">
				<img src={PongBG} className="w-full h-screen object-cover" alt="Background image with a Pong game"/>
			</div>
			<LangSwitcher />
			<div className="flex-1 lg:w-1/2 bg-white flex items-center justify-center p-4 sm:p-6 lg:p-8">
				<div className="text-center w-full max-w-md">
					<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 lg:mb-8">{t('log_in_play')}</h1>
					<h3 className="text-sm sm:text-base lg:text-lg mb-6 sm:mb-8">
						{t('not_registered_yet')}{' '}
						<Link to="/" className="text-blue-600 underline hover:text-blue-800">
						{t('register_here')}</Link>
					</h3>
					<LogInForm />
				</div>
			</div>
		</div>
	)
}

export default LogIn;