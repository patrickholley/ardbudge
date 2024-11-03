import {defineConfig,loadEnv} from "vite";
import * as path from "node:path";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
        build: {
            manifest: true,
            outDir: 'dist',
            rollupOptions: {
                output: {
                    entryFileNames: 'assets/[name].[hash].js',
                    chunkFileNames: 'assets/[name].[hash].js',
                    assetFileNames: 'assets/[name].[hash].[ext]',
                    format: 'esm'
                }
            }
        },
        define: {
            __APP_ENV__: JSON.stringify(env.APP_ENV),
        },
        resolve: {
            alias: {
                '@components': path.resolve(__dirname, './src/components'),
                '@pages': path.resolve(__dirname, './src/pages'),
                '@styles': path.resolve(__dirname, './src/styles'),
                '@templates': path.resolve(__dirname, './src/templates'),
                '@app-types': path.resolve(__dirname, './src/types'),
                '@store': path.resolve(__dirname, './src/store.ts'),
                '@utils': path.resolve(__dirname, './src/utils')
            },
        }
    }
});
