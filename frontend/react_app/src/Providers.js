// Packages
import { BrowserRouter as Router } from 'react-router-dom';
import { ConfirmProvider } from 'material-ui-confirm';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';

// Contexts
import { ColorModeProvider, KeycloakUserContextProvider } from './components/contexts';

// Utilities
import { store } from './store';
import SmoothScroll from './themes/SmoothScroll';
import ThemeProvider from './themes';

const queryClient = new QueryClient();

function ProviderWrapper({ children }) {
  return (
    <KeycloakUserContextProvider>
      <Provider store={store}>
        <ColorModeProvider>
          <ThemeProvider>
            <ConfirmProvider defaultOptions={{ confirmationButtonProps: { autoFocus: true } }}>
              <Router>
                <QueryClientProvider client={queryClient}>
                  <SmoothScroll>
                    {children}
                    {/* <ErrorBoundary>
                                    </ErrorBoundary> */}
                  </SmoothScroll>
                </QueryClientProvider>
              </Router>
            </ConfirmProvider>
          </ThemeProvider>
        </ColorModeProvider>
      </Provider>
    </KeycloakUserContextProvider>
  );
}

export default ProviderWrapper;

export const withLayout = (story) => <ProviderWrapper children={story()} />;