'use client'

import { useSession } from 'next-auth/react'
import Login from "./components/Login"
import Main from './components/Main'

export default function Home() {
  const { data: session, status } = useSession()
  if (status !== "authenticated") return <Login />
  return <Main />
}