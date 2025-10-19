import { Poppins } from "next/font/google";
import "./globals.css";
import PropTypes from "prop-types";
import NavigationBar from "../components/NavigationBar";

/**
 * RootLayout component that wraps the entire application.
 * Applies global styles to the body and includes the NavigationBar.
 */

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
      <body
        className={`${poppins.variable} antialiased bg-white text-neutral-900`}
      >
        <NavigationBar />
        {children}
      </body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
