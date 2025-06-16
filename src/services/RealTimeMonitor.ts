
export interface RideData {
  app: string;
  distance: number;
  totalValue: number;
  pricePerKm: number;
  estimatedTime: number;
  location: string;
  timestamp: Date;
  detected: boolean;
}

export interface MonitoringSettings {
  enabledApps: string[];
  scanInterval: number;
  autoAnalysis: boolean;
  vibrationEnabled: boolean;
  soundEnabled: boolean;
}

class RealTimeMonitor {
  private isMonitoring: boolean = false;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private callbacks: {
    onRideDetected?: (ride: RideData) => void;
    onAppStateChange?: (app: string, isActive: boolean) => void;
    onPermissionRequired?: (permission: string) => void;
  } = {};

  private monitoredApps = [
    { name: '99', packageName: 'com.taxis99', isActive: false },
    { name: 'Uber', packageName: 'com.ubercab', isActive: false },
    { name: 'Indriver', packageName: 'sinet.startup.inDriver', isActive: false },
    { name: 'UrbanoNorte', packageName: 'com.urbanonorte.app', isActive: false },
    { name: 'ITZ Move', packageName: 'com.itzmove.app', isActive: false }
  ];

  constructor() {
    this.initializeMonitoring();
  }

  private initializeMonitoring() {
    console.log('RealTimeMonitor: Inicializando monitoramento...');
    
    // Verificar se as permissões estão concedidas
    this.checkPermissions();
  }

  private checkPermissions(): boolean {
    // Simular verificação de permissões
    const requiredPermissions = [
      'accessibility',
      'screenOverlay',
      'notifications'
    ];

    const hasAllPermissions = requiredPermissions.every(permission => {
      // Em um app real, verificaria as permissões do sistema
      return this.checkSystemPermission(permission);
    });

    if (!hasAllPermissions) {
      this.callbacks.onPermissionRequired?.('accessibility');
      return false;
    }

    return true;
  }

  private checkSystemPermission(permission: string): boolean {
    // Simular verificação de permissão do sistema
    // Em um app real, usaria APIs específicas do Android/iOS
    console.log(`Verificando permissão: ${permission}`);
    return Math.random() > 0.3; // 70% de chance de ter permissão
  }

  public startMonitoring(settings: MonitoringSettings) {
    if (!this.checkPermissions()) {
      console.log('RealTimeMonitor: Permissões insuficientes');
      return false;
    }

    if (this.isMonitoring) {
      console.log('RealTimeMonitor: Monitoramento já está ativo');
      return true;
    }

    this.isMonitoring = true;
    console.log('RealTimeMonitor: Iniciando monitoramento em tempo real...');

    // Iniciar monitoramento dos apps
    this.monitoringInterval = setInterval(() => {
      this.scanForRides(settings);
    }, settings.scanInterval || 2000);

    return true;
  }

  public stopMonitoring() {
    if (!this.isMonitoring) return;

    this.isMonitoring = false;
    
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }

    console.log('RealTimeMonitor: Monitoramento interrompido');
  }

  private async scanForRides(settings: MonitoringSettings) {
    if (!this.isMonitoring) return;

    // Simular escaneamento dos apps ativos
    for (const app of this.monitoredApps) {
      if (!settings.enabledApps.includes(app.name)) continue;

      const isCurrentlyActive = await this.isAppActive(app.packageName);
      
      if (isCurrentlyActive !== app.isActive) {
        app.isActive = isCurrentlyActive;
        this.callbacks.onAppStateChange?.(app.name, isCurrentlyActive);
      }

      if (isCurrentlyActive) {
        const rideData = await this.extractRideData(app.name, app.packageName);
        if (rideData) {
          console.log(`RealTimeMonitor: Corrida detectada no ${app.name}`, rideData);
          this.callbacks.onRideDetected?.(rideData);
          
          // Trigger vibration/sound if enabled
          if (settings.vibrationEnabled) {
            this.triggerVibration();
          }
          if (settings.soundEnabled) {
            this.playNotificationSound();
          }
        }
      }
    }
  }

  private async isAppActive(packageName: string): Promise<boolean> {
    // Simular verificação se o app está ativo/visível
    // Em um app real, usaria AccessibilityService ou outros métodos
    return Math.random() > 0.8; // 20% de chance de estar ativo
  }

  private async extractRideData(appName: string, packageName: string): Promise<RideData | null> {
    // Simular extração de dados da tela do app
    // Em um app real, usaria AccessibilityService para ler elementos da UI
    
    const hasRideOffer = Math.random() > 0.7; // 30% de chance de ter oferta
    
    if (!hasRideOffer) return null;

    // Simular dados extraídos da tela
    const distance = Math.random() * 15 + 2; // 2-17km
    const totalValue = Math.random() * 25 + 10; // R$ 10-35
    const estimatedTime = Math.floor(distance * 3 + Math.random() * 10);
    const pricePerKm = totalValue / distance;

    return {
      app: appName,
      distance,
      totalValue,
      pricePerKm,
      estimatedTime,
      location: 'São Francisco do Sul - SC',
      timestamp: new Date(),
      detected: true
    };
  }

  private triggerVibration() {
    // Simular vibração
    console.log('RealTimeMonitor: Vibrando dispositivo...');
    
    // Em um app real, usaria:
    // if ('vibrate' in navigator) {
    //   navigator.vibrate([100, 50, 100]);
    // }
  }

  private playNotificationSound() {
    // Simular som de notificação
    console.log('RealTimeMonitor: Reproduzindo som de notificação...');
    
    // Em um app real, reproduziria um arquivo de áudio
  }

  public setCallbacks(callbacks: {
    onRideDetected?: (ride: RideData) => void;
    onAppStateChange?: (app: string, isActive: boolean) => void;
    onPermissionRequired?: (permission: string) => void;
  }) {
    this.callbacks = callbacks;
  }

  public getMonitoringStatus() {
    return {
      isActive: this.isMonitoring,
      activeApps: this.monitoredApps.filter(app => app.isActive).map(app => app.name),
      totalApps: this.monitoredApps.length
    };
  }
}

export const realTimeMonitor = new RealTimeMonitor();
