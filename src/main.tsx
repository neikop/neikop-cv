import App from "App"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "@rainbow-me/rainbowkit/styles.css"
import "index.css"
import "App.scss"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
