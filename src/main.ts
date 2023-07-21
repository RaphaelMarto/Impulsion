import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { collection, getDocs, getFirestore } from 'firebase/firestore';


defineCustomElements(window);

if (environment.production) {
  enableProdMode();
}

const firebaseConfig = {
  apiKey: "AIzaSyDozxOqoQkpQQgPU8qu5wpQ5kFwsz5weO8",
  authDomain: "impulsion-6bca6.firebaseapp.com",
  projectId: "impulsion-6bca6",
  storageBucket: "impulsion-6bca6.appspot.com",
  messagingSenderId: "957888261459",
  appId: "1:957888261459:web:c167768a543733f0b385a6",
  measurementId: "G-SBKL04QF2T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore()
// const colRef = collection(db,'Music')
// getDocs(colRef)
const analytics = getAnalytics(app);

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
