/// <reference types="vite/client" />

import type { FUniver } from '@univerjs/facade'

declare global {
  interface Window {
    univerAPI: FUniver
  }
}
