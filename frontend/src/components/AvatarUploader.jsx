import React, { useEffect, useRef, useState } from 'react';
import { Avatar, Box, IconButton, Skeleton } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import api from '../api/axios';

export default function AvatarUploader({ onUpload }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const fetchAvatar = async () => {
    try {
      const response = await api.get(`/api/profile/avatar?v=${Date.now()}`, {
        responseType: 'blob',
      });

      const blobUrl = URL.createObjectURL(response.data);
      setPreview(blobUrl);
    } catch (err) {
      console.error('Erreur lors de la récupération de l’avatar :', err);
      setPreview('/images/default-avatar.png');
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      await api.post('/api/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      await fetchAvatar();
      if (onUpload) onUpload();
    } catch (err) {
      console.error("Erreur lors de l'upload de l’avatar :", err);
    }
  };

  useEffect(() => {
    fetchAvatar();
  }, []);

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
      {!preview ? (
        <Skeleton variant="circular" width={150} height={150} />
      ) : (
        <Avatar src={preview} alt="Avatar" sx={{ width: 150, height: 150 }} />
      )}

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
