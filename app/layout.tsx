import type { Metadata } from 'next'
import { headers } from 'next/headers'
import './globals.css'
import PublicHeader from './(public)/PublicHeader'

export const metadata: Metadata = {
  title: {
    default: 'Barack Mining Investment',
    template: '%s | Barack Mining Investment',
  },
  description: 'Building opportunities. Creating lasting value.',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headersList = await headers()

  const pathname = headersList.get('x-pathname') || '/'

  const isAdminRoute =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/login')

  return (
    <html lang="fr">
      <body>
        {!isAdminRoute && <PublicHeader />}

        <main className={!isAdminRoute ? 'min-h-screen' : 'min-h-screen'}>
          {children}
        </main>
      </body>
    </html>
  )
}