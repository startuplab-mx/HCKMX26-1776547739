"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { HeatmapPoint, HeatmapResponse, GuardEvent } from "@/lib/types/heatmap";

export interface GuardNotification {
  event:      GuardEvent;
  receivedAt: number;
  dismissed:  boolean;
}

export type PollingStatus = "loading" | "connected" | "polling" | "new-signal" | "error";

export interface PollingState {
  points:              HeatmapPoint[];
  recentPointIds:      string[];
  recentGuardEvents:   GuardEvent[];
  notifications:       GuardNotification[];
  status:              PollingStatus;
  dismissNotification: (id: string) => void;
}

const POLL_INTERVAL_MS = 5_000;

export function useHeatmapPolling(): PollingState {
  const [points,             setPoints]             = useState<HeatmapPoint[]>([]);
  const [recentPointIds,     setRecentPointIds]     = useState<string[]>([]);
  const [recentGuardEvents,  setRecentGuardEvents]  = useState<GuardEvent[]>([]);
  const [notifications,      setNotifications]      = useState<GuardNotification[]>([]);
  const [status,             setStatus]             = useState<PollingStatus>("loading");

  // Store lastPollTime in a ref so the interval callback always sees the latest value
  // without being re-created on every state update.
  const lastPollTimeRef = useRef<string | null>(null);
  const initialLoaded   = useRef(false);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.event.id === id ? { ...n, dismissed: true } : n))
    );
  }, []);

  // ── Initial load ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (initialLoaded.current) return;
    initialLoaded.current = true;

    fetch("/api/heatmap")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<HeatmapResponse>;
      })
      .then((data) => {
        const pts = data.points ?? [];
        setPoints(pts);
        lastPollTimeRef.current = data.serverTime ?? new Date().toISOString();
        setStatus("connected");
        console.log("[LiveUpdate] total points:", pts.length);
      })
      .catch((err) => {
        console.error("[Polling] initial fetch error:", err);
        setStatus("error");
      });
  }, []);

  // ── 5-second polling ──────────────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(async () => {
      const since = lastPollTimeRef.current;
      if (!since) return; // initial load not done yet

      console.log("[Polling] checking since:", since);
      setStatus("polling");

      try {
        const r = await fetch(`/api/heatmap?since=${encodeURIComponent(since)}`);
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const data: HeatmapResponse = await r.json();

        const newEvents = data.newGuardEvents ?? [];
        const newPts    = data.points         ?? [];

        console.log("[Polling] new guard events:", newEvents.length);

        // Always advance the clock even when no new events
        lastPollTimeRef.current = data.serverTime ?? new Date().toISOString();

        if (newEvents.length > 0) {
          const newIds = newEvents.map((e) => e.id);

          setPoints((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const fresh = newPts.filter((p) => !existingIds.has(p.id));
            const total = prev.length + fresh.length;
            console.log("[LiveUpdate] total points:", total);
            return [...prev, ...fresh];
          });

          // Pulse effect: mark new IDs for 5 seconds
          setRecentPointIds(newIds);
          setTimeout(() => setRecentPointIds([]), 5_000);

          // Recent guard events: keep for 30 seconds for visual amplification
          setRecentGuardEvents((prev) => [...newEvents, ...prev].slice(0, 20));
          setTimeout(() => {
            const batchIds = new Set(newIds);
            setRecentGuardEvents((prev) => prev.filter((e) => !batchIds.has(e.id)));
          }, 30_000);

          setNotifications((prev) =>
            [
              ...newEvents.map((e) => ({ event: e, receivedAt: Date.now(), dismissed: false })),
              ...prev,
            ].slice(0, 5)
          );

          setStatus("new-signal");
          setTimeout(() => setStatus("connected"), 3_000);
        } else {
          setStatus("connected");
        }
      } catch (err) {
        console.error("[Polling] poll error:", err);
        setStatus("connected"); // don't lock into error state on transient failures
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []); // runs once — reads lastPollTimeRef via closure

  return { points, recentPointIds, recentGuardEvents, notifications, status, dismissNotification };
}
