import React from 'react';

const EmptyState = ({ mensaje = 'No se encontraron registros en el sistema.' }) => {
  return (
    <div className="flex flex-col justify-center items-center p-12 text-center bg-white rounded-lg border border-dashed border-gray-300 min-h-[250px]">
      <svg
        className="w-12 h-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
        data-testid="empty-icon"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-3.586a1 1 0 00-.707.293l-1.414 1.414a1 1 0 01-.707.293H10.414a1 1 0 01-.707-.293L8.293 13.293A1 1 0 007.586 13H4"
        />
      </svg>
      <h3 className="mt-4 text-sm font-semibold text-gray-900">Sin datos</h3>
      <p className="mt-1 text-sm text-gray-500" data-testid="empty-message">
        {mensaje}
      </p>
    </div>
  );
};

export default EmptyState;