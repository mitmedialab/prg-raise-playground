import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      // Ensure @jibo/three resolves to the CJS file under node_modules so Rollup/CommonJS interop kicks in
      '@jibo/three': resolve(__dirname, 'node_modules/@jibo/three/three.js'),
      // Make animation-utilities source available
      '@/animation-utilities': resolve(__dirname, '../src')
    }
  },
  optimizeDeps: {
    // Explicitly include three.js for optimization
    include: ['@jibo/three']
  },
  server: {
    port: 3000,
    open: '/full-animation-demo.html', // Open the full demo by default
    fs: {
      // Allow serving files from parent directories
      allow: ['..']
    }
  },
  build: {
    target: 'es2015',
    commonjsOptions: {
      // Make sure CommonJS transform applies to our three.js shim as well
      include: [/node_modules\/.*/, /threejs-r70\/three\.js/]
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        full: resolve(__dirname, 'full-animation-demo.html') // Add full demo as build target
      }
    }
  },
  // Use default public directory (demo/public)
  publicDir: 'public'
}); 