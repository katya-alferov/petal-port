import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';
import { App } from './app/App';
import { installGlobalErrorLogging, log } from './platform/log';
import { APP_VERSION } from './platform/version';

installGlobalErrorLogging();
log('info', `boot ${APP_VERSION}`);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
