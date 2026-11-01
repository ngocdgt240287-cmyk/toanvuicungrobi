import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Toán Vui cùng Robi | Học Toán tiểu học",
  description: "Học Toán tiểu học qua bài học, luyện tập và công cụ trực quan.",
  applicationName: "Toán Vui cùng Robi"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body>{children}</body></html>;
}
