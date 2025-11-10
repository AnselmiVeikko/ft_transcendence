/* import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css' */

import React from 'react';

const App: React.FC = () => {
  const handleButtonClick = (buttonName: string) => {
    console.log(`${buttonName} clicked`);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-6">
        <button
          onClick={() => handleButtonClick('Button 1')}
          className="px-8 py-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200 shadow-md hover:shadow-lg min-w-[200px]"
        >
          Button 1
        </button>
        
        <button
          onClick={() => handleButtonClick('Button 2')}
          className="px-8 py-4 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors duration-200 shadow-md hover:shadow-lg min-w-[200px]"
        >
          Button 2
        </button>
        
        <button
          onClick={() => handleButtonClick('Button 3')}
          className="px-8 py-4 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors duration-200 shadow-md hover:shadow-lg min-w-[200px]"
        >
          Button 3
        </button>
      </div>
    </div>
  );
};

export default App;

/* function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
 */