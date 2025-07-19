// EventEmitter2 shim for wagmi/walletconnect compatibility
export class EventEmitter2 {
  private events: Map<string, Function[]> = new Map()

  on(event: string, listener: Function): this {
    if (!this.events.has(event)) {
      this.events.set(event, [])
    }
    this.events.get(event)!.push(listener)
    return this
  }

  off(event: string, listener?: Function): this {
    if (!this.events.has(event)) return this

    if (!listener) {
      this.events.delete(event)
      return this
    }

    const listeners = this.events.get(event)!
    const index = listeners.indexOf(listener)
    if (index > -1) {
      listeners.splice(index, 1)
    }
    return this
  }

  emit(event: string, ...args: any[]): boolean {
    if (!this.events.has(event)) return false

    const listeners = this.events.get(event)!
    listeners.forEach((listener) => {
      try {
        listener(...args)
      } catch (error) {
        console.error("EventEmitter2 listener error:", error)
      }
    })
    return true
  }

  once(event: string, listener: Function): this {
    const onceWrapper = (...args: any[]) => {
      this.off(event, onceWrapper)
      listener(...args)
    }
    return this.on(event, onceWrapper)
  }

  removeAllListeners(event?: string): this {
    if (event) {
      this.events.delete(event)
    } else {
      this.events.clear()
    }
    return this
  }

  listeners(event: string): Function[] {
    return this.events.get(event) || []
  }

  listenerCount(event: string): number {
    return this.listeners(event).length
  }
}

// Export both named and default for maximum compatibility
export default EventEmitter2
export { EventEmitter2 as EventEmitter }
