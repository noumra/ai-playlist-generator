'use client'

import dynamic from 'next/dynamic';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { GridColDef } from '@mui/x-data-grid'


const DataGrid = dynamic(
  () => import('@mui/x-data-grid').then(m => m.DataGrid),
  { ssr: false }
);

interface PlaylistTableProps {
  loading: boolean
  songs: any[]
}

const columns: GridColDef[] = [
  { field: 'title', headerName: 'Title', width: 225 },
  { field: 'artist', headerName: 'Artist', width: 225 },
  { field: 'album', headerName: 'Album', width: 225 },
  { field: 'duration', headerName: 'Duration', width: 225 }
]

export default function PlaylistTable({ loading, songs }: PlaylistTableProps) {
  return (
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
  )
}