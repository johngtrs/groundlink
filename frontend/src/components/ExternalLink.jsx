import { Link, Typography } from '@mui/material';
import React from 'react';

export default function ExternalLink({ url }) {
  if (!url) return null;

  return (
    <Link href={url} target="_blank" rel="noopener noreferrer">
      {url}
    </Link>
  );
}
