# Bharas — Discord-like MVP (Web + Mobile)

Monorepo layout:
- /server — Node + Express + Socket.io (real-time)
- /client — React web app (Vite + socket.io-client)
- /mobile — Expo React Native app (socket.io-client)

Firebase (optional):
- This scaffold includes optional Firebase config files (client/mobile) but does not enable Firebase by default.
- To enable Firebase, create a Firebase project and replace the placeholder config in client/src/firebase.js and mobile/firebase.js.

Quick start (local)
1. Clone repo:
   git clone https://github.com/Sujalofficial07/Bharas.git
   cd Bharas

2. Server
   cd server
   npm install
   npm run dev
   (server listens on :4000 by default)

3. Web client
   cd ../client
   npm install
   npm run dev
   (opens at http://localhost:5173 by default — configured to connect to http://localhost:4000)

4. Mobile (Expo)
   cd ../mobile
   npm install
   npx expo start
   (scan QR or open on emulator; mobile connects to server at http://{YOUR_HOST_IP}:4000, not localhost on device)

Notes
- The scaffold uses an in-memory store for channels/messages (MVP). I can add MongoDB persistence and JWT auth if you want.
- For mobile device testing, replace SERVER in mobile/App.js with your development machine IP (e.g., http://192.168.1.10:4000) and ensure port 4000 is reachable.
- To enable Firebase, add your Firebase config to the provided files and install firebase packages.