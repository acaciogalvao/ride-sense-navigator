
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCcw } from "lucide-react";

const RideSimulator = ({ onSimulateRide }) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [lastRides, setLastRides] = useState([]);

  const apps = [
    { name: '99', color: 'bg-yellow-500' },
    { name: 'Uber', color: 'bg-black' },
    { name: 'Indriver', color: 'bg-blue-500' },
    { name: 'UrbanoNorte', color: 'bg-green-600' },
    { name: 'ITZ Move', color: 'bg-purple-600' }
  ];

  const locations = [
    'Centro - São Francisco do Sul',
    'Praia de Ubatuba - São Francisco do Sul',
    'Vila da Glória - São Francisco do Sul',
    'Balneário Barra do Sul',
    'Joinville - Centro',
    'Araquari - Centro'
  ];

  const simulateRide = (specificApp = null) => {
    setIsSimulating(true);
    
    const selectedApp = specificApp || apps[Math.floor(Math.random() * apps.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    
    // Simular diferentes cenários
    const scenarios = [
      { distance: 2.5, basePrice: 12, multiplier: 1 }, // Corrida curta cara
      { distance: 8.2, basePrice: 25, multiplier: 1 }, // Corrida média equilibrada
      { distance: 15.6, basePrice: 28, multiplier: 1 }, // Corrida longa barata
      { distance: 4.1, basePrice: 18, multiplier: 1.5 }, // Corrida com tarifa dinâmica
      { distance: 6.7, basePrice: 35, multiplier: 1.8 }, // Corrida muito cara (pico)
    ];
    
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    const finalPrice = scenario.basePrice * scenario.multiplier;
    const estimatedTime = Math.floor(scenario.distance * 2.5 + Math.random() * 15 + 5);
    const pricePerKm = finalPrice / scenario.distance;
    
    setTimeout(() => {
      const rideData = {
        app: selectedApp.name,
        distance: scenario.distance,
        totalValue: finalPrice,
        pricePerKm,
        estimatedTime,
        location,
        timestamp: new Date(),
        multiplier: scenario.multiplier
      };
      
      setLastRides(prev => [rideData, ...prev.slice(0, 4)]);
      onSimulateRide(rideData);
      setIsSimulating(false);
    }, 1500);
  };

  const getStatusColor = (pricePerKm) => {
    if (pricePerKm >= 2.5) return 'bg-green-500';
    if (pricePerKm >= 1.8) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900">Simulador de Corridas</h2>
        <p className="text-sm text-gray-600">Teste a análise com dados simulados</p>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {/* Botão de simulação geral */}
        <Card>
          <CardContent className="p-4">
            <Button
              onClick={() => simulateRide()}
              disabled={isSimulating}
              className="w-full bg-pink-600 hover:bg-pink-700"
            >
              {isSimulating ? (
                <>
                  <RefreshCcw className="w-4 h-4 mr-2 animate-spin" />
                  Simulando...
                </>
              ) : (
                'Simular Corrida Aleatória'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Botões por app */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Simular por App</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {apps.map((app, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => simulateRide(app)}
                disabled={isSimulating}
                className="w-full justify-start"
              >
                <div className={`w-3 h-3 rounded-full ${app.color} mr-2`}></div>
                {app.name}
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Histórico de corridas simuladas */}
        {lastRides.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Últimas Simulações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {lastRides.map((ride, index) => (
                <div key={index} className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{ride.app}</span>
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(ride.pricePerKm)}`}></div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div>
                      <span className="block">Valor/km:</span>
                      <span className="font-medium text-gray-900">R$ {ride.pricePerKm.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="block">Total:</span>
                      <span className="font-medium text-gray-900">R$ {ride.totalValue.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="block">Distância:</span>
                      <span className="font-medium text-gray-900">{ride.distance.toFixed(1)} km</span>
                    </div>
                    <div>
                      <span className="block">Tempo:</span>
                      <span className="font-medium text-gray-900">{ride.estimatedTime} min</span>
                    </div>
                  </div>
                  
                  {ride.multiplier > 1 && (
                    <Badge variant="secondary" className="mt-2 text-xs">
                      Tarifa Dinâmica {ride.multiplier}x
                    </Badge>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-1">{ride.location}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Informações sobre a simulação */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h3 className="font-medium text-sm text-blue-900 mb-2">Como funciona</h3>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Simula leitura automática de tela dos apps</li>
              <li>• Calcula rentabilidade baseada em R$/km</li>
              <li>• Exibe resultado com sistema de semáforo</li>
              <li>• Considera tarifa dinâmica e localização</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RideSimulator;
