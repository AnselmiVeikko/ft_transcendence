import { useState } from 'react'
import PongBG from '../../public/PongBG.png'

const Landing = ()=> {
	const [username, setUsername] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	//const [loading, setLoading] = useState(false)

	return (
		<div className="flex flex-1 h-screen">
			<div className="w-1/2">
				<img 
					src={PongBG} 
					className="w-full h-screen object-cover" 
					alt="Background image with a Pong game" 
				/>
			</div>
			<div className="w-1/2 bg-white flex items-center justify-center">
				<div className="text-center w-full max-w-md px-8">
					<h1 className="text-3xl font-bold mb-8">Welcome to Pong!</h1>
					<h2 className="text-2xl mb-8">Create an account to play</h2>
					
					<form
  						onSubmit={(e: React.SyntheticEvent) => {
    						e.preventDefault();
							console.log(e.target);
    						const target = e.target as typeof e.target & {
								username: { value: string };
      							email: { value: string };
      							password: { value: string };
    						};
							const username = target.username.value;
    						const email = target.email.value;
    						const password = target.password.value;
							console.log(username);
							console.log(email);
							console.log(password);
						}}
					>
						<div className="space-y-4">
							<div>
								<label htmlFor="username" className="block text-left text-sm font-medium mb-2">
									Username
								</label>
								<input
									type="text"
									name="username"
									autoComplete="username"
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
									placeholder="Enter your username"
								/>
							</div>
							<div>
								<label htmlFor="email" className="block text-left text-sm font-medium mb-2">
									Email
								</label>
								<input
									type="email"
									name="email"
									autoComplete="email"
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
									placeholder="Enter your email"
								/>
							</div>
							
							<div>
								<label htmlFor="password" className="block text-left text-sm font-medium mb-2">
									Password
								</label>
								<input
									type="password"
									name="password"
									autoComplete="new-password"
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
									placeholder="Enter your password"
								/>
							</div>
							
							<button
								type="submit"
								name="register"
								className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors mt-6">
								Get Started
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}

export default Landing;