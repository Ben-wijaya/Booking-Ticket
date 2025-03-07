import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ticket Booking App",
  description: "Aplikasi pemesanan tiket",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-gray-100 min-h-screen flex flex-col`}
      >
        <header className="bg-blue-600 text-white p-4 shadow-md text-center text-2xl font-bold">
          Ticket Booking App
        </header>
        <main className="flex-grow container mx-auto p-4 bg-white shadow-lg rounded-lg my-4">
          {children}
        </main>
        <footer className="bg-blue-600 text-white text-center p-4 mt-4">
          © {new Date().getFullYear()} Ticket Booking App. All Rights Reserved.
        </footer>
      </body>
    </html>
  );
}
