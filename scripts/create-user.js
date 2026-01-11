#!/usr/bin/env node

/**
 * Script to manually create users in Cognito User Pool
 * Usage: node scripts/create-user.js <username> <email> [firstName]
 */

import { CognitoIdentityProviderClient, AdminCreateUserCommand } from '@aws-sdk/client-cognito-identity-provider';
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
const [username, email, firstName] = process.argv.slice(2);

if (!username || !email) {
  console.error('Usage: node scripts/create-user.js <username> <email> [firstName]');
  console.error('Example: node scripts/create-user.js john john@example.com John');
  process.exit(1);
}

const client = new CognitoIdentityProviderClient({ region });

async function createUser() {
  try {
    const userAttributes = [
      { Name: 'email', Value: email },
      { Name: 'email_verified', Value: 'true' },
    ];

    if (firstName) {
      userAttributes.push({ Name: 'given_name', Value: firstName });
    }

    const command = new AdminCreateUserCommand({
      UserPoolId: userPoolId,
      Username: username,
      UserAttributes: userAttributes,
      MessageAction: 'SUPPRESS', // Don't send invitation email
      TemporaryPassword: 'TempPassword123!', // User will need to change on first login
    });

    const response = await client.send(command);

    console.log('✅ User created successfully!');
    console.log('');
    console.log('Username:', username);
    console.log('Email:', email);
    console.log('Temporary Password: TempPassword123!');
    console.log('');
    console.log('ℹ️  User will be prompted to change password on first login');

    return response;
  } catch (error) {
    if (error.name === 'UsernameExistsException') {
      console.error('❌ Error: User already exists');
    } else {
      console.error('❌ Error creating user:', error.message);
    }
    process.exit(1);
  }
}

createUser();
