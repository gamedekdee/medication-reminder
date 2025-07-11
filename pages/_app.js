import "../styles/globals.css"
import usePushSubscription from "../hooks/usePushSubscription"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../lib/firebase"
import { useState, useEffect } from "react"

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null)
  useEffect(() => onAuthStateChanged(auth, u => setUser(u)), [])
  usePushSubscription(user)

  return <Component {...pageProps} user={user} />
}

export default MyApp
