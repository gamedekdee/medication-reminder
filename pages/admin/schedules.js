// pages/admin/schedules.js
import { useState, useEffect } from "react"
import { db } from "../../lib/firebase"
import { collection, addDoc, getDocs } from "firebase/firestore"

export default function SchedulesAdmin() {
  const [uid, setUid] = useState("")
  const [time, setTime] = useState("")
  const [medName, setMedName] = useState("")
  const [list, setList] = useState([])

  useEffect(() => {
    getDocs(collection(db, "medSchedules")).then(qs => setList(qs.docs.map(d => ({ id: d.id, ...d.data() }))))
  }, [])

  const add = async () => {
    await addDoc(collection(db, "medSchedules"), {
      uid, date: new Date().toISOString().slice(0, 10),
      time, medicineName: medName
    })
    // ... refresh list
  }

  return (
    <>
      <h1>Admin: MedSchedules</h1>
      <input placeholder="User UID" onChange={e=>setUid(e.target.value)} />
      <input type="time" onChange={e=>setTime(e.target.value)} />
      <input placeholder="Medicine Name" onChange={e=>setMedName(e.target.value)} />
      <button onClick={add}>Add</button>
      <ul>
        {list.map(item => <li key={item.id}>{item.uid} – {item.date} {item.time} {item.medicineName}</li>)}
      </ul>
    </>
  )
}
