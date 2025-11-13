import { useState } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { Link } from 'react-router-dom'
import LangSwitcher from './LangSwitcher.tsx'
import RegisterForm from './RegisterForm.tsx'
import PongBG from '../../public/PongBG.png'

const SignIn = ()=> {
	const [username, setUsername] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	//const [loading, setLoading] = useState(false)

	// 't' is for translation, 'i18n' is the instance for control
	const { t, i18n } = useTranslation();

	return (
		<div className="flex flex-1 h-screen">
			<div className="w-1/2">
				<img src={PongBG} className="w-full h-screen object-cover" alt="Background image with a Pong game"/>
			</div>
			<LangSwitcher />
			<div className="w-1/2 bg-white flex items-center justify-center">
				<div className="text-center w-full max-w-md px-8">
					<h1 className="text-3xl font-bold mb-8">{t('landing_welcome_message')}</h1>
					<h2 className="text-2xl mb-8">{t('create_account_message')}</h2>
					<RegisterForm />
				</div>
			</div>
		</div>
	)
}

export default SignIn;