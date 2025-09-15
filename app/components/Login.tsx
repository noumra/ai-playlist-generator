'use client'

import Grid from '@mui/material/Grid'
import { Button } from '@mui/material'
import { FaSpotify } from 'react-icons/fa'

export default function Login() {
  return (
    <Grid container sx={{ gap: 2, flexDirection: 'column', 
        alignItems: 'center'}}>
      <Grid size={12} sx={{ display: 'flex', justifyContent: 'center' }}>
        <h1>
          Spotify Playlist Generator <FaSpotify color="green" />
        </h1>
      </Grid>
      <Grid size={12} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button variant="outlined">Sign in Spotify</Button>
      </Grid>
    </Grid>
  )
}