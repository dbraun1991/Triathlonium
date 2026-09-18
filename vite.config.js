import { defineConfig } from 'vite';

// GitHub Pages serves a project site from /<repo-name>/ (ADR-0004). Update
// this if the repo is ever renamed (ADR-0013).
export default defineConfig({
  base: '/Triathlonium/',
});
