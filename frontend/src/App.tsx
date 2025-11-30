import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header";

const App: React.FC = () => {
  const location = useLocation();

  const noHeaderRoutes = ["/", "/register"];
  const showHeader = !noHeaderRoutes.includes(location.pathname);

  return (
    <div className="app-container">
      {showHeader && <Header />}
      <Outlet />
    </div>
  );
};

export default App;
