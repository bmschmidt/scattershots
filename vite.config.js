import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

// /** @type {import('@sveltejs/kit').Config} */
// const config = {
// 	// Consult https://github.com/sveltejs/svelte-preprocess
// 	// for more information about preprocessors
// 	preprocess: preprocess(),
// 	kit: {
// 		adapter: adapter({
// 			pages: 'docs',
// 			assets: 'docs',
// 		}),
// 		paths: {
// 			base: '/sveltekit-typescript'
// 		},
// 		prerender: {
// 			default: true
// 		},
// 		appDir: 'internal', // For github pages: https://www.npmjs.com/package/@sveltejs/adapter-static/v/next
// 	}
// };

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	preprocess: preprocess(),
	kit: {
		adapter: adapter({
			pages: 'docs',
			assets: 'docs',
		}),
	}
};

export default config;