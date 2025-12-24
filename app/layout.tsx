import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "3D Configurator",
  description: "Interactive 3D product configurator powered by Sketchfab",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" suppressHydrationWarning>
      <head>
        {/* Sketchfab Viewer API */}
        <script
          async
          src="https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js"
        />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
