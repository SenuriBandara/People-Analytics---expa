import type { Metadata } from "next";
import "./globals.css";
import '@mantine/core/styles.css';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import '@mantine/notifications/styles.css';
import {Notifications} from "@mantine/notifications";

export const metadata: Metadata = {
  title: "AIESEC Extended Analytics",
  description: "Extended analytics platform for AIESEC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body className={`flex flex-col bg-gradient-to-r from-indigo-100 to-indigo-100 text-gray-800 h-screen w-screen`}>
          <MantineProvider>
              {children}
              <Notifications />
          </MantineProvider>
          <div className={`flex items-center text-gray justify-center p-2`}>
              Developed by AIESEC International with 💙
          </div>
      </body>
    </html>
  );
}
