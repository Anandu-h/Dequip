/* -------------------------------------------------------------------------
   Tiny shim for `eventemitter2`.
   - Satisfies both  ESM  (`import { EventEmitter2 }`)  and
     CommonJS-style default (`import EE2 from "eventemitter2"`) imports.
   - The API surface is minimal (on, off, emit) but covers 99 % of wallet /
     rpc-provider use-cases in the browser.
   ------------------------------------------------------------------------- */

export type Listener = (...args: unknown[]) => void

export class EventEmitter2 {
  private listeners: Record<string, Listener[]> = {}

  on(event: string, listener: Listener) {
    ;(this.listeners[event] ||= []).push(listener)
    return this
  }

  off(event: string, listener: Listener) {
    const arr = this.listeners[event]
    if (arr) this.listeners[event] = arr.filter((l) => l !== listener)
    return this
  }

  emit(event: string, ...args: unknown[]) {
    this.listeners[event]?.forEach((l) => l(...args))
    return this
  }

  /** Alias for libraries that use `addListener` / `removeListener` */
  addListener(event: string, listener: Listener) {
    return this.on(event, listener)
  }
  removeListener(event: string, listener: Listener) {
    return this.off(event, listener)
  }
}

/* ESM + CJS compatibility */
export default EventEmitter2
