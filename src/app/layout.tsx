import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Image from "next/image";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "One Refugee | Curriculum",
  description: "Learning management system for One Refugee students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${poppins.variable} antialiased`}>
          <div className="relative w-full h-[15vh] shrink-0">
            <Image
              src="/Green_2_Small_fabric.webp"
              alt=""
              fill
              className="object-cover"
              priority
            />
          </div>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
