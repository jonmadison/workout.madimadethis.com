#!/usr/bin/env node

/**
 * Script to set a permanent password for a user (skip temp password flow)
 * Usage: node scripts/set-user-password.js <username> <password>
 */

import { CognitoIdentityProviderClient, AdminSetUserPasswordCommand } from '@aws-sdk/client-cognito-identity-provider';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read Amplify outputs to get User Pool ID
const amplifyOutputs = JSON.parse(
  readFileSync(join(__dirname, '../amplify_outputs.json'), 'utf-8')
);

const userPoolId = amplifyOutputs.auth.user_pool_id;
const region = amplifyOutputs.auth.aws_region;

// Parse command line arguments
const [username, password] = process.argv.slice(2);

if (!username || !password) {
  console.error('Usage: node scripts/set-user-password.js <username> <password>');
  console.error('Example: node scripts/set-user-password.js john MyPassword123!');
  process.exit(1);
}

const client = new CognitoIdentityProviderClient({ region });

async function setPassword() {
  try {
    const command = new AdminSetUserPasswordCommand({
      UserPoolId: userPoolId,
      Username: username,
      Password: password,
      Permanent: true, // Make it permanent (not temporary)
    });

    await client.send(command);

    console.log('✅ Password set successfully!');
    console.log('');
    console.log('Username:', username);
    console.log('Password:', password);
    console.log('');
    console.log('ℹ️  User can now log in with this password');

  } catch (error) {
    if (error.name === 'UserNotFoundException') {
      console.error('❌ Error: User not found');
    } else {
      console.error('❌ Error setting password:', error.message);
    }
    process.exit(1);
  }
}

setPassword();
