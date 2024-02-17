import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: "/3D-IFC-CO2/",
  plugins: [react()],
});