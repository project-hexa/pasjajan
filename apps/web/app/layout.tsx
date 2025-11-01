import { ThemeProviders } from '@/components/theme-providers'
import '@workspace/ui/globals.css'
import { Poppins } from 'next/font/google'

const fontSans = Poppins({
  weight: ['300'],
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`font-sans ${fontSans.variable} antialiased h-screen w-screen  overflow-y-auto`}
      >
        <ThemeProviders>{children}</ThemeProviders>
      </body>
    </html>
  )
}
