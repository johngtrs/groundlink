import React, { useEffect, useRef, useState } from 'react';
import {
  Avatar,
  Box,
  IconButton,
  Skeleton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import api from '../api/axios';

export default function AvatarUploader({ onUpload }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [blobUrl, setBlobUrl] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const DEFAULT_AVATAR = '/images/default-avatar.jpg';

  const fetchAvatar = async () => {
    try {
      const response = await api.get(`/api/profile/avatar?v=${Date.now()}`, {
        responseType: 'blob',
        validateStatus: (status) => status === 200 || status === 204,
      });

      if (response.status === 204) {
        setPreview(DEFAULT_AVATAR);
        return;
      }

      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }

      const url = URL.createObjectURL(response.data);
      setPreview(url);
      setBlobUrl(url);
    } catch (err) {
      console.error('Erreur lors de la récupération de l’avatar :', err);
      setPreview(DEFAULT_AVATAR);
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

  const handleDeleteAvatar = async () => {
    try {
      await api.delete('/api/profile/avatar');
      await fetchAvatar();
      if (onUpload) onUpload();
      setBlobUrl(null);
    } catch (err) {
      console.error('Erreur lors de la suppression de l’avatar :', err);
    } finally {
      setConfirmOpen(false);
    }
  };

  useEffect(() => {
    fetchAvatar();

    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box
        sx={{
          position: 'relative',
          width: 150,
          height: 150,
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

      {blobUrl && (
        <Button onClick={() => setConfirmOpen(true)} variant="outlined" size="small" sx={{ mt: 1 }}>
          Supprimer l’image
        </Button>
      )}

      <Dialog
        open={confirmOpen}
        disableRestoreFocus
        onClose={() => setConfirmOpen(false)}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            Êtes-vous sûr de vouloir supprimer votre avatar ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="primary">
            Annuler
          </Button>
          <Button onClick={handleDeleteAvatar} color="error" autoFocus>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
