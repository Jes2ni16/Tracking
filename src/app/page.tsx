import Image from "next/image";
import styles from "./page.module.css";
import Head from 'next/head';
export default function Home() {
  return (
    <>  <Head>
    <title>Home Page</title>
    <meta name="description" content="Welcome to the Home Page" />
    <link rel="icon" href="/favicon.ico" />
  </Head>
    <main className={styles.main}>

    <div className={styles.box}>
      <img src="/logo-philsca.png" alt="" className={styles.logo} />
    <h1> PHILSCA MEDELLIN  TRACKING SYSTEM OF ACADEMIC CREDENTIALS</h1>

    <div className={styles.authWrap}>
      <a href="/login" className={styles.login}>Login</a>
      <a href="/register" className={styles.register}>Register</a>
    </div>
    </div>

    </main>
    </>
  );
}
