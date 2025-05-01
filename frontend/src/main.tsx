import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { useAuthStore } from './auth/store';

const initializeApp = async () => {

  await useAuthStore.persist.rehydrate();

  await useAuthStore.getState().initialize();

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

initializeApp();