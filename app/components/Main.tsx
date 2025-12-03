'use client'

import { useState } from "react"
import { FaSpotify } from "react-icons/fa"
import { useSession, signOut} from 'next-auth/react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { get_songs } from "../lib/chatgpt"
import { create_playlist } from "../lib/spotify"

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Button, Input, Select } from 'antd'


import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

const columns: GridColDef[] = [
    { field: 'title', headerName: 'Title', width: 225},
    { field: 'artist', headerName: 'Artist', width: 225},
    { field: 'album', headerName: 'Album', width: 225},
    { field: 'duration', headerName: 'Duration', width: 225}

]

const { Option } = Select;


export default function Main() {
    const [loading, setLoading] = useState(false)
    const [songs, setSongs] = useState([])
    const [count, setCount] = useState("10")
    const [statement, setStatement] = useState("I want a playlist like...")
    const { data: session } = useSession()

    // hooks for state management
    const handleChangeValue = (value: string) => {
        setCount(value)
    }
    
    const handleChangeStatement = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setStatement(e.target.value)
    }

    const generate = () => {
      if (loading) {
        toast.error("Error: Generate is already in progress!")
      } else {
        setLoading(true)
        setSongs([])
        fetchSongs()
      }
    }

    // Fetching songs from openai
    const fetchSongs = async () => {
      const songsData = await get_songs(count,statement)
      if (songsData.success !== true) {
        toast.error(songsData.message)
      } else {
        try {
          if (songsData.songs) {
            const data = JSON.parse(songsData.songs)
            setSongs(data.songs)
          } else {
            toast.error("No songs returned from ChatGPT")
          }
        } catch(error:any) {
          toast.error(error)
        }
      }
      setLoading(false)
    }

      // creating playlist through axios
    const createPlaylist = async () => {
      if (songs.length == 0) {
        toast.error("Error: No songs!")
      } else {
        const username = session && session.user?.name || 'unknown'
        if (username === 'unknown'){
          toast.error("Error: Username unknown!")
        } else {
          toast("Creating a playlist please wait...")
          const data = await create_playlist(statement, songs)
          console.log(data)
          if (data.success === true) {
            toast(data.message)
          } else {
            toast.error(data.message)
          }
        }
      }
    }
    
    

    return (
  <Box
    sx={{
      minHeight: '100vh',            
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',      
      alignItems: 'center',           
      gap: 3,                         
      backgroundColor: '#121212',
      padding: 2,                  
    }}
  >
  <Box textAlign="center">
    <Typography
      variant="h4"
      sx={{
        color: 'white',
        fontWeight: 'bold',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 1,
      }}
    >
      Spotify Playlist Generator <FaSpotify color="#1DB954" />
    </Typography>
    <Typography variant="body1" sx={{ color: '#b3b3b3' }}>
      Signed in as: {session?.user?.name || 'unknown'}
    </Typography>
  </Box>
  <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
  <Input
      style={{ width: 500 }}
      placeholder="Eg: Dinner party music with friends"
      onChange={handleChangeStatement}
    />
  <Select
  value={count}
  onChange={handleChangeValue}
  style={{ minWidth: 120, color: 'grey', backgroundColor: '#fffbfbff', }}
  popupStyle={{ backgroundColor: '#ffffffff', color: 'white' }} 
  >
    <Option value={10}>10</Option>
    <Option value={20}>20</Option>
    <Option value={30}>30</Option>
    <Option value={50}>50</Option>
  </Select>
  </Box>
  <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
    <Button className="spotify-button" onClick={() => generate()}>
      Generate
    </Button>
    <Button className="spotify-button" onClick={() => createPlaylist()}>
      Create a playlist
    </Button>
    <Button className="spotify-button" onClick={() => signOut()}>
      Sign out Spotify
    </Button>
  </Box>
  <Box display="flex" justifyContent="center" mt={2}>
    {loading ? (
      <Typography color="white">Generating playlist, please wait...</Typography>
    ) : (
      <div style={{ height: '400px', width: '800px' }}>
        <DataGrid
          rows={songs}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10, 20, 30]}
        />
      </div>
    )}
  </Box>
  <ToastContainer />
</Box>
)
}

