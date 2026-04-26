"use client";

// ── Static actor data ─────────────────────────────────────────────────────────

type Criticidad = "CRÍTICO" | "ALTO";

interface RiskActor {
  id:         string;
  username:   string;
  platform:   string;
  criticidad: Criticidad;
  avatar:     string;
  datos:      { label: string; value: string }[];
  tags:       string[];
  insight:    string;
}

const ACTORS: RiskActor[] = [
  {
    id:         "actor-1",
    username:   "@user1334248711265",
    platform:   "TikTok",
    criticidad: "CRÍTICO",
    avatar:     "https://res.cloudinary.com/dkucopkow/image/upload/v1777214994/Captura_de_pantalla_2026-04-26_a_la_s_8.48.50_a.m._vvdf2e.png",
    datos: [
      { label: "Cuenta creada",  value: "hace 24h"           },
      { label: "País",           value: "Japón (posible VPN)" },
      { label: "Idioma",         value: "ZH"                  },
      { label: "Videos",         value: "0"                   },
      { label: "Estado",         value: "Privada"             },
    ],
    tags:    ["Cuenta nueva", "Geoloc inconsistente", "Sin contenido"],
    insight: "Patrón de cuenta desechable con posible uso para reclutamiento o difusión efímera.",
  },
  {
    id:         "actor-2",
    username:   "@angelriver053",
    platform:   "TikTok",
    criticidad: "ALTO",
    avatar:     "https://res.cloudinary.com/dkucopkow/image/upload/v1777215136/Captura_de_pantalla_2026-04-26_a_la_s_8.51.59_a.m._hxcpnl.png",
    datos: [
      { label: "Ubicación",  value: "Tamaulipas"        },
      { label: "Followers",  value: "871"               },
      { label: "Likes",      value: "9,376"             },
      { label: "Engagement", value: "3.5%"              },
      { label: "Actividad",  value: "Viernes 23:00 CST" },
    ],
    tags:    ["Tamaulipas", "Narcocultura", "Engagement alto"],
    insight: "Perfil con comportamiento orgánico y afinidad cultural asociada a grupos criminales.",
  },
];

// ── Config ────────────────────────────────────────────────────────────────────

const CRIT_CFG: Record<Criticidad, {
  badge:    string;
  accent:   string;
  tag:      string;
  insight:  string;
  dot:      string;
}> = {
  "CRÍTICO": {
    badge:   "bg-red-600 text-white",
    accent:  "bg-red-500",
    tag:     "bg-red-50 text-red-700 border border-red-200",
    insight: "bg-red-50/60 text-red-800",
    dot:     "bg-red-500",
  },
  "ALTO": {
    badge:   "bg-orange-500 text-white",
    accent:  "bg-orange-400",
    tag:     "bg-orange-50 text-orange-700 border border-orange-200",
    insight: "bg-orange-50/60 text-orange-800",
    dot:     "bg-orange-400",
  },
};

// ── Actor card ────────────────────────────────────────────────────────────────

function ActorCard({ actor }: { actor: RiskActor }) {
  const cfg = CRIT_CFG[actor.criticidad];

  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-card overflow-hidden flex flex-col">
      {/* Criticidad accent bar */}
      <div className={`h-0.5 w-full ${cfg.accent}`} />

      <div className="flex flex-col sm:flex-row flex-1">
        {/* Avatar column */}
        <div className="relative sm:w-28 h-44 sm:h-auto shrink-0 overflow-hidden bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={actor.avatar}
            alt={actor.username}
            loading="lazy"
            className="w-full h-full object-cover object-top"
          />
          {/* Bottom gradient for desktop read-over */}
          <div className="absolute inset-0 sm:bg-gradient-to-r sm:from-transparent sm:to-white/10 pointer-events-none" />
          {/* Platform badge */}
          <div className="absolute top-2 left-2 rounded-md bg-black/70 backdrop-blur-sm px-1.5 py-0.5">
            <span className="text-[9px] font-bold text-white tracking-wide">{actor.platform}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col gap-3 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                Actor identificado
              </span>
              <p className="text-sm font-bold text-slate-900 truncate mt-0.5">{actor.username}</p>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest ${cfg.badge}`}>
                {actor.criticidad}
              </span>
              <div className="flex items-center gap-1">
                <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${cfg.dot}`} />
                <span className="text-[9px] text-slate-400 font-medium">Monitoreo activo</span>
              </div>
            </div>
          </div>

          {/* Data grid */}
          <div className="grid grid-cols-2 gap-x-5 gap-y-2">
            {actor.datos.map((d) => (
              <div key={d.label} className="flex flex-col gap-0.5">
                <span className="text-[9px] font-semibold uppercase tracking-widest text-slate-400">
                  {d.label}
                </span>
                <span className="text-[12px] font-semibold text-slate-800">{d.value}</span>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {actor.tags.map((tag) => (
              <span key={tag} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg.tag}`}>
                {tag}
              </span>
            ))}
          </div>

          {/* Insight */}
          <div className={`rounded-xl px-3 py-2.5 ${cfg.insight}`}>
            <p className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-70">
              Insight Layers Core
            </p>
            <p className="text-[11px] leading-relaxed italic">
              "{actor.insight}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

export default function RiskActors() {
  return (
    <div>
      {/* Section header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1">
          <h3 className="text-sm font-bold text-slate-900">Actores de Riesgo Identificados</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Perfiles bajo vigilancia activa · clasificados por Layers Core
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-xl border border-red-100 bg-red-50 px-3 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
          <span className="text-[10px] font-semibold text-red-700">{ACTORS.length} actores</span>
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {ACTORS.map((actor) => (
          <ActorCard key={actor.id} actor={actor} />
        ))}
      </div>
    </div>
  );
}
