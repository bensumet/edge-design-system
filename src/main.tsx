// Fonts are bundled with the site: no third-party requests, and the type
// renders the same everywhere. Latin subsets keep the files small.
import '@fontsource/eb-garamond/latin-400.css';
import '@fontsource/eb-garamond/latin-500.css';
import '@fontsource/eb-garamond/latin-600.css';
import '@fontsource/eb-garamond/latin-400-italic.css';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/inter/latin-700.css';
import '@fontsource-variable/archivo/wdth.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { EdgeThemeProvider } from './theme/EdgeThemeProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EdgeThemeProvider>
      <App />
    </EdgeThemeProvider>
  </StrictMode>,
);
