/**
 * App Component - Componente Principal Refactorizado
 * Arquitectura limpia con Context + Custom Hooks
 */

import './App.css';

// Importar providers
import {
  AppProvider,
  TeamsProvider,
  ChildrenProvider,
  SearchProvider,
  UIProvider,
  HighlightProvider
} from './contexts';

// Importar componente principal
import AppContent from './AppContent';

function App() {
  return (
    <AppProvider>
      <TeamsProvider>
        <ChildrenProvider>
          <HighlightProvider>
            <SearchProvider>
              <UIProvider>
                <AppContent />
              </UIProvider>
            </SearchProvider>
          </HighlightProvider>
        </ChildrenProvider>
      </TeamsProvider>
    </AppProvider>
  );
}

export default App;
