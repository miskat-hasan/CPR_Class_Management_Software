import { Poppins } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/Provider/AuthProvider/AuthProvider";
import ReactQueryProvider from "@/Provider/QueryProvider/QueryProvider";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Enroll Nationwide",
  description: "Enroll Nationwide - a CPR Class Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
    try {
      var theme = localStorage.getItem('theme') ?? 'light';
      document.documentElement.classList.toggle('dark', theme === 'dark');
    } catch(e) {}
  `,
          }}
        />
      </head>
      <body className={`${poppins.variable} antialiased overflow-hidden bg-light dark:bg-dark`}>
        <NextTopLoader
          color="#b70000"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #b70000, 0 0 5px #b70000"
          zIndex={99999}
        />
        <ReactQueryProvider>
          <Toaster position="top-center" theme="light" />
          <AuthProvider>{children}</AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
