
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.e5ab514ba570456e8daf8326671c515d',
  appName: 'ride-sense-navigator',
  webDir: 'dist',
  server: {
    url: 'https://e5ab514b-a570-456e-8daf-8326671c515d.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    CapacitorHttp: {
      enabled: true
    }
  }
};

export default config;
