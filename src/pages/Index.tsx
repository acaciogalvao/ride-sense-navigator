import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Menu, RefreshCcw, Locate, Shield, Eye } from "lucide-react";
import MapComponent from "@/components/MapComponent";
import RideAnalyzer from "@/components/RideAnalyzer";
import SettingsPanel from "@/components/SettingsPanel";
import RideSimulator from "@/components/RideSimulator";
import AccessibilityPermissions from "@/components/AccessibilityPermissions";
import { realTimeMonitor, RideData } from "@/services/RealTimeMonitor";

const Index = () => {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [activeTab, setActiveTab] = useState('main');
  const [settings, setSettings] = useState({
    goodRideThreshold: 2.5,
    mediumRideThreshold: 1.8,
    minimumTimeValue: 0.5,
    autoAnalysis: true
  });

  const [monitoringSettings, setMonitoringSettings] = useState({
    enabledApps: ['99', 'Uber', 'Indriver', 'UrbanoNorte', 'ITZ Move'],
    scanInterval: 2000,
    autoAnalysis: true,
    vibrationEnabled: true,
    soundEnabled: false
  });

  const [currentRide, setCurrentRide] = useState(null);
  const [monitoringStatus, setMonitoringStatus] = useState({
    isActive: false,
    activeApps: [],
    totalApps: 5
  });

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

  const handleStartMonitoring = () => {
    const success = realTimeMonitor.startMonitoring(monitoringSettings);
    if (success) {
      setIsMonitoring(true);
      toast({
        title: "Monitoramento Iniciado",
        description: "Sistema está monitorando apps em tempo real",
        className: "border-l-4 border-l-green-500 bg-green-50",
      });
    } else {
      toast({
        title: "Erro ao Iniciar",
        description: "Verifique as permissões necessárias",
        className: "border-l-4 border-l-red-500 bg-red-50",
      });
    }
  };

  const handleStopMonitoring = () => {
    realTimeMonitor.stopMonitoring();
    setIsMonitoring(false);
    toast({
      title: "Monitoramento Parado",
      description: "Sistema não está mais monitorando",
      className: "border-l-4 border-l-yellow-500 bg-yellow-50",
    });
  };

  const simulateScreenReading = () => {
    setIsAnalyzing(true);
    
    const apps = ['99', 'Uber', 'Indriver', 'UrbanoNorte', 'ITZ Move'];
    const randomApp = apps[Math.floor(Math.random() * apps.length)];
    
    const distance = Math.random() * 15 + 2;
    const basePrice = Math.random() * 25 + 10;
    const estimatedTime = Math.floor(distance * 3 + Math.random() * 10);
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
    // Configurar callbacks do monitor
    realTimeMonitor.setCallbacks({
      onRideDetected: (ride: RideData) => {
        console.log('Corrida detectada automaticamente:', ride);
        analyzeRide(ride);
      },
      onAppStateChange: (appName: string, isActive: boolean) => {
        console.log(`App ${appName} ${isActive ? 'ativado' : 'desativado'}`);
      },
      onPermissionRequired: (permission: string) => {
        toast({
          title: "Permissão Necessária",
          description: `Configure a permissão: ${permission}`,
          className: "border-l-4 border-l-orange-500 bg-orange-50",
        });
      }
    });

    // Atualizar status periodicamente
    const statusInterval = setInterval(() => {
      const status = realTimeMonitor.getMonitoringStatus();
      setMonitoringStatus(status);
    }, 1000);

    return () => {
      clearInterval(statusInterval);
      realTimeMonitor.stopMonitoring();
    };
  }, []);

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
                
                {/* Menu Tabs */}
                <div className="flex gap-2 mt-4 mb-6">
                  <Button
                    variant={activeTab === 'main' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveTab('main')}
                  >
                    Configurações
                  </Button>
                  <Button
                    variant={activeTab === 'permissions' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveTab('permissions')}
                  >
                    <Shield className="h-4 w-4 mr-1" />
                    Permissões
                  </Button>
                </div>

                <div className="mt-6">
                  {activeTab === 'main' && (
                    <SettingsPanel settings={settings} onSettingsChange={setSettings} />
                  )}
                  {activeTab === 'permissions' && (
                    <AccessibilityPermissions onPermissionChange={(type, granted) => {
                      console.log(`Permissão ${type}: ${granted ? 'concedida' : 'negada'}`);
                    }} />
                  )}
                </div>
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-bold">RideSense Navigator</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-white/20 text-white">
              {isMonitoring ? 'Monitorando' : 'Parado'}
            </Badge>
            <Badge variant="secondary" className="bg-white/10 text-white text-xs">
              {monitoringStatus.activeApps.length}/{monitoringStatus.totalApps}
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
            {/* Monitoring Control Card */}
            <Card className="bg-white/95 backdrop-blur-sm shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Monitoramento em Tempo Real</p>
                    <p className="text-xs text-gray-600">
                      {isMonitoring 
                        ? `${monitoringStatus.activeApps.length} apps ativos`
                        : 'Sistema parado'
                      }
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                    }`} />
                    <Button
                      size="sm"
                      variant={isMonitoring ? "destructive" : "default"}
                      onClick={isMonitoring ? handleStopMonitoring : handleStartMonitoring}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      {isMonitoring ? 'Parar' : 'Iniciar'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

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
                      {isAnalyzing ? 'Analisando corrida...' : 
                       isMonitoring ? 'Monitorando em tempo real' : 'Aguardando ativação'}
                    </p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    isAnalyzing ? 'bg-blue-500 animate-pulse' :
                    isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
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
