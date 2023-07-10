import type { Terminal } from "@/services"
import { ChangeEvent, useEffect, useRef, useState } from "react";

import styles from "./styles.module.css"

interface Props {
  terminal: Terminal;
}

function TerminalPrompt({ terminal }: Props) {
  const inputElement = useRef<HTMLInputElement>(null)
  const caretElement = useRef<HTMLDivElement>(null)
  const [inputValue, setInputValue] = useState("")

  useEffect(() => {
    if (inputElement.current) {
      inputElement.current.focus()
    }
  }, [inputElement])

  function handleInput(e: ChangeEvent<HTMLInputElement>) {
    if (!inputElement.current || !caretElement.current) {
      return
    }

    const inputTextLength = e.target.value.length
    const inputTextFontSizeString = window
      .getComputedStyle(inputElement.current)
      .getPropertyValue('font-size')
    const inputTextFontSize = parseFloat(inputTextFontSizeString)
    caretElement.current.style.left = `${(inputTextLength ) * (inputTextFontSize)}px`

    const { value } = e.target
    setInputValue(value)
  }

  return (
    <div className={styles.TerminalPrompt}>
      <p>
        <span><i>{terminal.username}</i></span>
        <span>
          @
          <i>{terminal.host}</i>
          :
        </span>
        <span><i>{terminal.cwd()}</i></span>
        <span>$</span>
      </p>

      <div className={styles.TerminalPrompt__input}>
        <input
          type="text"
          ref={inputElement}
          value={inputValue}
          onChange={handleInput}
        />

        <div
          ref={caretElement}
          className={styles.TerminalPrompt__caret}
        />
      </div>
    </div>
  )
}

export default TerminalPrompt
