import { Poppins } from "next/font/google";
import "./globals.css";
import { Analytics } from '@vercel/analytics/react'; // Import Vercel Analytics

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"], // Specify the weights you want to use
});

export const metadata = {
  title: "FacultyInsights",
  description: "A platform for students to review and get insights about instructors.",
  icons: {
    icon: '/favicon.png',
  },

};

export default function RootLayout({ children }) {
  return (
    <html lang="en">

      <body className={poppins.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
