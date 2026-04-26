import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { GuardEvent } from "@/lib/types/heatmap";

// ── Criticidad helpers ────────────────────────────────────────────────────────

function guardIntensity(criticidad: number | null, nivel: string | null): number {
  if (criticidad != null && criticidad > 0) return criticidad;
  switch (nivel?.toUpperCase()) {
    case "ROJO":     return 5;
    case "NARANJA":  return 3;
    case "AMARILLO": return 2;
    case "VERDE":    return 1;
    default:         return 2;
  }
}

// ── Handler ───────────────────────────────────────────────────────────────────

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawLimit    = searchParams.get("limit");
  const since       = searchParams.get("since"); // ISO timestamp for polling
  const eventsLimit = rawLimit ? Math.min(10000, Math.max(1, parseInt(rawLimit, 10))) : 10000;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;

  console.log("[heatmap] NEXT_PUBLIC_SUPABASE_URL present:", !!supabaseUrl);
  console.log("[heatmap] SUPABASE_SERVICE_ROLE_KEY present:", !!serviceKey);

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: "Missing Supabase environment variables" }, { status: 500 });
  }

  const supabase    = createClient(supabaseUrl, serviceKey);
  const serverTime  = new Date().toISOString();

  // ── Polling mode: only new guard events since timestamp ───────────────────
  if (since) {
    try {
      const { data, error } = await supabase
        .from("layers_guard_events")
        .select("id, latitud, longitud, criticidad, nivel, score, fuente, texto, company, as_type, timestamp_event, created_at, detalle")
        .not("latitud", "is", null)
        .not("longitud", "is", null)
        .gt("created_at", since)
        .order("created_at", { ascending: true })
        .limit(100);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      const rows = data ?? [];
      console.log(`[heatmap] poll since=${since} → ${rows.length} new guard events`);

      const newGuardEvents: GuardEvent[] = rows.map((row) => ({
        id:              String(row.id),
        lat:             row.latitud,
        lng:             row.longitud,
        intensity:       Math.max(2.5, guardIntensity(row.criticidad, row.nivel)),
        nivel:           row.nivel ?? null,
        score:           row.score ?? null,
        fuente:          row.fuente ?? null,
        texto:           row.texto ?? null,
        company:         row.company ?? null,
        as_type:         row.as_type ?? null,
        timestamp_event: row.timestamp_event ?? null,
        created_at:      row.created_at,
        detalle:         row.detalle ?? null,
      }));

      const points = newGuardEvents.map((e) => ({
        id:          e.id,
        source:      "layers_guard" as const,
        lat:         e.lat,
        lng:         e.lng,
        intensity:   e.intensity,
        title:       e.texto ?? null,
        category:    e.fuente ?? null,
        severity:    e.nivel ?? null,
        description: `${e.company ?? ""} ${e.as_type ?? ""}`.trim() || null,
      }));

      return NextResponse.json({ points, newGuardEvents, serverTime });

    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  // ── Initial load: all events + guard ────────────────────────────────────
  try {
    const [eventsRes, guardRes] = await Promise.all([
      supabase
        .from("events")
        .select("id, latitud, longitud, criticidad, delito, categoria_delito, alcaldia_hecho, colonia_hecho")
        .not("latitud", "is", null)
        .not("longitud", "is", null)
        .limit(eventsLimit),

      supabase
        .from("layers_guard_events")
        .select("id, latitud, longitud, criticidad, nivel, score, fuente, texto, company, as_type, timestamp_event, created_at, detalle")
        .not("latitud", "is", null)
        .not("longitud", "is", null)
        .limit(2000),
    ]);

    if (eventsRes.error || guardRes.error) {
      const msg = eventsRes.error?.message ?? guardRes.error?.message ?? "Unknown Supabase error";
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    const eventPoints = (eventsRes.data ?? []).map((row) => ({
      id:          String(row.id),
      source:      "events" as const,
      lat:         row.latitud,
      lng:         row.longitud,
      intensity:   0.8,   // fixed weight for all events
      title:       row.delito ?? null,
      category:    row.categoria_delito ?? null,
      severity:    "media",
      description: `${row.alcaldia_hecho ?? ""} ${row.colonia_hecho ?? ""}`.trim() || null,
    }));

    const guardPoints = (guardRes.data ?? []).map((row) => ({
      id:          String(row.id),
      source:      "layers_guard" as const,
      lat:         row.latitud,
      lng:         row.longitud,
      intensity:   Math.max(2.5, guardIntensity(row.criticidad, row.nivel)),
      title:       row.texto ?? null,
      category:    row.fuente ?? null,
      severity:    row.nivel ?? null,
      description: `${row.company ?? ""} ${row.as_type ?? ""}`.trim() || null,
    }));

    console.log(`[heatmap] OK — events: ${eventPoints.length}, guard: ${guardPoints.length}`);
    return NextResponse.json({ points: [...eventPoints, ...guardPoints], serverTime });

  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    const cause = (error.cause instanceof Error) ? error.cause.message : null;
    return NextResponse.json({ error: error.message, cause }, { status: 500 });
  }
}
