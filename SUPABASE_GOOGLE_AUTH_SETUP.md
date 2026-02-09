# Google Authentication Setup Guide for Supabase

To enable Google Sign-In for your application, you need to configure both the Google Cloud Console and your Supabase project dashboard. Follow these steps carefully.

## Part 1: Google Cloud Console

1.  **Create a Project**
    *   Go to the [Google Cloud Console](https://console.cloud.google.com/).
    *   Click on the project dropdown at the top left and select **"New Project"**.
    *   Name your project (e.g., "PrepTracker Auth") and click **"Create"**.

2.  **Configure OAuth Consent Screen**
    *   In the left sidebar, navigate to **APIs & Services > OAuth consent screen**.
    *   Select **"External"** as the User Type and click **"Create"**.
    *   Fill in the **App Information**:
        *   **App name**: PrepTracker (or your app name)
        *   **User support email**: Your email address.
    *   Fill in **Developer Contact Information** with your email.
    *   Click **"Save and Continue"** through the scopes and test users sections (you can leave defaults for now).
    *   On the Summary page, click **"Back to Dashboard"**.
    *   **Important**: Under "Publishing Status", click **"Publish App"** to make it available to any user with a Google account (otherwise only test users can log in).

3.  **Create Credentials**
    *   Navigate to **APIs & Services > Credentials**.
    *   Click **"+ Create Credentials"** at the top and select **"OAuth client ID"**.
    *   **Application type**: Select **"Web application"**.
    *   **Name**: "Supabase Auth" (or similar).
    *   **Authorized JavaScript origins**:
        *   Add your development URL: `http://localhost:5173` (or whatever port your local server runs on).
        *   Add your production URL (e.g., `https://your-project.github.io`).
    *   **Authorized redirect URIs**:
        *   You need your Supabase Project URL for this. It looks like: `https://<your-project-ref>.supabase.co/auth/v1/callback`.
        *   To find this, go to your Supabase Dashboard > Authentication > Providers > Google, and copy the "Callback URL (for OAuth)".
    *   Click **"Create"**.

4.  **Copy Credentials**
    *   A modal will appear with your **Client ID** and **Client Secret**.
    *   Copy these values; you will need them for the Supabase setup.

## Part 2: Supabase Dashboard

1.  **Enable Google Provider**
    *   Go to your [Supabase Dashboard](https://supabase.com/dashboard).
    *   Select your project.
    *   Navigate to **Authentication > Providers**.
    *   Click on **"Google"** to expand the settings.
    *   Toggle **"Enable Sign in with Google"** to ON.

2.  **Enter Credentials**
    *   Paste the **Client ID** you copied from Google Cloud Console.
    *   Paste the **Client Secret** you copied from Google Cloud Console.
    *   Click **"Save"**.

3.  **URL Configuration**
    *   Navigate to **Authentication > URL Configuration**.
    *   **Site URL**: Set this to your production URL (e.g., `https://your-username.github.io/PrepTracker/`).
    *   **Redirect URLs**: Add `http://localhost:5173` (or your local dev URL) to the allow list. This ensures you can log in during development.

## Part 3: Verification

1.  Restart your local development server if needed.
2.  Click the **"Continue with Google"** button on the login page.
3.  You should be redirected to Google to sign in.
4.  After signing in, you will be redirected back to the app.

---
**Note:** Since this application uses `HashRouter`, the redirect behavior is handled by `supabase.auth.signInWithOAuth({ options: { redirectTo: window.location.origin } })`. This ensures the user returns to the correct base URL.
