import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 載入環境變數
  const env = loadEnv(mode, '.', '');
  
  return {
    plugins: [react()],
    // 設定為相對路徑 './' 以支援 GitHub Pages 的非根目錄部署
    base: './',
    define: {
      // 將 process.env.API_KEY 替換為實際的 Key 字串
      // 這樣前端程式碼中的 process.env.API_KEY 就能讀取到 GitHub Secrets 的值
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});