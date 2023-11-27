import ModalProvider from "@/components/Providers/ModalProvider";
import NextUiProvider from "@/components/Providers/NextUiProvider";
import { QueryProvider } from "@/components/Providers/QueryProvider";
import { SocketProvider } from "@/components/Providers/SocketProvider";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "NextCord",
  description: "Discord clone on NextJS and TypeScript",
};

const font = Open_Sans({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn(font.className, "bg-stone-700 antialiased")}>
      <body className="min-h-screen antialiased">
        <NextUiProvider>
          <SocketProvider>
            <QueryProvider>
              <main className="dark text-foreground bg-stone-700">
                <ModalProvider />
                {children}
              </main>
            </QueryProvider>
          </SocketProvider>
        </NextUiProvider>
      </body>
    </html>
  );
}
