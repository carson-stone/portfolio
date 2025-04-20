import {Terminal as XTerminal} from "@xterm/xterm"

const BACKSPACE_SEQ = '\x1b[D\x1b[P'
const CHANGE_TEXT_TO_RED_SEQ = '\x1B[1;3;31m'
const CHANGE_TEXT_TO_BLUE_SEQ = '\x1B[1;3;34m'
const CHANGE_TEXT_TO_WHITE_SEQ = '\x1B[0m'

enum Commands {
  LS = 'ls',
  CD = 'cd',
}

interface Directory extends Record<string, Directory> {}

export class Terminal {
  private username: string;
  private host: string;
  private xterm: XTerminal | null = null
  private line = ''
  private rootDir: Directory = {
    '~': {
      'contact': {},
      'about': {
        'education': {}
      }
    }
  }
  private cwd = {
    name: "~",
    dir: this.rootDir["~"]
  }

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
    this.write(`${this.username}@${CHANGE_TEXT_TO_RED_SEQ}${this.host}${CHANGE_TEXT_TO_WHITE_SEQ}:${CHANGE_TEXT_TO_BLUE_SEQ}${this.cwd.name}${CHANGE_TEXT_TO_WHITE_SEQ} $ `)
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

        if (this.line.length === 0) {
          return
        }

        this.line = this.line.slice(0, this.line.length - 1)
        this.write(BACKSPACE_SEQ)
        break
      }
      case 'Enter': {
        this.writeln('', false)

        if (this.line.trim() === '') {
          this.writeSessionInfo()
        } else {
          this.handleCommand()
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

  handleCommand(): void {
    const {command, args} = this.parseLine()

    switch (command) {
      case Commands.LS: {
        const targetDirArg = args[1]

        const targetDir: Directory | undefined = targetDirArg
          ? this.cwd.dir[targetDirArg]
          : this.cwd.dir

        if (!targetDir) {
          this.writeln(`ls: ${targetDirArg}: No such file or directory`)
          break
        }

        // is file
        if (
          targetDirArg &&
          Object.values(this.cwd.dir[targetDirArg]).length === 0
        ) {
          this.writeln(`ls: ${targetDirArg}`)
          break
        }

        const items = Object.keys(targetDir)

        this.write(
          items
            .map(
              item => Object.values(targetDir[item]).length > 0
                // show that the item is a directory
                ? `${CHANGE_TEXT_TO_BLUE_SEQ}${item}${CHANGE_TEXT_TO_WHITE_SEQ}`
                : item
            )
            .join('  ')
        )

        this.writeln('')
        break
      }
      case Commands.CD: {
        const targetDirArg = args[1]

        if (!(targetDirArg in this.cwd.dir)) {
          this.writeln(`no such file or directory: ${targetDirArg}`)
          break
        }

        if (Object.values(this.cwd.dir[targetDirArg]).length === 0) {
          this.writeln(`cd: not a directory: ${targetDirArg}`)
          break
        }

        this.cwd = {
          name: targetDirArg,
          dir: this.cwd.dir[targetDirArg]
        }

        this.writeSessionInfo()

        break
      }
      default: {
        this.writeln(`command not found: ${args[0]}`)
        break
      }
    }
  }

  parseLine(): { command: Commands | null; args: string[]; } {
    const line = this.line.trim()
    const args = line
      .split(" ").map(arg => arg.trim())
      .filter(Boolean)
    const command = args[0]
    const isKnownCommand = Object.values(Commands)
      .find(knownCommand => knownCommand === command)

    return {
      command: isKnownCommand ? command as Commands : null,
      args
    }
  }

  close() {
    if (!this.xterm) {
      return
    }

    this.xterm.dispose()
    this.xterm = null
  }
}
