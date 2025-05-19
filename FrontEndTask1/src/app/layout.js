import './globals.css'

export const metadata = {
  title: 'Collaborative Editor',
  description: 'Real-time collaborative text editor',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}