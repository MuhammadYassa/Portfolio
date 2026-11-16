import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/", // Custom-domain root; project-subpath hosting would need /Portfolio/.
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "production-csp",
      apply: "build",
      transformIndexHtml: {
        order: "pre",
        handler: () => [{
          tag: "meta",
          attrs: {
            "http-equiv": "Content-Security-Policy",
            content: "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'; upgrade-insecure-requests",
          },
          injectTo: "head-prepend",
        }],
      },
    },
  ],
  build: { manifest: true },
});
