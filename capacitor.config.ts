import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ionic.tfe',
  appName: 'tfe',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '957888261459-r47m6tbbk0sbq00lh1o1t54m7djjiuu4.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
