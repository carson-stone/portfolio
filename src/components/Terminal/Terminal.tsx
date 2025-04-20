import { useState, useRef, useEffect } from 'react'
import { Terminal as TerminalController } from "@/services"

import styles from "./styles.module.css"

function Terminal() {
  const [terminalController] = useState(
    () => (new TerminalController("guest", "carson.is"))
  )
 const terminalElement = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (terminalElement.current) {
      terminalController.open(terminalElement.current);
    }

    return () => terminalController.close()
  },[terminalController])


  return (
    <div className={styles.Terminal}>
      <div ref={terminalElement} />
    </div>
  )
}

export default Terminal;
