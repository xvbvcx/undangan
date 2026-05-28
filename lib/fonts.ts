import { Cormorant_Garamond, Playfair_Display, Cinzel, Italiana, Dancing_Script, Inter, Bodoni_Moda } from "next/font/google";

// Display fonts assigned per template layout. Loaded with `display: swap` so
// the cover gate is readable even before the webfont is fully fetched.

export const fontInter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans"
});

export const fontCormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-cormorant"
});

export const fontPlayfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-playfair"
});

export const fontCinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-cinzel"
});

export const fontItaliana = Italiana({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-italiana"
});

export const fontDancing = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-dancing"
});

export const fontBodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-bodoni"
});

export const fontVariables = [
  fontInter.variable,
  fontCormorant.variable,
  fontPlayfair.variable,
  fontCinzel.variable,
  fontItaliana.variable,
  fontDancing.variable,
  fontBodoni.variable
].join(" ");
