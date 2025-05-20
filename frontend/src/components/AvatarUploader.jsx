import React, { useCallback, useEffect, useRef, useState } from 'react';
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
  Slider,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Cropper from 'react-easy-crop';
import api from '../api/axios';
import { readFile } from '../utils/fileUtils';
import getCroppedImg from '../utils/cropImage';

export default function AvatarUploader({ onUpload }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [blobUrl, setBlobUrl] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cropOpen, setCropOpen] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

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

      if (blobUrl) URL.revokeObjectURL(blobUrl);

      const url = URL.createObjectURL(response.data);
      setPreview(url);
      setBlobUrl(url);
    } catch (err) {
      console.error('Erreur lors de la récupération de l’avatar :', err);
      setPreview(DEFAULT_AVATAR);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageDataUrl = await readFile(file);
    setSelectedImage(imageDataUrl);
    setCropOpen(true);
  };

  const handleCropSave = async () => {
    if (!croppedAreaPixels || !selectedImage) return;

    try {
      const croppedBlob = await getCroppedImg(selectedImage, croppedAreaPixels);

      if (!croppedBlob) {
        console.error('Blob vide généré');
        return;
      }

      const formData = new FormData();
      const fileName = 'avatar.jpg';
      const file = new File([croppedBlob], fileName, { type: 'image/jpeg' });

      formData.append('avatar', file);

      await api.post('/api/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      await fetchAvatar();
      if (onUpload) onUpload();
      setCropOpen(false);
    } catch (err) {
      console.error("Erreur lors de l'envoi de l'avatar :", err);
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
      if (blobUrl) URL.revokeObjectURL(blobUrl);
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

      {/* Delete dialog*/}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>Êtes-vous sûr de vouloir supprimer votre avatar ?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Annuler</Button>
          <Button onClick={handleDeleteAvatar} color="error" autoFocus>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Crop dialog */}
      <Dialog open={cropOpen} maxWidth="sm" fullWidth onClose={() => setCropOpen(false)}>
        <DialogTitle>Recadrer l’image</DialogTitle>
        <DialogContent sx={{ position: 'relative', height: 400 }}>
          <Cropper
            image={selectedImage}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </DialogContent>
        <Box px={3} pt={1}>
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            onChange={(e, z) => setZoom(z)}
            aria-label="Zoom"
          />
        </Box>
        <DialogActions>
          <Button onClick={() => setCropOpen(false)}>Annuler</Button>
          <Button onClick={handleCropSave} variant="contained">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
