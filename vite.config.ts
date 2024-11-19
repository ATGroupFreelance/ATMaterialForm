import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
//This plugin means that vite paths are read from tsconfig instead
// import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path';
//@ts-expect-error There is no typescript types for this library
import eslint from 'vite-plugin-eslint';
// import Checker from 'vite-plugin-checker';


// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    clearScreen: true,
    plugins: [
      react(),
      // tsconfigPaths(),
      // Checker({
      //   eslint: {
      //     lintCommand: 'eslint --max-warnings 0',  // Customize as needed
      //   },
      // }),
      eslint(
        {
          include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.jsx'],
          emitWarning: true,  // Show lint issues as warnings instead of errors
          emitError: true,    // Emit errors
          failOnError: false, // Don't fail the build if there are lint errors
        }
      ),
    ],
    server: {
      port: 30000,
      hmr: true,
      open: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'), // Configure @ to map to the src directory
      },
    },
    // build: {
    //   lib: {
    //     entry: path.resolve(__dirname, 'src/lib/index.jsx'),  // Entry file of your library
    //     name: 'ATMaterialForm',
    //     fileName: 'index',
    //     formats: ['es', 'cjs'],  // Both ES module and CommonJS
    //   },
    //   rollupOptions: {
    //     external: ['react', 'react-dom'],  // Externalize React and ReactDOM
    //     output: {
    //       globals: {
    //         react: 'React',
    //         'react-dom': 'ReactDOM',
    //       },
    //     },
    //   },
    // },
  }
})
