import "../styles/globals.css"           // โหลด CSS ที่คุณสร้าง
import usePushSubscription from "../hooks/usePushSubscription"  // โหลด hook ใหม่
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../lib/firebase"
import { useState, useEffect } from "react"

function MyApp({ Component, pageProps }) {
  const { user } = pageProps // สมมติคุณผ่าน user มา
  usePushSubscription(user)
  return <Component {...pageProps} />
}

export default MyApp
