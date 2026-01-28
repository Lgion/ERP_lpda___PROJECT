import Image from "next/image";
import styles from "./page.module.css";
import Link from 'next/link';

export default function Home() {
  return (
    <div className={styles.page}>
      <Link key="home_link" href="/gestomag">Gestomag</Link>
    </div>
  );
}
