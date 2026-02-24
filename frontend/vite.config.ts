import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
	host: 'localhost',
    port: 5173,      // Match what Nginx is looking for
    strictPort: true,
    hmr: {
	  host: 'localhost',
      clientPort: 8443,    // The browser is visiting port 8443, not 443
    },
  }
});