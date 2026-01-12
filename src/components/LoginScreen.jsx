import { useState, useEffect } from 'react';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { resetPassword } from 'aws-amplify/auth';
import { getAuthenticatedUser } from '../services/authService';
import logo from '../assets/ktrainer-logo.png';
import '@aws-amplify/ui-react/styles.css';

function LoginForm({ onAuthSuccess }) {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);

  useEffect(() => {
    const checkAuth = async () => {
      if (authStatus === 'authenticated') {
        try {
          const user = await getAuthenticatedUser();
          if (user) {
            onAuthSuccess(user);
          }
        } catch (err) {
          console.error('Failed to get user information:', err);
        }
      }
    };
    checkAuth();
  }, [authStatus, onAuthSuccess]);

  return null;
}

function LoginScreen({ onAuthSuccess }) {
  const [error, setError] = useState(null);
  const allowSignups = import.meta.env.VITE_ALLOW_SIGNUPS === 'true';

  // Custom forgot password handler to check for FORCE_CHANGE_PASSWORD status
  const services = {
    async handleForgotPassword({ username }) {
      try {
        const output = await resetPassword({ username });
        return output;
      } catch (error) {
        console.error('Forgot password error:', error);

        // Check if error is due to user not completing initial password setup
        if (error.name === 'InvalidParameterException' ||
            error.message?.includes('Cannot reset password for the user') ||
            error.message?.includes('temporary password')) {
          throw new Error(
            'Please sign in with your temporary password first to complete account setup. ' +
            'After your first login, you can use the "Forgot Password" feature.'
          );
        }

        // Re-throw other errors
        throw error;
      }
    },
  };

  return (
    <div className="h-full flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md">
        {/* Logo and branding */}
        <div className="text-center mb-8">
          <img
            src={logo}
            alt="Kettlebell Tracker"
            className="h-24 w-24 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-gray-900">Kettlebell Tracker</h1>
          <p className="text-gray-600 mt-2">Track your kettlebell workouts</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Amplify Authenticator with custom styling */}
        <Authenticator
          initialState={allowSignups ? undefined : 'signIn'}
          hideSignUp={!allowSignups}
          services={services}
          components={{
            SignIn: {
              Header() {
                return (
                  <div className="text-center pt-6 pb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Sign In</h2>
                  </div>
                );
              },
            },
            SignUp: {
              Header() {
                return (
                  <div className="text-center pt-6 pb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Create Account</h2>
                  </div>
                );
              },
              FormFields() {
                return (
                  <>
                    <Authenticator.SignUp.FormFields />
                  </>
                );
              },
            },
          }}
        >
          <LoginForm onAuthSuccess={onAuthSuccess} />
        </Authenticator>

        {import.meta.env.DEV && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-semibold text-blue-900 mb-2">Development Mode</p>
            <p className="text-xs text-blue-700">
              The app will auto-create and sign you in as the default user on first load.
            </p>
            <p className="text-xs text-blue-700 mt-2">
              If needed, sign in manually with:
            </p>
            <p className="text-xs font-mono text-blue-900 mt-1">
              Email: <strong>jon@workout.local</strong>
            </p>
            <p className="text-xs font-mono text-blue-900">
              Password: <strong>TempPassword123!</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginScreen;
