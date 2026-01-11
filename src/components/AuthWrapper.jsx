import { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { getAuthenticatedUser, autoSignInDefaultUser } from '../services/authService';
import LoginScreen from './LoginScreen';
import amplifyConfig from '../amplifyconfiguration.json';

// Configure Amplify
Amplify.configure(amplifyConfig);

function AuthWrapper({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  async function checkAuthStatus() {
    try {
      // Check if user is already authenticated
      const currentUser = await getAuthenticatedUser();

      if (currentUser) {
        setUser(currentUser);
        setLoading(false);
        return;
      }

      // If in development mode, try auto-login as default user
      if (import.meta.env.DEV) {
        const result = await autoSignInDefaultUser();
        if (result.success && result.user) {
          setUser(result.user);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleAuthSuccess(authenticatedUser) {
    setUser(authenticatedUser);
  }

  function handleLogout() {
    setUser(null);
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen onAuthSuccess={handleAuthSuccess} />;
  }

  // Clone children and pass user and logout handler as props
  return (
    <>
      {typeof children === 'function'
        ? children({ user, onLogout: handleLogout })
        : children
      }
    </>
  );
}

export default AuthWrapper;
