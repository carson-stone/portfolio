import { useMemo, useState } from 'react'
import { Terminal as TerminalController } from "@/services"
import TerminalPrompt from './TerminalPrompt/TerminalPrompt'

import styles from "./styles.module.css"

function Terminal() {
  const terminal = useMemo(
    () => (new TerminalController("guest", "carson.is")),
    []
  )

  // useEffect(() => {

  // })

  return (
    <div className={styles.Terminal}>
      <TerminalPrompt terminal={terminal} />
    </div>
  )
}

export default Terminal;
