import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Swiftly',
    short_name: 'Swiftly',
    description: 'Swiftly - Your Campus Delivery Companion',
    start_url: '/login',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#9BDD37',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}