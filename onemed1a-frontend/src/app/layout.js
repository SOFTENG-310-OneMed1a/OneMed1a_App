import { Poppins } from "next/font/google";
import "./globals.css";
import PropTypes from "prop-types";
import ConditionalAppChrome from "../components/ConditionalAppChrome"; // [`ConditionalAppChrome`](onemed1a-frontend/src/components/ConditionalAppChrome.js)

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "AllMedia",
  description: "A central hub for movies, TV shows, books, and music.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${poppins.variable} antialiased bg-white text-neutral-900`}>
        <ConditionalAppChrome />
        {children}
      </body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
