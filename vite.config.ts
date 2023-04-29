import solid from "solid-start/vite"
import { defineConfig } from "vite"
import UnoCSS from "unocss/vite"

export default defineConfig({
  plugins: [
    solid({
      solid: { hydratable: true },
      adapter: "solid-start-static",
    }),
    UnoCSS(),
    {
      name: "configure-response-headers",
      configureServer: (server) => {
        server.middlewares.use((_req, res, next) => {
          res.setHeader("Cross-Origin-Embedder-Policy", "require-corp")
          res.setHeader("Cross-Origin-Opener-Policy", "same-origin")
          next()
        })
      },
    },
  ],
})
