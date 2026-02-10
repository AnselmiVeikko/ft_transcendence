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
	  port: 8443,
      clientPort: 443,    // The browser is visiting port 443, not 8443
    },
  }
});