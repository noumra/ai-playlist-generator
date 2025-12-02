'use server'

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import axios from 'axios'

export const create_playlist = async (playlistname:string, songs:any) => {
    const songsdata = encodeURIComponent(JSON.stringify({songs: songs}))
    const session = await getServerSession(authOptions)
    console.log("session in create_playlist")
    console.log(session)
    const username = session?.user.name
    const token = session?.user.access_token

    try {
        if (playlistname && songsdata) {
            const response = await axios.post(`https://api.spotify.com/v1/me/playlists`,
        {
          name: playlistname,
          public: true,
        },{
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
      })

      
      const playlist_id = response.data.id
      const track_uris: string[] = []
      const data = await JSON.parse(decodeURIComponent(songsdata))

      // Normalizer 
      const normalizeSearchString = (str: string) =>
        str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[’′]/g, "'")
            .replace(/[:(),]/g, " ")
            .replace(/\s+/g, " ")
            .trim()

      // Search for the songs on Spotify
      const requests = data.songs.map( async (song:any) => {
        const title = normalizeSearchString(song.title)
        const artist = normalizeSearchString(song.artist)

        const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(title)}%20artist:${encodeURIComponent(artist)}&type=track`
        console.log(`get track: ${url}`)
        try {
            const response = await axios.get(url,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            )


            console.log(`Track URI: ${response.data.tracks.items[0].uri}`)
            const track_uri = response.data.tracks.items[0].uri
            track_uris.push(track_uri)
            return response

        } catch (error:any) {
            const message = `Error finding a track from Spotify: ${song.title} ${song.album} ${song.artist}`
            console.log(message)
            console.log(error.message)
            return {success: false, message: `${message} ${error.message}`}
        }
        })
        // Wait for all the search requests to finish, then add the tracks to the new playlist
        await Promise.all(requests)
        console.log(`tracks: ${track_uris}`, Array.isArray(track_uris))
        await axios.post(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
            {
              uris: track_uris,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          )
        console.log(`New Spotify Playlist ${playlistname} created!`)
        return { success: true, message: `New Spotify Playlist ${playlistname} created!` }
        } else {
            console.log('Playlist or songs are empty!')
            return { successful: false, message: 'Playlist or songs are empty!' }
        }
    } catch (error:any) {
        console.log('Error creating a playlist to Spotify')
        console.log(error.message)

        return { successful: false, message: `Error creating a playlist to Spotify: ${error.message}`}
    }
}
