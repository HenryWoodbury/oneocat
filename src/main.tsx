import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './styles/root.css';
import App from './App.tsx';
import { OceanEffect } from './components/OceanEffect.tsx';
/*
import { WavesEffect } from './components/WavesEffect.tsx';
import { MatrixEffect } from './components/MatrixEffect.tsx';
import { Waves } from './components/Waves.tsx';
    <MatrixEffect />
    <Waves />
*/

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <OceanEffect />
  </StrictMode>,
);
