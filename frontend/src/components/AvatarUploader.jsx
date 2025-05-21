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
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import Cropper from 'react-easy-crop';
import api from '../api/axios';
import { readFile } from '../utils/fileUtils';
import getCroppedImg from '../utils/cropImage';

const DEFAULT_AVATAR = '/images/default-avatar.jpg';

export default function AvatarUploader({ onUpload }) {
  const inputRef = useRef(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [objectUrl, setObjectUrl] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const loadAvatar = async () => {
    try {
      const res = await api.get(`/api/profile/avatar?v=${Date.now()}`, {
        responseType: 'blob',
        validateStatus: (status) => status === 200 || status === 204,
      });

      if (objectUrl) URL.revokeObjectURL(objectUrl);

      if (res.status === 204) {
        setAvatarUrl(DEFAULT_AVATAR);
        return;
      }

      const url = URL.createObjectURL(res.data);
      setAvatarUrl(url);
      setObjectUrl(url);
    } catch (error) {
      console.error('Erreur lors du chargement de l’avatar :', error);
      setAvatarUrl(DEFAULT_AVATAR);
    }
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageDataUrl = await readFile(file);
    setSelectedImage(imageDataUrl);
    setIsCropOpen(true);
  };

  const handleCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCropSave = async () => {
    if (!selectedImage || !croppedAreaPixels) return;

    try {
      const croppedBlob = await getCroppedImg(selectedImage, croppedAreaPixels);
      const file = new File([croppedBlob], 'avatar.jpg', { type: 'image/jpeg' });
      const formData = new FormData();
      formData.append('avatar', file);

      await api.post('/api/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      await loadAvatar();
      if (onUpload) onUpload();
      setIsCropOpen(false);
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'avatar :", error);
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      await api.delete('/api/profile/avatar');
      await loadAvatar();
      if (onUpload) onUpload();
    } catch (error) {
      console.error('Erreur lors de la suppression de l’avatar :', error);
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  useEffect(() => {
    loadAvatar();
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
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
        {!avatarUrl ? (
          <Skeleton variant="circular" width={150} height={150} />
        ) : (
          <Avatar src={avatarUrl} alt="Avatar" sx={{ width: 150, height: 150 }} />
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
          <IconButton
            color="primary"
            onClick={() => inputRef.current?.click()}
            aria-label="Télécharger un avatar"
          >
            <PhotoCameraIcon sx={{ color: '#fff' }} />
          </IconButton>
          <input type="file" accept="image/*" hidden ref={inputRef} onChange={handleImageSelect} />
        </Box>
      </Box>

      {avatarUrl && avatarUrl !== DEFAULT_AVATAR && (
        <Button
          variant="outlined"
          size="small"
          sx={{ mt: 1 }}
          onClick={() => {
            document.activeElement.blur();
            setIsDeleteDialogOpen(true);
          }}
        >
          Supprimer l’image
        </Button>
      )}

      {/* Dialog suppression */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Êtes-vous sûr de vouloir supprimer votre avatar ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleDeleteAvatar} color="error" autoFocus>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de recadrage */}
      <Dialog
        open={isCropOpen}
        onClose={() => setIsCropOpen(false)}
        fullWidth
        maxWidth="sm"
        aria-labelledby="crop-dialog-title"
      >
        <DialogTitle id="crop-dialog-title">Recadrer l’image</DialogTitle>
        <DialogContent sx={{ height: 400, position: 'relative' }}>
          <Cropper
            image={selectedImage}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </DialogContent>
        <Box px={3} pt={1}>
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            onChange={(e, value) => setZoom(value)}
            aria-label="Zoom"
          />
        </Box>
        <DialogActions>
          <Button onClick={() => setIsCropOpen(false)}>Annuler</Button>
          <Button onClick={handleCropSave} variant="contained">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
