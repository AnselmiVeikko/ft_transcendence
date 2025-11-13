import { StrictMode } from 'react'
import { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'

import App from './App.tsx'
import './i18n.ts';
import Landing from './components/Landing.tsx'
import SignIn from './components/SignIn.tsx'

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{ path: "/", element: <Landing /> },
			{ path: "/signin", element: <SignIn /> },
		],
	},
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    	<RouterProvider router={router} />
  </StrictMode>,
);
