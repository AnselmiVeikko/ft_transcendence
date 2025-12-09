import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = () =>
{
  const auth = { token: true }; //TODO: replace with authentication logic
  return auth.token ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;
