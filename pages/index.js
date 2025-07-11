// pages/index.js
import { useEffect, useState } from "react"
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore"
import { useRouter } from "next/router"

export default function Home({ user }) {
  const router = useRouter()
  const [schedules, setSchedules] = useState([])
  const [notifEnabled, setNotifEnabled] = useState(true)

  useEffect(() => {
    if (!user) return router.push("/auth")
    // โหลด flag
    (async () => {
      const userDoc = await getDocs(doc(db, "users", user.uid))
      setNotifEnabled(userDoc.data().notificationsEnabled ?? true)
    })()
    // โหลดตารางวันนี้
    const today = new Date().toISOString().slice(0, 10)
    getDocs(query(collection(db, "medSchedules"), where("uid", "==", user.uid), where("date", "==", today)))
      .then(qs => setSchedules(qs.docs.map(d => d.data())))
  }, [user])

  const toggle = async () => {
    await updateDoc(doc(db, "users", user.uid), { notificationsEnabled: !notifEnabled })
    setNotifEnabled(!notifEnabled)
  }

  return (
    <div>
      <h1>Medication Reminder</h1>
      <button onClick={toggle}>
        {notifEnabled ? "ปิดแจ้งเตือน" : "เปิดแจ้งเตือน"}
      </button>
      <ul>
        {schedules.map(s => (
          <li key={s.id}>{s.time} — {s.medicineName}</li>
        ))}
      </ul>
    </div>
  )
}
