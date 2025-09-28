# Firebase Setup Guide

This application uses Firebase for authentication and Firestore for data storage. Follow these steps to set up Firebase for your Trip Buddy app.

## Prerequisites

1. A Google account
2. Node.js and npm installed

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "trip-buddy")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Add a Web App to Your Project

1. In the Firebase Console, click the web icon (`</>`) to add a web app
2. Enter an app nickname (e.g., "Trip Buddy Web")
3. **Check** "Also set up Firebase Hosting" if you plan to deploy
4. Click "Register app"
5. Copy the Firebase configuration object

## Step 3: Configure Environment Variables

1. Create a `.env` file in the root directory of your project
2. Copy the contents from `.env.example`
3. Replace the placeholder values with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## Step 4: Enable Authentication

1. In the Firebase Console, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Email/Password" authentication
5. Optionally enable "Google" authentication for OAuth

## Step 5: Set up Firestore Database

1. In the Firebase Console, go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" for development (you can change security rules later)
4. Select a location for your database (choose the closest to your users)
5. Click "Done"

## Step 6: Configure Security Rules (Optional but Recommended)

1. In Firestore, go to the "Rules" tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Data Structure

The app stores user data in Firestore with the following structure:

### Users Collection (`users`)
- **Document ID**: User's Firebase UID
- **Fields**:
  - `uid`: String - Firebase user ID
  - `name`: String - User's full name
  - `email`: String - User's email address
  - `createdAt`: Timestamp - Account creation date
  - `updatedAt`: Timestamp - Last update date
  - `profileComplete`: Boolean - Whether user completed onboarding
  - `preferences`: Object - User preferences
    - `notifications`: Boolean - Email notifications enabled
    - `theme`: String - UI theme preference

## Testing

1. Start your development server: `npm run dev`
2. Try signing up with a test email
3. Check the Firebase Console to see:
   - New user in Authentication > Users
   - User document in Firestore Database > users collection

## Security Notes

- Never commit your `.env` file to version control
- Use Firebase Security Rules to protect your data
- Consider enabling App Check for additional security
- Regularly review your Firebase usage and billing

## Troubleshooting

### Common Issues

1. **Environment variables not loading**: Make sure your `.env` file is in the root directory and variable names start with `VITE_`

2. **Permission denied errors**: Check your Firestore security rules

3. **Authentication errors**: Verify that Email/Password authentication is enabled in Firebase Console

4. **Network errors**: Check your internet connection and Firebase project settings

For more detailed documentation, visit the [Firebase Documentation](https://firebase.google.com/docs).