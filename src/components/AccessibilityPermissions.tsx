
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Shield, Eye, Smartphone, Settings, AlertTriangle } from "lucide-react";

const AccessibilityPermissions = ({ onPermissionChange }) => {
  const { toast } = useToast();
  const [permissions, setPermissions] = useState({
    accessibility: false,
    screenOverlay: false,
    deviceAdmin: false,
    notifications: false
  });

  const [monitoredApps] = useState([
    { name: '99', packageName: 'com.taxis99', status: 'waiting', lastCheck: null },
    { name: 'Uber', packageName: 'com.ubercab', status: 'waiting', lastCheck: null },
    { name: 'Indriver', packageName: 'sinet.startup.inDriver', status: 'waiting', lastCheck: null },
    { name: 'UrbanoNorte', packageName: 'com.urbanonorte.app', status: 'waiting', lastCheck: null },
    { name: 'ITZ Move', packageName: 'com.itzmove.app', status: 'waiting', lastCheck: null }
  ]);

  const requestPermission = async (permissionType) => {
    // Simular solicitação de permissão
    toast({
      title: "Solicitando Permissão",
      description: `Redirecionando para configurações do sistema...`,
      className: "border-l-4 border-l-blue-500 bg-blue-50",
    });

    // Simular delay da permissão
    setTimeout(() => {
      setPermissions(prev => ({
        ...prev,
        [permissionType]: true
      }));

      toast({
        title: "Permissão Concedida",
        description: getPermissionDescription(permissionType),
        className: "border-l-4 border-l-green-500 bg-green-50",
      });

      onPermissionChange?.(permissionType, true);
    }, 2000);
  };

  const getPermissionDescription = (permissionType) => {
    const descriptions = {
      accessibility: "Acesso aos serviços de acessibilidade concedido",
      screenOverlay: "Permissão para overlay na tela concedida",
      deviceAdmin: "Permissões administrativas concedidas",
      notifications: "Permissão para notificações concedida"
    };
    return descriptions[permissionType];
  };

  const getPermissionStatus = (hasPermission) => {
    return hasPermission ? (
      <Badge className="bg-green-100 text-green-800">Concedida</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">Negada</Badge>
    );
  };

  const allPermissionsGranted = Object.values(permissions).every(p => p);

  return (
    <div className="space-y-6">
      {/* Status Geral */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Status do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                {allPermissionsGranted ? 'Sistema Ativo' : 'Aguardando Permissões'}
              </p>
              <p className="text-sm text-gray-600">
                {allPermissionsGranted 
                  ? 'Monitoramento em tempo real ativo' 
                  : 'Configure as permissões para iniciar'
                }
              </p>
            </div>
            <div className={`w-4 h-4 rounded-full ${
              allPermissionsGranted ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            }`} />
          </div>
        </CardContent>
      </Card>

      {/* Permissões Necessárias */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Permissões Necessárias
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Acessibilidade */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Eye className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium">Serviços de Acessibilidade</p>
                <p className="text-sm text-gray-600">Necessário para ler conteúdo da tela</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getPermissionStatus(permissions.accessibility)}
              {!permissions.accessibility && (
                <Button 
                  size="sm" 
                  onClick={() => requestPermission('accessibility')}
                >
                  Conceder
                </Button>
              )}
            </div>
          </div>

          {/* Overlay na Tela */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-purple-500" />
              <div>
                <p className="font-medium">Overlay na Tela</p>
                <p className="text-sm text-gray-600">Para exibir notificações sobre outros apps</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getPermissionStatus(permissions.screenOverlay)}
              {!permissions.screenOverlay && (
                <Button 
                  size="sm" 
                  onClick={() => requestPermission('screenOverlay')}
                >
                  Conceder
                </Button>
              )}
            </div>
          </div>

          {/* Notificações */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <div>
                <p className="font-medium">Notificações</p>
                <p className="text-sm text-gray-600">Para alertas de corridas analisadas</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getPermissionStatus(permissions.notifications)}
              {!permissions.notifications && (
                <Button 
                  size="sm" 
                  onClick={() => requestPermission('notifications')}
                >
                  Conceder
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Apps Monitorados */}
      <Card>
        <CardHeader>
          <CardTitle>Apps Monitorados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {monitoredApps.map((app) => (
              <div key={app.packageName} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{app.name}</p>
                  <p className="text-xs text-gray-600">{app.packageName}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="mb-1">
                    {app.status === 'monitoring' ? 'Ativo' : 'Aguardando'}
                  </Badge>
                  {app.lastCheck && (
                    <p className="text-xs text-gray-500">
                      Última verificação: {app.lastCheck}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configurações de Monitoramento */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Monitoramento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Monitoramento Contínuo</Label>
              <p className="text-xs text-gray-600">Monitora apps em segundo plano</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Vibração em Alertas</Label>
              <p className="text-xs text-gray-600">Vibra quando detecta corrida</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Som de Notificação</Label>
              <p className="text-xs text-gray-600">Reproduz som nos alertas</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Aviso Legal */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-orange-800">Aviso Importante</p>
              <p className="text-xs text-orange-700 mt-1">
                Este aplicativo requer permissões especiais para funcionar. As permissões são utilizadas 
                exclusivamente para analisar ofertas de corrida e melhorar sua rentabilidade como motorista.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessibilityPermissions;
