import React, { useRef, useState } from 'react';
import { Avatar, Box, IconButton } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import api from '../api/axios';

export default function AvatarUploader({ avatarUrl, onUpload }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(avatarUrl);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const { data } = await api.post('/api/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setPreview(data.avatar);
      if (onUpload) onUpload(data.avatar);
    } catch (err) {
      console.error('Erreur de l’upload :', err);
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: 150,
        height: 150,
        mx: 'auto',
        '&:hover .overlay': { opacity: 1 },
      }}
    >
      <Avatar src={preview} sx={{ width: 150, height: 150 }} />
      <Box
        className="overlay"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 150,
          height: 150,
          bgcolor: 'rgba(0,0,0,0.5)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0,
          transition: 'opacity 0.3s',
        }}
      >
        <IconButton color="primary" onClick={() => inputRef.current?.click()}>
          <PhotoCamera sx={{ color: '#fff' }} />
        </IconButton>
        <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleImageChange} />
      </Box>
    </Box>
  );
}
