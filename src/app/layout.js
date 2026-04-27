import "./globals.css";

export const metadata = {
  title: "Snippets Manager",
  description: "Personal competitive programming snippets manager",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-50 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
