
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const RideAnalyzer = ({ rideData, settings }) => {
  if (!rideData) return null;

  const { pricePerKm, distance, totalValue, estimatedTime, app, location } = rideData;
  
  const getAnalysisResult = () => {
    if (pricePerKm >= settings.goodRideThreshold) {
      return {
        status: 'good',
        color: 'green',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-800',
        message: 'Corrida Excelente!',
        recommendation: 'Recomendamos aceitar esta corrida.'
      };
    } else if (pricePerKm >= settings.mediumRideThreshold) {
      return {
        status: 'medium',
        color: 'yellow',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        textColor: 'text-yellow-800',
        message: 'Corrida Razoável',
        recommendation: 'Considere outros fatores antes de aceitar.'
      };
    } else {
      return {
        status: 'bad',
        color: 'red',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-800',
        message: 'Corrida Não Recomendada',
        recommendation: 'Valor por km abaixo do ideal.'
      };
    }
  };

  const analysis = getAnalysisResult();
  const timeValue = totalValue / estimatedTime;
  const efficiency = (pricePerKm / settings.goodRideThreshold) * 100;

  return (
    <Card className={`${analysis.bgColor} ${analysis.borderColor} border-2`}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-lg">{app}</h3>
            <p className="text-sm text-gray-600">{location}</p>
          </div>
          <div className={`w-6 h-6 rounded-full bg-${analysis.color}-500 flex items-center justify-center`}>
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
        </div>

        {/* Status */}
        <div className="mb-4">
          <Badge className={`${analysis.bgColor} ${analysis.textColor} border-${analysis.color}-300`}>
            {analysis.message}
          </Badge>
          <p className="text-sm mt-1 text-gray-700">{analysis.recommendation}</p>
        </div>

        {/* Métricas principais */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-white rounded-lg border">
            <p className="text-2xl font-bold text-gray-900">R$ {pricePerKm.toFixed(2)}</p>
            <p className="text-sm text-gray-600">por km</p>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border">
            <p className="text-2xl font-bold text-gray-900">R$ {totalValue.toFixed(2)}</p>
            <p className="text-sm text-gray-600">total</p>
          </div>
        </div>

        {/* Métricas secundárias */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
          <div className="text-center">
            <p className="font-semibold">{distance.toFixed(1)} km</p>
            <p className="text-gray-600">Distância</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">{estimatedTime} min</p>
            <p className="text-gray-600">Tempo</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">R$ {timeValue.toFixed(2)}</p>
            <p className="text-gray-600">por min</p>
          </div>
        </div>

        {/* Barra de eficiência */}
        <div className="mb-2">
          <div className="flex justify-between text-sm mb-1">
            <span>Eficiência</span>
            <span>{Math.min(efficiency, 100).toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full bg-${analysis.color}-500 transition-all duration-500`}
              style={{ width: `${Math.min(efficiency, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Timestamp */}
        <div className="text-xs text-gray-500 text-center">
          Analisado em {new Date().toLocaleTimeString('pt-BR')}
        </div>
      </CardContent>
    </Card>
  );
};

export default RideAnalyzer;
