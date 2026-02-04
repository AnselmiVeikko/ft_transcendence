import React from "react";
import { Outlet } from "react-router-dom";
import { UserProvider, useUser } from "../src/context/UserContext";


const App: React.FC = () => {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
};

const AppContent: React.FC = () => {
  const { loading } = useUser();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  //if (!userName) return <Navigate to="/" replace />;

  return (
    <div className="app-container min-h-screen flex flex-col">
      <main className="grow">
        <Outlet />
      </main>
    </div>
  );
};
export default App;