import { Menu } from "@/components/Menu"
import { Terminal } from "@/components/Terminal"

import styles from "./styles.module.css"

export default function Home() {
  return (
    <div className={styles.Home}>
      <Menu />
      <Terminal />
    </div>
  )
}
