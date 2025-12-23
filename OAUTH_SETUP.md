# OAuth Setup Instructions

## Google Sign-In Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable "Google+ API" and "People API"
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Choose "Web application"
6. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - `https://convertonix.com` (for production)
7. Copy your Client ID
8. Create a `.env` file in the root directory and add:
   ```
   REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
   ```
9. Restart your development server

## Facebook Sign-In Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add "Facebook Login" product
4. Go to Settings → Basic
5. Add your domain to "App Domains"
6. Add authorized redirect URIs in "Facebook Login" → "Settings":
   - `http://localhost:3000` (for development)
   - `https://convertonix.com` (for production)
7. Copy your App ID
8. In `src/contexts/AuthContext.jsx`, replace `YOUR_FACEBOOK_APP_ID` with your actual App ID (or use environment variable)

## Notes

- For production, make sure to update the redirect URIs with your actual domain
- Keep your Client IDs and App IDs secure
- Never commit `.env` files to version control
- Test OAuth flows in both development and production environments

