import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mohamadmahdi.greenhouse',
  appName: 'Smart Greenhouse',
  webDir: 'dist',
  server: {
    // During development, this lets the app load straight from your Vite
    // dev server (so you see live changes without rebuilding). Comment this
    // whole "server" block out for the final production build.
    // url: 'http://192.168.1.X:5173',
    // cleartext: true
  },
};

export default config;
