import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header/Header";
import Footer from "@/components/layout/footer/Footer";
import ChatWidget from "@/components/chat-bot/Chatbot";
import { GlobalProvider } from "./GlobalProvider";
import { Toaster } from "react-hot-toast";

import { Mukta } from "next/font/google";

const mukta = Mukta({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-mukta",
});

export const metadata: Metadata = {
  title: "हाम्रो परिवार — न्यौपाने परिवार",
  description: "घनश्याम न्यौपानेको परिवारको डिजिटल स्मृति संग्रह",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ne" className={`${mukta.variable}`}>
      <body className="font-sans">
        <GlobalProvider>
          <div className="header-children-spacing">
            <Header />
            <main className="flex-1">{children}</main>
            <ChatWidget />
            <Footer />
          </div>
        </GlobalProvider>

        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              fontSize: "17px",
              fontFamily: "Mukta, sans-serif",
              padding: "16px 20px",
              borderRadius: "16px",
            },
            duration: 3000,
          }}
        />
      </body>
    </html>
  );
}
