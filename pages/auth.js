// pages/auth.js
import { useState } from "react"
import { auth } from "../lib/firebase"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { useRouter } from "next/router"

export default function AuthPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const signup = async () => {
    await createUserWithEmailAndPassword(auth, email, password)
    router.push("/")
  }

  const login = async () => {
    await signInWithEmailAndPassword(auth, email, password)
    router.push("/")
  }

  return (
    <div>
      <h1>Login / Register</h1>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={login}>Login</button>
      <button onClick={signup}>Register</button>
    </div>
  )
}
