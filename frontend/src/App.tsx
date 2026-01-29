import React from "react";
import { Outlet, useLocation } from "react-router-dom";

const App: React.FC = () => {
  

  return (
    <div className="app-container">
	  <main className="flex-grow">
		<Outlet />
	  </main>
    </div>
  );
};

export default App;
