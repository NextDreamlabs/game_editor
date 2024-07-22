// vite.config.ts
import { defineConfig } from "file:///Users/allen/Desktop/%E6%97%A5%E5%B8%B8%E4%BB%A3%E7%A0%81/piexl-editor/node_modules/.pnpm/vite@5.3.3_@types+node@20.14.10/node_modules/vite/dist/node/index.js";
import vue from "file:///Users/allen/Desktop/%E6%97%A5%E5%B8%B8%E4%BB%A3%E7%A0%81/piexl-editor/node_modules/.pnpm/@vitejs+plugin-vue@5.0.5_vite@5.3.3_vue@3.4.31/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "node:path";
import tailwind from "file:///Users/allen/Desktop/%E6%97%A5%E5%B8%B8%E4%BB%A3%E7%A0%81/piexl-editor/node_modules/.pnpm/tailwindcss@3.4.4/node_modules/tailwindcss/lib/index.js";
import autoprefixer from "file:///Users/allen/Desktop/%E6%97%A5%E5%B8%B8%E4%BB%A3%E7%A0%81/piexl-editor/node_modules/.pnpm/autoprefixer@10.4.19_postcss@8.4.39/node_modules/autoprefixer/lib/autoprefixer.js";
import AutoImport from "file:///Users/allen/Desktop/%E6%97%A5%E5%B8%B8%E4%BB%A3%E7%A0%81/piexl-editor/node_modules/.pnpm/unplugin-auto-import@0.17.6/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///Users/allen/Desktop/%E6%97%A5%E5%B8%B8%E4%BB%A3%E7%A0%81/piexl-editor/node_modules/.pnpm/unplugin-vue-components@0.27.2_vue@3.4.31/node_modules/unplugin-vue-components/dist/vite.js";
import { NaiveUiResolver } from "file:///Users/allen/Desktop/%E6%97%A5%E5%B8%B8%E4%BB%A3%E7%A0%81/piexl-editor/node_modules/.pnpm/unplugin-vue-components@0.27.2_vue@3.4.31/node_modules/unplugin-vue-components/dist/resolvers.js";
var __vite_injected_original_dirname = "/Users/allen/Desktop/\u65E5\u5E38\u4EE3\u7801/piexl-editor";
var vite_config_default = defineConfig(async () => ({
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()]
    }
  },
  plugins: [
    vue(),
    AutoImport({
      imports: [
        "vue",
        {
          "naive-ui": [
            "useDialog",
            "useMessage",
            "useNotification",
            "useLoadingBar"
          ]
        }
      ]
    }),
    Components({
      resolvers: [NaiveUiResolver()]
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 7767,
    strictPort: true,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"]
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvYWxsZW4vRGVza3RvcC9cdTY1RTVcdTVFMzhcdTRFRTNcdTc4MDEvcGlleGwtZWRpdG9yXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvYWxsZW4vRGVza3RvcC9cdTY1RTVcdTVFMzhcdTRFRTNcdTc4MDEvcGlleGwtZWRpdG9yL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9hbGxlbi9EZXNrdG9wLyVFNiU5NyVBNSVFNSVCOCVCOCVFNCVCQiVBMyVFNyVBMCU4MS9waWV4bC1lZGl0b3Ivdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHZ1ZSBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tdnVlXCI7XG5cbmltcG9ydCBwYXRoIGZyb20gJ25vZGU6cGF0aCdcblxuXG5pbXBvcnQgdGFpbHdpbmQgZnJvbSAndGFpbHdpbmRjc3MnXG5pbXBvcnQgYXV0b3ByZWZpeGVyIGZyb20gJ2F1dG9wcmVmaXhlcidcblxuaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSAndW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZSdcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXG5pbXBvcnQgeyBOYWl2ZVVpUmVzb2x2ZXIgfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnMnXG5cbi8vIGV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG5cbi8vIH0pXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKGFzeW5jICgpID0+ICh7XG4gIGNzczoge1xuICAgIHBvc3Rjc3M6IHtcbiAgICAgIHBsdWdpbnM6IFt0YWlsd2luZCgpLCBhdXRvcHJlZml4ZXIoKV0sXG4gICAgfSxcbiAgfSxcbiAgcGx1Z2luczogW3Z1ZSgpLCBBdXRvSW1wb3J0KHtcbiAgICBpbXBvcnRzOiBbXG4gICAgICAndnVlJyxcbiAgICAgIHtcbiAgICAgICAgJ25haXZlLXVpJzogW1xuICAgICAgICAgICd1c2VEaWFsb2cnLFxuICAgICAgICAgICd1c2VNZXNzYWdlJyxcbiAgICAgICAgICAndXNlTm90aWZpY2F0aW9uJyxcbiAgICAgICAgICAndXNlTG9hZGluZ0JhcidcbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfSksXG4gIENvbXBvbmVudHMoe1xuICAgIHJlc29sdmVyczogW05haXZlVWlSZXNvbHZlcigpXVxuICB9KV0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSxcbiAgICB9LFxuICB9LFxuICAvLyBWaXRlIG9wdGlvbnMgdGFpbG9yZWQgZm9yIFRhdXJpIGRldmVsb3BtZW50IGFuZCBvbmx5IGFwcGxpZWQgaW4gYHRhdXJpIGRldmAgb3IgYHRhdXJpIGJ1aWxkYFxuICAvL1xuICAvLyAxLiBwcmV2ZW50IHZpdGUgZnJvbSBvYnNjdXJpbmcgcnVzdCBlcnJvcnNcbiAgY2xlYXJTY3JlZW46IGZhbHNlLFxuICAvLyAyLiB0YXVyaSBleHBlY3RzIGEgZml4ZWQgcG9ydCwgZmFpbCBpZiB0aGF0IHBvcnQgaXMgbm90IGF2YWlsYWJsZVxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiA3NzY3LFxuICAgIHN0cmljdFBvcnQ6IHRydWUsXG4gICAgd2F0Y2g6IHtcbiAgICAgIC8vIDMuIHRlbGwgdml0ZSB0byBpZ25vcmUgd2F0Y2hpbmcgYHNyYy10YXVyaWBcbiAgICAgIGlnbm9yZWQ6IFtcIioqL3NyYy10YXVyaS8qKlwiXSxcbiAgICB9LFxuICB9LFxufSkpO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFvVSxTQUFTLG9CQUFvQjtBQUNqVyxPQUFPLFNBQVM7QUFFaEIsT0FBTyxVQUFVO0FBR2pCLE9BQU8sY0FBYztBQUNyQixPQUFPLGtCQUFrQjtBQUV6QixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGdCQUFnQjtBQUN2QixTQUFTLHVCQUF1QjtBQVhoQyxJQUFNLG1DQUFtQztBQWlCekMsSUFBTyxzQkFBUSxhQUFhLGFBQWE7QUFBQSxFQUN2QyxLQUFLO0FBQUEsSUFDSCxTQUFTO0FBQUEsTUFDUCxTQUFTLENBQUMsU0FBUyxHQUFHLGFBQWEsQ0FBQztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQUMsSUFBSTtBQUFBLElBQUcsV0FBVztBQUFBLE1BQzFCLFNBQVM7QUFBQSxRQUNQO0FBQUEsUUFDQTtBQUFBLFVBQ0UsWUFBWTtBQUFBLFlBQ1Y7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELFdBQVc7QUFBQSxNQUNULFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQztBQUFBLElBQy9CLENBQUM7QUFBQSxFQUFDO0FBQUEsRUFDRixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFJQSxhQUFhO0FBQUE7QUFBQSxFQUViLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLFlBQVk7QUFBQSxJQUNaLE9BQU87QUFBQTtBQUFBLE1BRUwsU0FBUyxDQUFDLGlCQUFpQjtBQUFBLElBQzdCO0FBQUEsRUFDRjtBQUNGLEVBQUU7IiwKICAibmFtZXMiOiBbXQp9Cg==
