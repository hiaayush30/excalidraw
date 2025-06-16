import "@repo/auth/nextAuthTypes";
// or explicitly mention it in tsconfig.json of web
// "compilerOptions": {
// "types": ["next-auth", "@repo/auth/types/next-auth"]
// }

import { Geist, Geist_Mono } from "next/font/google"

import "@repo/ui/globals.css"
import { Providers } from "@/components/providers"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
