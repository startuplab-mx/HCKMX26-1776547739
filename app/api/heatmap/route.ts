import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawLimit    = searchParams.get("limit");
  const eventsLimit = rawLimit ? Math.min(10000, Math.max(1, parseInt(rawLimit, 10))) : 10000;
  // ── 1. Validate environment variables ──────────────────────────────────────
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;

  console.log("[heatmap] NEXT_PUBLIC_SUPABASE_URL present:", !!supabaseUrl);
  console.log("[heatmap] SUPABASE_SERVICE_ROLE_KEY present:", !!serviceKey);

  if (!supabaseUrl || !serviceKey) {
    console.error("[heatmap] Missing Supabase environment variables");
    return NextResponse.json(
      { error: "Missing Supabase environment variables" },
      { status: 500 }
    );
  }

  // ── 2. Create client inside the handler (not at module level) ───────────────
  const supabase = createClient(supabaseUrl, serviceKey);

  // ── 3. Query both tables ────────────────────────────────────────────────────
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
        .select("id, latitud, longitud, criticidad, nivel, score, fuente, texto, company, as_type, timestamp_event")
        .not("latitud", "is", null)
        .not("longitud", "is", null)
        .limit(2000),
    ]);

    if (eventsRes.error || guardRes.error) {
      const msg = eventsRes.error?.message ?? guardRes.error?.message ?? "Unknown Supabase error";
      console.error("[heatmap] Supabase query error:", msg);
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    const eventPoints =
      eventsRes.data?.map((row) => ({
        id:          String(row.id),
        source:      "events" as const,
        lat:         row.latitud,
        lng:         row.longitud,
        intensity:   row.criticidad ?? 1,
        title:       row.delito ?? null,
        category:    row.categoria_delito ?? null,
        severity:    "media",
        description: `${row.alcaldia_hecho ?? ""} ${row.colonia_hecho ?? ""}`.trim() || null,
      })) ?? [];

    const guardPoints =
      guardRes.data?.map((row) => ({
        id:          String(row.id),
        source:      "layers_guard" as const,
        lat:         row.latitud,
        lng:         row.longitud,
        intensity:   row.criticidad ?? 1,
        title:       row.texto ?? null,
        category:    row.fuente ?? null,
        severity:    row.nivel ?? null,
        description: `${row.company ?? ""} ${row.as_type ?? ""}`.trim() || null,
      })) ?? [];

    console.log(`[heatmap] OK — events: ${eventPoints.length}, guard: ${guardPoints.length}`);
    return NextResponse.json({ points: [...eventPoints, ...guardPoints] });

  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    const cause = (error.cause instanceof Error) ? error.cause.message : null;
    console.error("[heatmap] Fetch failed:", error.message, cause ? `(cause: ${cause})` : "");
    return NextResponse.json(
      { error: error.message, cause },
      { status: 500 }
    );
  }
}
