import React from 'react'
import { Outlet } from 'react-router-dom';

const App: React.FC = () => {
  return (
	<div className="app-container">
		<Outlet />
	</div>
  );
};

export default App;
