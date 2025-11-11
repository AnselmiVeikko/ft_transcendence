import PongBG from '../../public/PongBG.png'

const Landing = ()=> {
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
					<h1 className="text-3xl font-bold mb-8">Welcome back!</h1>
					<h2 className="text-2xl mb-8">Login to play Pong</h2>
					
					<div className="space-y-4">
						<div>
							<label htmlFor="username" className="block text-left text-sm font-medium mb-2">
								Username
							</label>
							<input
								type="text"
								id="username"
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Enter your username"
							/>
						</div>
						
						<div>
							<label htmlFor="password" className="block text-left text-sm font-medium mb-2">
								Password
							</label>
							<input
								type="password"
								id="password"
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Enter your password"
							/>
						</div>
						
						<button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors mt-6">
							Login
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Landing;