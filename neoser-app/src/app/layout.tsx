import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const montserrat = localFont({
  src: "../../public/fonts/abhayalibre-semibold.ttf",
  variable: "--font-montserrat",
});

const playfair = localFont({
  src: "../../public/fonts/abhayalibre-extrabold.ttf",
  variable: "--font-playfair",
});

const dancing = localFont({
  src: "../../public/fonts/brush-script.ttf",
  variable: "--font-dancing",
});

export const metadata: Metadata = {
  title: "NeoSer | Maternidad y Medicina Humanizada - Chiclayo",
  description:
    "Centro de maternidad y medicina humanizada en Chiclayo. Control prenatal, parto humanizado, cursos y acompanamiento postparto.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${montserrat.variable} ${playfair.variable} ${dancing.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
