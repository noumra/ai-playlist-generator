'use client'

import Grid from '@mui/material/Grid'
import { FaSpotify } from 'react-icons/fa'
import { SiOpenai } from 'react-icons/si'
import { signIn } from 'next-auth/react'
import { Button } from 'antd'
import { Typography, Tooltip } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'

export default function Login() {
  return (
    <Grid 
      container 
      sx={{ height: '100vh',          
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#121212',
        width: '100%',
        textAlign: 'center',}}>
      <Grid size={12} sx={{ color: 'white', textAlign: 'center' }}>
        <h1 style={{ margin: 5, color: 'white', fontSize: '2.5rem', fontWeight: 'bold' }}>
          Spotify Playlist Generator <FaSpotify color="#1DB954" />
        </h1> 
        <p style={{ margin: 0.5, color: '#b3b3b3' }}>
          Generate playlists from your favorite songs through OpenAI <SiOpenai color="#10A37F" /> ChatGPT

        </p>
      </Grid>
      <Grid size={12} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button 
          style={{
            backgroundColor: '#1DB954',
            borderColor: '#1DB954',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            fontWeight: 'bold',
            borderRadius: '999px', 
            }} 
          onClick={() => signIn()}>Sign in Spotify
        </Button>
      </Grid>
    </Grid>
  )
}

