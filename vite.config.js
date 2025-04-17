import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import { resolve } from 'path';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        electron({
            entry: 'src/main/index.ts',
            vite: {
                build: {
                    outDir: 'dist/main',
                    minify: true,
                    rollupOptions: {
                        external: ['electron']
                    }
                }
            }
        }),
        electron({
            entry: 'src/main/preload.ts',
            onstart: (options) => {
                options.startup()
            },
            vite: {
                build: {
                    outDir: 'dist/preload',
                    minify: true,
                    rollupOptions: {
                        external: ['electron']
                    }
                }
            }
        })
    ],
    publicDir: resolve(__dirname, './src/renderer/assets'),
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
            '@renderer': resolve(__dirname, './src/renderer'),
            '@main': resolve(__dirname, './src/main'),
            '@common': resolve(__dirname, './src/common')
        }
    },
    build: {
        // rollupOptions: {
        //     input: {
        //       index: resolve(__dirname, 'src/renderer/index.html') // 绝对路径
        //     },
        //     output: {
        //         // 手动指定 HTML 输出路径
        //         entryFileNames: 'assets/[name].[hash].js',
        //         chunkFileNames: 'assets/[name].[hash].js',
        //         assetFileNames: 'assets/[name].[hash][extname]'
        //     }
        // },
        outDir: 'dist/renderer',
        emptyOutDir: true
    },
    server: {
        port: 3000
    }
});
