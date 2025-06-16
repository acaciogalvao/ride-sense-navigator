
import React, { useEffect, useRef } from 'react';

const MapComponent = ({ currentRide }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Simular um mapa interativo
    if (mapRef.current) {
      // Aqui você integraria com Mapbox ou Google Maps
      // Por enquanto, vamos simular com uma visualização
    }
  }, []);

  return (
    <div className="w-full h-full relative bg-gray-200">
      {/* Mapa simulado */}
      <div 
        ref={mapRef}
        className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 relative overflow-hidden"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      >
        {/* Ruas simuladas */}
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-0 right-0 h-1 bg-white/30"></div>
          <div className="absolute top-2/3 left-0 right-0 h-1 bg-white/30"></div>
          <div className="absolute left-1/3 top-0 bottom-0 w-1 bg-white/30"></div>
          <div className="absolute left-2/3 top-0 bottom-0 w-1 bg-white/30"></div>
        </div>

        {/* Pin de localização atual */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-6 h-6 bg-pink-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-black/75 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            São Francisco do Sul
          </div>
        </div>

        {/* Rota simulada se houver corrida ativa */}
        {currentRide && (
          <>
            <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-green-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
            <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
            
            {/* Linha da rota */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <path
                d="M 25% 50% Q 50% 30% 75% 33%"
                stroke="#ec4899"
                strokeWidth="3"
                fill="none"
                strokeDasharray="5,5"
                className="animate-pulse"
              />
            </svg>
          </>
        )}

        {/* Apps sendo monitorados */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <p className="text-xs font-medium text-gray-700 mb-2">Apps Monitorados:</p>
          <div className="flex flex-wrap gap-1">
            {['99', 'Uber', 'Indriver', 'UrbanoNorte', 'ITZ'].map((app) => (
              <span key={app} className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                {app}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
