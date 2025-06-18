import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/root.css';
import App from './App.tsx';
import { Waves } from './components/Waves.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Waves />
  </StrictMode>,
);
