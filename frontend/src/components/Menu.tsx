import React from 'react';

const Menu = () => {
  const handleButtonClick = (buttonName: string) => {
    console.log(`${buttonName} clicked`);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-6">
        <button
          onClick={() => handleButtonClick('Start')}
          className="px-8 py-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200 shadow-md hover:shadow-lg min-w-[200px]"
        >
          Start
        </button>
        
        <button
          onClick={() => handleButtonClick('Tournament')}
          className="px-8 py-4 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors duration-200 shadow-md hover:shadow-lg min-w-[200px]"
        >
          Tournament
        </button>
        
        <button
          onClick={() => handleButtonClick('Stats')}
          className="px-8 py-4 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors duration-200 shadow-md hover:shadow-lg min-w-[200px]"
        >
          Stats
        </button>
      </div>
    </div>
  );
};

export default Menu;