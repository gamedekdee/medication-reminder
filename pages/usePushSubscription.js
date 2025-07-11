import { useEffect, useState } from "react"
import { db } from "../lib/firebase"
import { doc, setDoc } from "firebase/firestore"

export default function usePushSubscription(user) {
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    if (!user) return
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return

    navigator.serviceWorker.ready.then(async reg => {
      const sub = await reg.pushManager.getSubscription()
      if (sub) {
        setSubscribed(true)
        return
      }
      // สมัครใหม่
      const newSub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array("<YOUR_VAPID_PUBLIC_KEY>")
      })
      // เซฟใน Firestore
      await setDoc(doc(db, "subscriptions", user.uid), {
        endpoint: newSub.endpoint,
        keys: newSub.toJSON().keys
      })
      setSubscribed(true)
    })
  }, [user])
  
  return { subscribed }
}

// Helper แปลง VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)))
}
