import { getCurrentUser, signIn, signUp, signOut } from 'aws-amplify/auth';

export async function getAuthenticatedUser() {
  try {
    const user = await getCurrentUser();
    return user;
  } catch (error) {
    return null;
  }
}

export async function authenticateUser(username, password) {
  try {
    const { isSignedIn } = await signIn({ username, password });
    if (isSignedIn) {
      const user = await getCurrentUser();
      return { success: true, user };
    }
    return { success: false, error: 'Sign in failed' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function registerUser(username, password, attributes) {
  try {
    const { isSignUpComplete, userId, nextStep } = await signUp({
      username,
      password,
      options: {
        userAttributes: attributes,
        autoSignIn: true
      }
    });

    if (isSignUpComplete) {
      return { success: true, userId };
    }

    return { success: false, error: 'Sign up incomplete', nextStep };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function logoutUser() {
  try {
    await signOut();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function autoSignInDefaultUser() {
  const defaultUsername = import.meta.env.VITE_DEFAULT_USERNAME || 'jon@workout.local';
  const defaultPassword = 'TempPassword123!';
  const defaultFirstName = import.meta.env.VITE_DEFAULT_USER_FIRSTNAME || 'Jon';

  try {
    // Try to sign in first
    const signInResult = await authenticateUser(defaultUsername, defaultPassword);
    if (signInResult.success) {
      return signInResult;
    }

    // If sign in fails, try to create the user (email is used as username)
    const signUpResult = await registerUser(defaultUsername, defaultPassword, {
      given_name: defaultFirstName,
    });

    if (signUpResult.success) {
      // Auto sign-in should happen automatically with autoSignIn option
      const user = await getCurrentUser();
      return { success: true, user };
    }

    return signUpResult;
  } catch (error) {
    return { success: false, error: error.message };
  }
}
