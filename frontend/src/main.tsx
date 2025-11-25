import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import './i18n.ts';
import LogIn from './components/LogIn.tsx'
import Menu from './components/Menu.tsx'
import Register from './components/Register.tsx'
import ProtectedRoutes from './utils/ProtectedRoutes.tsx';

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{ path: "/", element: <LogIn /> },
			{ path: "/register", element: <Register /> },

			// Protected routes (for logged-in users only)
			{
				element: <ProtectedRoutes />,
				children: [
					{ path: "/menu", element: <Menu /> },
				],
			},
		],
	},
]);

createRoot(document.getElementById('root')!).render(
	<StrictMode>
			<RouterProvider router={router} />
	</StrictMode>,
);
