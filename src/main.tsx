import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import '@mantine/core/styles.css'; 
import '@mantine/dates/styles.css';
import 'mantine-react-table/styles.css';
import App from './App';

declare global {
  interface Window {
    electronAPI?: {
      getAccessToken: () => Promise<string | null>,
      setTheme: (theme: string) => Promise<string>,
      logout: () => void,
    }
  }
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
