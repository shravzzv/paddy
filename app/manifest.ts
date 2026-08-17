import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Paddy',
    short_name: 'Paddy',
    description:
      'An offline-first, cross-platform PDF & EPUB reader designed to make reading beautiful, comfortable, and personal.',
    start_url: '/',
    display: 'standalone',
    background_color: '#10131A',
    theme_color: '#10131A',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    screenshots: [
      {
        src: '/screenshots/narrow-1.jpg',
        form_factor: 'narrow',
        sizes: '1080x1350',
      },
      {
        src: '/screenshots/narrow-2.jpg',
        form_factor: 'narrow',
        sizes: '1080x1350',
      },
      {
        src: '/screenshots/narrow-3.jpg',
        form_factor: 'narrow',
        sizes: '1080x1350',
      },
      {
        src: '/screenshots/narrow-4.jpg',
        form_factor: 'narrow',
        sizes: '1080x1350',
      },
      {
        src: '/screenshots/narrow-5.jpg',
        form_factor: 'narrow',
        sizes: '1080x1350',
      },
      {
        src: '/screenshots/wide-1.jpg',
        form_factor: 'wide',
        sizes: '1920x1080',
      },
      {
        src: '/screenshots/wide-2.jpg',
        form_factor: 'wide',
        sizes: '1920x1080',
      },
      {
        src: '/screenshots/wide-3.jpg',
        form_factor: 'wide',
        sizes: '1920x1080',
      },
      {
        src: '/screenshots/wide-4.jpg',
        form_factor: 'wide',
        sizes: '1920x1080',
      },
      {
        src: '/screenshots/wide-5.jpg',
        form_factor: 'wide',
        sizes: '1920x1080',
      },
    ],
  }
}
