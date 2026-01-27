import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import Header from "../components/Header";

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
    </>
  );
};


export default ProtectedRoutes;
