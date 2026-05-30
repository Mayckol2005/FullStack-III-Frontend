import React from 'react';

const Loader = () => {
  return (
    <div className="flex flex-col justify-center items-center p-8 w-full min-h-[200px]" data-testid="loader-container">
      <div 
        className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin"
        data-testid="loader-spinner"
      />
      <p className="mt-4 text-sm font-medium text-gray-500 animate-pulse">
        Cargando información...
      </p>
    </div>
  );
};

export default Loader;