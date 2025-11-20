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
		<div className="flex flex-1 h-screen">
			<div className="w-1/2">
				<img src={PongBG} className="w-full h-screen object-cover" alt="Background image with a Pong game"/>
			</div>
			<LangSwitcher />
			<div className="w-1/2 bg-white flex items-center justify-center">
				<div className="text-center w-full max-w-md px-8">
					<h1 className="text-3xl font-bold mb-8">{t('log_in_play')}</h1>
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