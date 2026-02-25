import { Navigate, Outlet } from "react-router-dom";
import { useUser } from '../context/UserContext';
import Header from "../components/Header";
import Footer from "../components/Footer";
import SettingsMenu from "../components/SettingsMenu";

const ProtectedRoutes = () => {
  const { userName, loading } = useUser();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (!userName) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Header />
      <Outlet />
	  <div className="flex mt-12">
        <Footer />
	    <SettingsMenu />
	  </div>
    </>
  );
};

export default ProtectedRoutes;
