# FocusRoom

A calm, distraction-free digital space designed to help you stay focused and productive.

## Overview
FocusRoom is your personal sanctuary for deep work. Designed with minimalism in mind, it creates a peaceful environment where you can focus on your tasks without distractions. Customize your workspace, set timers, and track your productivity with ease.

## Features
- **Distraction-Free UI:** A clean, minimal interface to help you stay in the zone.
- **Focus Timer:** Built-in Pomodoro-style timer to break work into focused intervals.
- **Themes & Backgrounds:** Choose calming themes or background visuals that suit your vibe.
- **To-Do Panel:** Manage simple daily tasks and priorities.
- **Ambient Sounds (optional):** Light ambient sounds to improve focus (e.g., rain, forest, café).


<img width="1201" height="812" alt="image" src="https://github.com/user-attachments/assets/fe521784-1753-4c0e-93c8-45ec6a89c7fb" />

## Tech Stack
- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) (build tool)
- [Tailwind CSS](https://tailwindcss.com/) (utility-first styling)

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)

### Installation
```sh
# Clone the repository
git clone https://github.com/ItsAkshatSh/FocusRoom.git
cd focusroom

# Install dependencies
npm install
```
## Spotify API setup

### Step 1: Head to the Spotify Developer Dashboard
Go to [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard). Sign in with your Spotify account (or create one if needed).

### Step 2: Create an App
- Click the **"Create an App"** button.
- Give your app a name (e.g., `FocusRoom Music or whatever fits).
- Add a short description (e.g., “For personal use”).
- Agree to the terms and click **"Create"**.

Boom. You’ve got an app.

### Step 3: Get Your Client ID (and Secret)
- Once your app is created, you’ll be redirected to the app overview.
- Your **Client ID** is right there — copy it.
- Once you copy your Client ID, head over to src\services\spotifyService.ts or [here](https://github.com/ItsAkshatSh/focusroom/blob/bdff3f35aa45f4df166d5c63b62a5e1d67ebcce2/src/services/spotifyService.ts#L58) and replace 'SPOTIFY_CLIENT_ID' with your's
### Step 4: Set Redirect URIs
- In your app dashboard, scroll down to the **Redirect URIs** section.
- Click **"Edit Settings"** → under **Redirect URIs**, add:
```sh
http://127.0.0.1:5173 // or the local/dev server 
```
-Done!

## Google OAuth setup

### Step 1: Go to Google Cloud Console
Head over to [console.cloud.google.com](https://console.cloud.google.com/). Sign in with your Google account if you aren’t already.

### Step 2: Create a New Project
- Click the project dropdown on the top bar.
- Hit **"New Project"**.
- Give it a name (e.g., `FocusRoom Login`) and click **"Create"**.
- Wait a few seconds for it to set up, then click **"Select Project"**.

### Step 3: Enable the OAuth API
- In the left sidebar, go to **APIs & Services → Library**.
- Search for **"Google Identity Services"**.
- Click on it, then hit **"Enable"**.

### Step 4: Set Up OAuth Credentials
- Go to **APIs & Services → Credentials**.
- Click **"Create Credentials" → "OAuth client ID"**.
- If prompted, configure the OAuth consent screen first (just fill in the basic fields like app name and support email).
- For **Application Type**, choose **Web application**.
- Give it a name (e.g., `FocusRoom Auth`).
- Under **Authorized JavaScript origins**, enter your domain. For local development, add:

```sh
http://127.0.0.1:5173 // or the local/dev server 
```

- Click **Create**.

### Step 5: Copy Your Client ID
- Once the popup appears, copy the **Client ID**.
- Once you copy your client id, head over to index.html or [here](https://github.com/ItsAkshatSh/focusroom/blob/bdff3f35aa45f4df166d5c63b62a5e1d67ebcce2/index.html#L9), and replace the 'GOOGLE_CLIENT_ID' with your's
