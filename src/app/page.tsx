import WhiteboardCanvas from './component'
import styles from './page.module.css'
import CanvasComponent from "./component";

export default function Home() {
  return (
    <main className={styles.main}>

      <div className={styles.code}>
        <p>Frontend Engineer Take Home Project</p>
      </div>
      
      <div className={styles.center}>
        <CanvasComponent/>
      </div>

    </main>
  )
}