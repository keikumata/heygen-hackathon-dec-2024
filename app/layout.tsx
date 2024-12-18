import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from "@/components/theme-provider"
import { VideoStreamProvider } from '@/app/context/VideoStreamContext';
import { MessageProvider } from './context/MessageContext';
import { ProductProvider } from './context/ProductContext';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Live Shopping Stream',
  description: 'Watch and shop live with our interactive streaming platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <MessageProvider>
            <ProductProvider>
              <VideoStreamProvider>
              {children}
              </VideoStreamProvider>
            </ProductProvider>
          </MessageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

