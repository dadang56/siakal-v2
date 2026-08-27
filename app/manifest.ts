import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SIAKAL V2 - Ketarunaan & Alumni',
    short_name: 'SIAKAL V2',
    description: 'Sistem Informasi Akademik Ketarunaan dan Alumni Politeknik Transportasi SDP Palembang',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#38bdf8',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
