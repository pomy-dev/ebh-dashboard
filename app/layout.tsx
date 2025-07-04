import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Layout from '@/components/layout/Layout'
import { AppProvider } from '@/context/appData';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Naku eKhaya',
  description: 'Professional property management dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <AppProvider>

        <body className={inter.className}>
          <Layout>
            {children}
          </Layout>
        </body>
      </AppProvider>
    </html>
  )
}