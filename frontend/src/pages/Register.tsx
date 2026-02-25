import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import RegisterForm from '../components/RegisterForm.tsx'
import PongBG from '../../public/PongBG.png'

const Register = ()=> {

	const { t } = useTranslation();

	return (
		<div className="flex flex-col lg:flex-row min-h-screen">
			<div className="hidden lg:block lg:w-1/2 relative">
				<img src={PongBG} className="w-full h-screen object-cover" alt="Background image with a Pong game"/>
			</div>
				<div className="flex-1 lg:w-1/2 bg-glow2 animate-[blob-drift2_20s_ease-in-out_infinite] flex items-center justify-center p-4 sm:p-6 lg:p-8">
				<div className="text-center w-full max-w-md">
					<h1 className="dark:text-white text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 lg:mb-8">
						{t('create_account_message')}</h1>
					<h3 className="dark:text-white text-sm sm:text-base lg:text-lg mb-6 sm:mb-8">
						{t('already_registered')}{' '}
						<Link to="/" className="text-blue-600 dark:text-blue-300 underline hover:text-blue-800">
						{t('log_in')}</Link>
					</h3>
					<RegisterForm />
				</div>
			</div>
		</div>
	)
}

export default Register;