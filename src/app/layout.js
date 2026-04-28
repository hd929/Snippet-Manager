import "./globals.css";
import { Outfit, JetBrains_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-outfit"
});

const jetbrains = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: "--font-jetbrains"
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020617",
};

export const metadata = {
  title: "CP Snippets Manager",
  description: "Personal competitive programming snippets manager — organize, search, and copy your C++ algorithms instantly.",
  keywords: ["competitive programming", "snippets", "algorithms", "C++", "data structures"],
  authors: [{ name: "CP Snippets" }],
  openGraph: {
    title: "CP Snippets Manager",
    description: "Your personal arsenal of competitive programming algorithms.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${outfit.variable} ${jetbrains.variable} font-sans min-h-screen bg-slate-950 text-slate-50 antialiased selection:bg-blue-500/30 selection:text-blue-200`}>
        {children}
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#f8fafc',
              border: '1px solid rgba(51, 65, 85, 0.5)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#1e293b',
              },
              duration: 3000,
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#1e293b',
              },
              duration: 4000,
            },
          }}
        />
      </body>
    </html>
  );
}
