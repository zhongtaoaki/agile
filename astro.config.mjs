import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://zhongtaoaki.com',
  base: '/',
  integrations: [tailwind()],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'one-light',
        dark: 'tokyo-night',
      },
      langs: ['java', 'javascript', 'typescript', 'html', 'css', 'bash', 'json'],
      wrap: true,
    },
  },
});
