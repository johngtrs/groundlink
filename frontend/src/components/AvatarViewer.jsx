import { useEffect, useRef, useState } from 'react';
import { Avatar, Box, Skeleton } from '@mui/material';
import api from '../api/axios';

const DEFAULT_AVATAR = '/images/default-avatar.jpg';

export default function AvatarViewer({ endpoint, size = 150 }) {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const objectUrlRef = useRef(null);

  useEffect(() => {
    const loadAvatar = async () => {
      try {
        const res = await api.get(`${endpoint}?v=${Date.now()}`, {
          responseType: 'blob',
          validateStatus: (status) => status === 200 || status === 204,
        });

        if (objectUrlRef.current) {
          URL.revokeObjectURL(objectUrlRef.current);
          objectUrlRef.current = null;
        }

        if (res.status === 204) {
          setAvatarUrl(DEFAULT_AVATAR);
          return;
        }

        const url = URL.createObjectURL(res.data);
        objectUrlRef.current = url;
        setAvatarUrl(url);
      } catch (error) {
        console.error('Erreur lors du chargement de l’avatar :', error);
        setAvatarUrl(DEFAULT_AVATAR);
      }
    };

    loadAvatar();

    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, [endpoint]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
      {!avatarUrl ? (
        <Skeleton variant="circular" width={size} height={size} />
      ) : (
        <Avatar src={avatarUrl} alt="Avatar" sx={{ width: size, height: size }} />
      )}
    </Box>
  );
}
