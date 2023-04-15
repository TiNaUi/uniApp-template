import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
    envDir: resolve(__dirname, 'env'),
    plugins: [
        uni(),
        AutoImport({
            include: [
                'src/**/*.ts',
                'src/**/*.d.ts',
                'src/**/*.tsx',
                'src/**/*.vue',
                'types/auto-imports.d.ts',
                'types/components.d.ts'
            ],
            dts: 'types/auto-imports.d.ts', // 生成配置文件，如果是ts项目，通常我们会把声明文件放在根目录/types中，
            // 注意，这个文件夹需要先建好，否则可能导致等下无法往里生成auto-imports.d.ts文件
            imports: ['vue', 'uni-app', 'pinia'],
            dirs: ['src/components/**', 'src/composables/**', 'src/utils/**'],
            eslintrc: {
                enabled: true, // 默认false, true启用。生成一次就可以，避免每次工程启动都生成，一旦生成配置文件之后，最好把enable关掉，即改成false
                // 否则这个文件每次会在重新加载的时候重新生成，这会导致eslint有时会找不到这个文件。当需要更新配置文件的时候，再重新打开
                filepath: './.eslintrc-auto-import.json', // 生成json文件,可以不配置该项，默认就是将生成在根目录
                globalsPropValue: true
            }
        }),
        Components({
            dts: 'types/components.d.ts',
            dirs: ['src/components/**', 'src/pages/**'],
            resolvers: [VantResolver()]
        })
    ],
    resolve: {
        // 配置别名
        alias: {
            '@': resolve(__dirname, 'src')
        }
    },
    css: {
        // css预处理器
        preprocessorOptions: {
            scss: {
                // 因为uni.scss可以全局使用，这里根据自己的需求调整
                additionalData: '@import "./src/styles/global.scss";'
            }
        }
    },
    // 开发服务器配置
    server: {
        host: '0.0.0.0',
        port: 8080,
        // 请求代理
        proxy: {
            // 个人习惯，这里就用/dev作为前缀了
            '/dev': {
                target: 'https://suggest.taobao.com',
                changeOrigin: true,
                // 路径重写，去掉/dev
                rewrite: (path) => path.replace(/^\/dev/, '')
            }
        }
    },
    build: {
        // 禁用 gzip 压缩大小报告，以提升构建性能
        brotliSize: false,
        /** 配置h5打包js,css,img分别在不同文件夹start */
        assetsDir: 'static/img/',
        rollupOptions: {
            output: {
                chunkFileNames: 'static/js/[name]-[hash].js',
                entryFileNames: 'static/js/[name]-[hash].js',
                assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
            }
        }
        /** 配置h5打包js,css,img分别在不同文件夹end */
    }
})
