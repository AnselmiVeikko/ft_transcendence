import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import "./i18n.ts";
import LogIn from "./components/LogIn.tsx";
import Menu from "./components/Menu.tsx";
import Register from "./components/Register.tsx";
import ProtectedRoutes from "./utils/ProtectedRoutes.tsx";
import PageNotFound from "./components/PageNotFound.tsx";
import FriendsList from "./components/FriendsList.tsx";
import SingleMatch from './components/SingleMatch.tsx';
import AIMatch from './components/AIMatch.tsx';
import Profile from "./components/Profile.tsx"

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
