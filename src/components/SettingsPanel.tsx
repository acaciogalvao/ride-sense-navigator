
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

const SettingsPanel = ({ settings, onSettingsChange }) => {
  const updateSetting = (key, value) => {
    onSettingsChange(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const presetConfigs = [
    {
      name: "Conservador",
      description: "Apenas corridas muito boas",
      settings: { goodRideThreshold: 3.0, mediumRideThreshold: 2.2 }
    },
    {
      name: "Equilibrado",
      description: "Balance entre quantidade e qualidade",
      settings: { goodRideThreshold: 2.5, mediumRideThreshold: 1.8 }
    },
    {
      name: "Agressivo",
      description: "Aceita mais corridas",
      settings: { goodRideThreshold: 2.0, mediumRideThreshold: 1.5 }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Configurações de Limites */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Limites de Rentabilidade</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Corrida Boa (Verde)</Label>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="number"
                step="0.1"
                min="0"
                value={settings.goodRideThreshold}
                onChange={(e) => updateSetting('goodRideThreshold', parseFloat(e.target.value))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              <span className="text-sm text-gray-600">R$/km</span>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Corrida Média (Amarelo)</Label>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="number"
                step="0.1"
                min="0"
                value={settings.mediumRideThreshold}
                onChange={(e) => updateSetting('mediumRideThreshold', parseFloat(e.target.value))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              <span className="text-sm text-gray-600">R$/km</span>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Valor Mínimo por Minuto</Label>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="number"
                step="0.1"
                min="0"
                value={settings.minimumTimeValue}
                onChange={(e) => updateSetting('minimumTimeValue', parseFloat(e.target.value))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              <span className="text-sm text-gray-600">R$/min</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Presets */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Configurações Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {presetConfigs.map((preset, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium text-sm">{preset.name}</p>
                <p className="text-xs text-gray-600">{preset.description}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onSettingsChange(prev => ({ ...prev, ...preset.settings }))}
              >
                Aplicar
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Configurações Gerais */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Configurações Gerais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Análise Automática</Label>
              <p className="text-xs text-gray-600">Monitorar apps automaticamente</p>
            </div>
            <Switch
              checked={settings.autoAnalysis}
              onCheckedChange={(checked) => updateSetting('autoAnalysis', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Status Atual */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Status Atual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Corrida Boa:</span>
              <Badge className="bg-green-100 text-green-800">
                ≥ R$ {settings.goodRideThreshold.toFixed(2)}/km
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Corrida Média:</span>
              <Badge className="bg-yellow-100 text-yellow-800">
                R$ {settings.mediumRideThreshold.toFixed(2)} - {settings.goodRideThreshold.toFixed(2)}/km
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Corrida Ruim:</span>
              <Badge className="bg-red-100 text-red-800">
                &lt; R$ {settings.mediumRideThreshold.toFixed(2)}/km
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPanel;
