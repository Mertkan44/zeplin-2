import { Cormorant_Garamond, Manrope, Space_Grotesk } from "next/font/google";
import AboutMotion from "@/components/about/AboutMotion";

/*
 * Hakkımızda — hareket prototipinden uyarlandı (zeplin-kaynak-kodu.zip).
 * Prototipin yazı aileleri yalnızca bu sayfada yüklenir; ortak Navbar/Footer korunur.
 * İçerik modeli (src/data/about.ts): hikâye ve kişiler girildiğinde ilgili bölüm
 * görünür, boşken hiç render edilmez.
 */

const manrope = Manrope({ subsets: ["latin", "latin-ext"], variable: "--font-manrope", display: "swap" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin", "latin-ext"], variable: "--font-space-grotesk", display: "swap" });
// Yalnızca açılıştaki video etiketi (italik serif vurgu).
const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: "500",
  style: "italic",
  variable: "--font-cormorant",
  display: "swap",
});

export default function HakkimizdaPage() {
  return (
    <main className={`${manrope.variable} ${spaceGrotesk.variable} ${cormorant.variable} min-h-screen bg-[#f4f3ef]`}>
      <AboutMotion />
    </main>
  );
}
