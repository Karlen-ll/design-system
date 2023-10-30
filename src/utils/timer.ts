export class Timer {
  private readonly callback: () => void
  private readonly delay: number

  private timerId?: NodeJS.Timeout | number
  private startTime: number
  private remaining: number

  constructor(callback: () => void, delay: number = 0) {
    this.callback = callback
    this.delay = delay
    this.remaining = delay
    this.startTime = Date.now()

    this.resume()
  }

  public pause() {
    this.clearTimeout()
    this.remaining -= Date.now() - this.startTime
  }

  public resume() {
    if (this.timerId) {
      return
    }

    this.startTime = Date.now()
    this.timerId = setTimeout(this.callback, this.remaining)
  }

  public restart() {
    this.clearTimeout()
    this.remaining = this.delay

    this.resume()
  }

  private clearTimeout() {
    clearTimeout(this.timerId)
    this.timerId = undefined
  }
}
