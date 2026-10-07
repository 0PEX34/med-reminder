import "./globals.css";
export const metadata = { title: "Напомни выпить таблетку", manifest: "/manifest.json" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head><link rel="icon" href="/icon-192.png" /></head>
      <body>{children}</body>
    </html>
  );
}
