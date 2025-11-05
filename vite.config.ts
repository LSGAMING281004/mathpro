import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// IMPORTANT: Replace 'CursorProject' with your actual GitHub repository name
// If your GitHub Pages URL is: https://username.github.io/repo-name
// Then set base to: '/repo-name/'
// If your GitHub Pages URL is: https://username.github.io (user/organization page)
// Then set base to: '/'
const base = '/CursorProject/';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: base,
});



