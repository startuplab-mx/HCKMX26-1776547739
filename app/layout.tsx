import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Layers Intel — Inteligencia de Riesgo impulsada por IA",
  description:
    "Layers Intel transforma datos territoriales, digitales, sociales y operativos en inteligencia accionable para partners, instituciones, empresas y equipos que necesitan anticipar, validar y responder ante riesgos.",
  keywords: [
    "inteligencia de riesgo",
    "Layers Core",
    "OSINT",
    "IOC",
    "analítica con IA",
    "inteligencia institucional",
    "protección digital",
    "control parental inteligente",
    "inteligencia de amenazas",
  ],
  openGraph: {
    title: "Layers Intel — Inteligencia de Riesgo impulsada por IA",
    description:
      "Transforma datos fragmentados en inteligencia de riesgo accionable para partners, instituciones y equipos de seguridad.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="antialiased">{children}</body>
    </html>
  );
}
