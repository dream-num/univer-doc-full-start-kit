/// <reference types="vite/client" />

import type { FUniver } from '@univerjs/presets'

declare global {
  interface Window {
    univerAPI: FUniver
  }
}
