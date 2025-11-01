import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navigation-bar'
import '@workspace/ui/globals.css'

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="container mx-auto">
      <Navbar />
      <main>
        {children}
        <Footer />
      </main>
    </div>
  )
}
