import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import "./i18n.ts";
import LogIn from "./pages/LogIn.tsx";
import Menu from "./pages/Menu.tsx";
import Register from "./pages/Register.tsx";
import ProtectedRoutes from "./utils/ProtectedRoutes.tsx";
import PageNotFound from "./pages/PageNotFound.tsx";
import FriendsList from "./pages/FriendsList.tsx";
import SingleMatch from './pages/SingleMatch.tsx';
import AIMatch from './pages/AIMatch.tsx';
import Profile from "./pages/Profile.tsx"

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
          { path: "/friends", element: <FriendsList /> },
          { path: "/singlematch", element: <SingleMatch />},
          { path: "/aimatch", element: <AIMatch />},
		  { path: "/profile", element: <Profile />},
        ],
      },

      { path: "*", element: <PageNotFound /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
