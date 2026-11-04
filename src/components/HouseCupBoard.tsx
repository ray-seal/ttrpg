import React, { useCallback, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

type HouseScore = { house: string; points: number };
type Season = { name: string; starts_at: string; ends_at: string };
type Announcement = { id: string; title: string; body: string; kind: string; created_at: string };

const houseOrder = ["Gryffindor", "Hufflepuff", "Ravenclaw", "Slytherin"];

const houseColours: Record<string, string> = {
  Gryffindor: "#ae0001",
  Hufflepuff: "#b58b00",
  Ravenclaw: "#222f5b",
  Slytherin: "#2a623d",
};

export default function HouseCupBoard() {
  const [scores, setScores] = useState<HouseScore[]>([]);
  const [season, setSeason] = useState<Season | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const refresh = useCallback(async () => {
    const [scoreResult, seasonResult, announcementResult] = await Promise.all([
      supabase.from("house_points").select("house,points"),
      supabase.from("house_cup_seasons").select("name,starts_at,ends_at").eq("status", "active").maybeSingle(),
      supabase.from("announcements").select("id,title,body,kind,created_at")
        .order("created_at", { ascending: false }).limit(5),
    ]);

    if (!scoreResult.error && scoreResult.data) {
      const ordered = [...(scoreResult.data as HouseScore[])].sort(
        (a, b) => b.points - a.points || houseOrder.indexOf(a.house) - houseOrder.indexOf(b.house)
      );
      setScores(ordered);
    }
    if (!seasonResult.error) setSeason((seasonResult.data as Season | null) ?? null);
    if (!announcementResult.error && announcementResult.data) {
      setAnnouncements(announcementResult.data as Announcement[]);
    }
    setUpdatedAt(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => void refresh(), 15000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  return (
    <section style={{
      margin: "1.5rem 0", padding: "1.1rem", borderRadius: 14,
      background: "rgba(255,255,255,.88)", border: "1px solid #d8cfbd",
      color: "#30291f", boxShadow: "0 2px 8px rgba(0,0,0,.06)"
    }}>
      <h2 style={{ margin: "0 0 .35rem", fontFamily: "Georgia,serif" }}>🏆 Hogwarts House Cup</h2>
      {season ? (
        <p style={{ margin: "0 0 .8rem", fontSize: ".9rem" }}>
          {season.name} · {new Date(season.starts_at).toLocaleDateString()} to {new Date(season.ends_at).toLocaleDateString()}
        </p>
      ) : (
        <p style={{ margin: "0 0 .8rem", fontSize: ".9rem" }}>The next House Cup season has not begun yet.</p>
      )}
      {loading ? <p>Loading the house standings…</p> : (
        <ol style={{ margin: 0, paddingLeft: "1.5rem" }}>
          {scores.map((score, index) => (
            <li key={score.house} style={{ padding: ".25rem 0", fontWeight: index === 0 ? 700 : 500 }}>
              <span style={{ color: houseColours[score.house] }}>{score.house}</span>
              <span style={{ float: "right", fontVariantNumeric: "tabular-nums" }}>{score.points} points</span>
            </li>
          ))}
        </ol>
      )}
      <div style={{ borderTop: "1px solid #e5dece", marginTop: "1rem", paddingTop: ".8rem" }}>
        <h3 style={{ margin: "0 0 .55rem", fontSize: "1rem" }}>📌 Hogwarts Noticeboard</h3>
        {announcements.length === 0 ? (
          <p style={{ margin: 0, fontSize: ".9rem" }}>No new announcements.</p>
        ) : announcements.map((item) => (
          <article key={item.id} style={{ margin: ".55rem 0", paddingBottom: ".55rem", borderBottom: "1px solid #eee7d9" }}>
            <strong>{item.title}</strong>
            <p style={{ margin: ".2rem 0", fontSize: ".9rem" }}>{item.body}</p>
            <small>{new Date(item.created_at).toLocaleString()}</small>
          </article>
        ))}
      </div>
      <small style={{ display: "block", marginTop: ".55rem", color: "#746b5e" }}>
        {updatedAt ? `Scores refresh automatically · Updated ${updatedAt.toLocaleTimeString()}` : "Waiting for scores…"}
      </small>
    </section>
  );
}
