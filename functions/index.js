const functions = require("firebase-functions")
const admin = require("firebase-admin")
const webpush = require("web-push")

admin.initializeApp()
const db = admin.firestore()

// กำหนด VAPID keys (generate จาก web-push CLI)
webpush.setVapidDetails(
  "gamedekdee05@gmail.com",
  "<BIWCIuO9Trnh9cqOHvY_WbJzZ9Yvp15aeharDVhrX8bGTa6dcUywAyki3lBRRlz2bLW6wWAKZwQwK92DYhR38-A>",
  "<nutyyMVcUGllyD5sAR_0mWbP4Zdsg_BuOCcE412iC3s>"
)

exports.sendMedicationReminder = functions.pubsub
  .schedule("every 5 minutes")
  .onRun(async () => {
    const now = new Date()
    const hhmm = now.toTimeString().slice(0,5)   // “HH:MM”
    const today = now.toISOString().slice(0,10)  // “YYYY-MM-DD”

    // ดึงตารางช่วงเวลาที่ตรงกับตอนนี้
    const snaps = await db.collection("medSchedules")
      .where("date","==",today)
      .where("time","==",hhmm)
      .get()

    for (const doc of snaps.docs) {
      const { uid, medicineName } = doc.data()
      const userDoc = await db.collection("users").doc(uid).get()
      if (!userDoc.data().notificationsEnabled) continue
      const subDoc = await db.collection("subscriptions").doc(uid).get()
      if (!subDoc.exists) continue

      const pushConfig = subDoc.data()
      const payload = JSON.stringify({
        title: "ถึงเวลาทานยาแล้วครับ/ค่ะ",
        body: `ยา: ${medicineName} เวลา ${hhmm}`,
      })

      try {
        await webpush.sendNotification(pushConfig, payload)
      } catch (e) {
        console.error("Push failed", e)
      }
    }
  })
