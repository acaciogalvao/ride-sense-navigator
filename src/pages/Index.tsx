
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Menu, RefreshCcw, Locate } from "lucide-react";
import MapComponent from "@/components/MapComponent";
import RideAnalyzer from "@/components/RideAnalyzer";
import SettingsPanel from "@/components/SettingsPanel";
import RideSimulator from "@/components/RideSimulator";

const Index = () => {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [settings, setSettings] = useState({
    goodRideThreshold: 2.5, // R$ por km
    mediumRideThreshold: 1.8, // R$ por km
    minimumTimeValue: 0.5, // R$ por minuto
    autoAnalysis: true
  });

  const [currentRide, setCurrentRide] = useState(null);

  const analyzeRide = (rideData) => {
    const { pricePerKm, estimatedTime, distance, totalValue, app } = rideData;
    
    let status = 'bad';
    let color = 'red';
    let message = 'Corrida não recomendada';

    if (pricePerKm >= settings.goodRideThreshold) {
      status = 'good';
      color = 'green';
      message = 'Ótima corrida!';
    } else if (pricePerKm >= settings.mediumRideThreshold) {
      status = 'medium';
      color = 'yellow';
      message = 'Corrida mediana';
    }

    // Mostrar toast com resultado
    toast({
      title: `${app} - ${message}`,
      description: `R$ ${pricePerKm.toFixed(2)}/km • ${distance.toFixed(1)}km • ${estimatedTime}min • Total: R$ ${totalValue.toFixed(2)}`,
      className: `border-l-4 ${
        color === 'green' ? 'border-l-green-500 bg-green-50' :
        color === 'yellow' ? 'border-l-yellow-500 bg-yellow-50' :
        'border-l-red-500 bg-red-50'
      }`,
    });

    setCurrentRide({ ...rideData, status, color });
  };

  const simulateScreenReading = () => {
    setIsAnalyzing(true);
    
    // Simular apps de transporte
    const apps = ['99', 'Uber', 'Indriver', 'UrbanoNorte', 'ITZ Move'];
    const randomApp = apps[Math.floor(Math.random() * apps.length)];
    
    // Simular dados de corrida
    const distance = Math.random() * 15 + 2; // 2-17km
    const basePrice = Math.random() * 25 + 10; // R$ 10-35
    const estimatedTime = Math.floor(distance * 3 + Math.random() * 10); // tempo estimado
    const pricePerKm = basePrice / distance;
    
    setTimeout(() => {
      const rideData = {
        app: randomApp,
        distance,
        totalValue: basePrice,
        pricePerKm,
        estimatedTime,
        location: 'São Francisco do Sul - SC',
        timestamp: new Date()
      };
      
      analyzeRide(rideData);
      setIsAnalyzing(false);
    }, 2000);
  };

  useEffect(() => {
    // Simular leitura automática a cada 30 segundos se estiver ativo
    if (settings.autoAnalysis) {
      const interval = setInterval(() => {
        if (Math.random() > 0.7) { // 30% de chance de aparecer uma corrida
          simulateScreenReading();
        }
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [settings.autoAnalysis]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 to-purple-600">
      {/* Header */}
      <div className="bg-pink-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-pink-700">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Menu Principal</SheetTitle>
                  <SheetDescription>
                    Configurações e opções do RideSense Navigator
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <SettingsPanel settings={settings} onSettingsChange={setSettings} />
                </div>
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-bold">RideSense Navigator</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-white/20 text-white">
              {settings.autoAnalysis ? 'Auto ON' : 'Auto OFF'}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-pink-700"
              onClick={simulateScreenReading}
              disabled={isAnalyzing}
            >
              <RefreshCcw className={`h-5 w-5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)]">
        {/* Map Section */}
        <div className="flex-1 relative">
          <MapComponent currentRide={currentRide} />
          
          {/* Floating Cards */}
          <div className="absolute top-4 left-4 right-4 z-10 space-y-3">
            {/* Current Analysis Card */}
            {currentRide && (
              <Card className="bg-white/95 backdrop-blur-sm shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-lg">
                    <span>{currentRide.app}</span>
                    <div className={`w-4 h-4 rounded-full ${
                      currentRide.color === 'green' ? 'bg-green-500' :
                      currentRide.color === 'yellow' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`} />
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Valor/km</p>
                      <p className="font-semibold">R$ {currentRide.pricePerKm.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Distância</p>
                      <p className="font-semibold">{currentRide.distance.toFixed(1)} km</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Tempo</p>
                      <p className="font-semibold">{currentRide.estimatedTime} min</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total</p>
                      <p className="font-semibold">R$ {currentRide.totalValue.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Status Card */}
            <Card className="bg-white/95 backdrop-blur-sm shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Status do Sistema</p>
                    <p className="text-xs text-gray-600">
                      {isAnalyzing ? 'Analisando corrida...' : 'Aguardando chamadas'}
                    </p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    isAnalyzing ? 'bg-blue-500 animate-pulse' : 'bg-green-500'
                  }`} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Simulator Panel (Mobile bottom, Desktop right) */}
        <div className="lg:w-80 bg-white border-l">
          <RideSimulator onSimulateRide={analyzeRide} />
        </div>
      </div>
    </div>
  );
};

export default Index;
