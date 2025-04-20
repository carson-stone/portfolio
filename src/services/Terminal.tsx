import {Terminal as XTerminal} from "@xterm/xterm"

export class Terminal {
  private username: string;
  private host: string;
  private xterm: XTerminal | null = null
  private line = ''

  constructor(
    username: string,
    host: string
  ) {
    this.username = username
    this.host = host
  }

  write(input: string) {
    if (!this.xterm) {
      return
    }

    this.xterm.write(input)
  }

  writeln(input: string, withSessionInfo = true) {
    if (!this.xterm) {
      return
    }

    this.xterm.writeln(input)

    if (withSessionInfo) {
      this.writeSessionInfo()
    }
  }

  writeSessionInfo() {
    this.write(`${this.username}@\x1B[1;3;31m${this.host}\x1B[0m $ `)
  }

  open(element: HTMLElement) {
    if (this.xterm) {
      return
    }

    this.xterm = new XTerminal({
      cursorBlink: true
    });
    this.xterm.open(element)
    this.writeSessionInfo()

    this.xterm.onKey(({key, domEvent}) => {
      this.handleInput(key, domEvent)
    })

    this.xterm.focus()
  }

  handleInput(key: string, domEvent: KeyboardEvent) {
    switch (domEvent.key) {
      case 'Backspace': {
        if (!this.xterm) {
          return
        }

        this.write('\x1b[D\x1b[P')
        this.line = this.line.slice(0, this.line.length - 1)
        break
      }
      case 'Enter': {
        this.writeln('', false)
        const commandExecuted = this.handleCommand()

        if (!commandExecuted) {
          this.writeSessionInfo()
        }

        this.line = ''
        break
      }
      default: {
        this.line = `${this.line}${key}`
        this.write(key)
      }
    }
  }

  handleCommand(): boolean {
    if (this.line === 'ls') {
      this.writeln('LS RESULT')
      return true
    }

    return false
  }

  close() {
    if (!this.xterm) {
      return
    }

    this.xterm.dispose()
    this.xterm = null
  }

  cwd() {
    return this.write("~")
  }
}
