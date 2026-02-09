# GitHub Secrets Setup Guide

To ensure your PrepTracker application deploys correctly to GitHub Pages, you need to add your Supabase credentials as GitHub Secrets. This keeps your API keys secure and prevents them from being exposed in your public code repository.

## Step-by-Step Instructions

1.  **Navigate to your Repository Settings**
    *   Go to your PrepTracker repository on GitHub.
    *   Click on the **"Settings"** tab in the top navigation bar.

2.  **Access Secrets and Variables**
    *   In the left sidebar, scroll down to the **"Security"** section.
    *   Click on **"Secrets and variables"**.
    *   Select **"Actions"** from the dropdown menu.

3.  **Add `VITE_SUPABASE_URL`**
    *   Click the green **"New repository secret"** button.
    *   **Name**: `VITE_SUPABASE_URL`
    *   **Secret**: `https://febljsaaybkzxfqottkm.supabase.co`
    *   Click **"Add secret"**.

4.  **Add `VITE_SUPABASE_ANON_KEY`**
    *   Click the green **"New repository secret"** button again.
    *   **Name**: `VITE_SUPABASE_ANON_KEY`
    *   **Secret**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlYmxqc2FheWJrenhmcW90dGttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MzI2NjEsImV4cCI6MjA4NjIwODY2MX0.2ZZA34jd5VzMiY7xxXsEG-b7pSEbCX1AzXCnnKDdEtI`
    *   Click **"Add secret"**.

5.  **Verify**
    *   You should now see both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` listed under "Repository secrets".

## Why is this necessary?

The `.github/workflows/deploy.yml` file is configured to use these secrets during the build process:

```yaml
env:
  VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
  VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
```

Without these secrets, the build will fail or the deployed application will not be able to connect to your Supabase backend.
