// hooks/usePushSubscription.js
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function usePushSubscription(user) {
  const [subscribed, setSubscribed] = useState(false);
  useEffect(() => {
    if (!user) return;
    navigator.serviceWorker.ready.then(async reg => {
      const sub = await reg.pushManager.getSubscription();
      if (sub) { setSubscribed(true); return; }
      const newSub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.VAPID_PUBLIC)
      });
      await setDoc(doc(db, "subscriptions", user.uid), newSub.toJSON());
      setSubscribed(true);
    });
  }, [user]);
  return { subscribed };
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
}
