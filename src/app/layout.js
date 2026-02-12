import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Manorekha",
  description: "Whiteboard App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#f4f7f4]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
