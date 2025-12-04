'use client'

import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import Login from "./components/Login"
import { Spin } from 'antd'

const Main = dynamic(() => import('./components/Main'), {
  ssr: false,
  loading: () => (
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
})

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