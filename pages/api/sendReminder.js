// pages/api/sendReminder.js
import { db } from "../../lib/firebase";
import webpush from "web-push";

// โหลดคอนฟิกจาก Environment Variables
const VAPID_PUBLIC  = process.env.VAPID_PUBLIC;
const VAPID_PRIVATE = process.env.VAPID_PRIVATE;
const VAPID_EMAIL   = process.env.VAPID_EMAIL;    // เช่น your@domain.com

webpush.setVapidDetails(
  `mailto:${VAPID_EMAIL}`,
  VAPID_PUBLIC,
  VAPID_PRIVATE
);

export default async function handler(req, res) {
  try {
    const now = new Date();
    const hhmm = now.toTimeString().slice(0, 5);   // “HH:MM”
    const today = now.toISOString().slice(0, 10);  // “YYYY-MM-DD”

    // อ่านตารางการกินยาของวันนี้ ณ เวลานี้
    const snaps = await db
      .collection("medSchedules")
      .where("date", "==", today)
      .where("time", "==", hhmm)
      .get();

    for (const doc of snaps.docs) {
      const { uid, medicineName } = doc.data();
      const userDoc = await db.collection("users").doc(uid).get();
      if (!userDoc.exists || !userDoc.data().notificationsEnabled) continue;

      const subDoc = await db.collection("subscriptions").doc(uid).get();
      if (!subDoc.exists) continue;

      const pushConfig = subDoc.data();
      const payload = JSON.stringify({
        title: "ถึงเวลาทานยาแล้วครับ/ค่ะ",
        body: `ยา: ${medicineName} เวลา ${hhmm}`,
      });

      await webpush.sendNotification(pushConfig, payload);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Reminder error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
