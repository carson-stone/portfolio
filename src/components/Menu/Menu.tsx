import styles from "./styles.module.css"

function Menu() {
  return (
    <nav className={styles.Menu}>
      <section>
        <h2>info</h2>
        <ul>
          <li>about</li>
          <li>resume</li>
          <li>github</li>
          <li>linkedin</li>
          <li>email</li>
        </ul>
      </section>

      <section>
        <h2>work</h2>
        <ul>
          <li>Landis</li>
          <li>project 1</li>
          <li>project 2</li>
          <li>project 3</li>
          <li>skills</li>
        </ul>
      </section>
    </nav>
  )
}

export default Menu
