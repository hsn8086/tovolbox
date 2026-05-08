import react from '@astrojs/react';
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://tovolbox.hsn8086.com',
  integrations: [react()],
});
