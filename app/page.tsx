'use client'

import { useSession } from 'next-auth/react'
import Login from "./components/Login"
import Main from './components/Main'
import { Spin } from 'antd'

export default function Home() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212',
      }}>
        <Spin size="large" />
      </div>
    )
  }

  if (status !== "authenticated") return <Login />
  return <Main />
}