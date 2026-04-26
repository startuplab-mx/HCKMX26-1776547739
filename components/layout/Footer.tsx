import { Layers } from "lucide-react";

const footerLinks = {
  Producto:   ["Descripción de la Plataforma", "Panel de Control", "Motor de Riesgo", "Integraciones"],
  Soluciones: ["Gobiernos", "Empresas", "Logística", "Confianza y Seguridad"],
  Empresa:    ["Acerca de", "Blog", "Empleos", "Prensa"],
  Legal:      ["Política de Privacidad", "Términos de Servicio", "Tratamiento de Datos", "Seguridad"],
};

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-5">
          {/* Marca */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-600">
                <Layers className="h-4 w-4 text-white" />
              </div>
              <span className="text-base font-semibold text-white">
                Layers<span className="text-brand-400">Intel</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-500 max-w-xs">
              Plataforma de inteligencia de riesgo impulsada por IA para instituciones,
              partners y equipos que necesitan convertir datos fragmentados en
              decisiones accionables.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-300 mb-4">
                {category}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            © 2025 Layers Intel. Todos los derechos reservados.
          </p>
          <p className="text-xs text-slate-600">
            Construido para inteligencia responsable.
          </p>
        </div>
      </div>
    </footer>
  );
}
