import sveltePreprocess from 'svelte-preprocess';
import tailwind from 'tailwindcss';

const config = {
  preprocess: [sveltePreprocess({
    postcss: {
      plugins: [
        tailwind
      ]
    }
  })]
};

export default config;
