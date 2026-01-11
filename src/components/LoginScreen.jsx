import { useState } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import { getAuthenticatedUser } from '../services/authService';
import logo from '../assets/ktrainer-logo.png';
import '@aws-amplify/ui-react/styles.css';

function LoginScreen({ onAuthSuccess }) {
  const [error, setError] = useState(null);

  const handleAuthStateChange = async (authState) => {
    if (authState === 'authenticated') {
      try {
        const user = await getAuthenticatedUser();
        if (user) {
          onAuthSuccess(user);
        }
      } catch (err) {
        setError('Failed to get user information');
        console.error(err);
      }
    }
  };

  return (
    <div className="h-full flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8">
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
          onAuthStateChange={handleAuthStateChange}
          components={{
            SignIn: {
              Header() {
                return (
                  <div className="text-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Sign In</h2>
                  </div>
                );
              },
            },
            SignUp: {
              Header() {
                return (
                  <div className="text-center mb-4">
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
          {/* This won't render because we handle auth state in parent */}
          {() => null}
        </Authenticator>

        {import.meta.env.DEV && (
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Development mode: Auto-login available</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginScreen;
