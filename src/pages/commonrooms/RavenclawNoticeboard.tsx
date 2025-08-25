import React from "react";
import { Link } from "react-router-dom";
import ThemedLayout from "../../components/ThemedLayout";
import quests from "../../quests/ravenclaw.json";

export default function RavenclawNoticeboard({ character }) {
  return (
    <ThemedLayout character={character}>
      <h2>🪧 Ravenclaw Noticeboard</h2>
      <p>Check here for side quests and house announcements!</p>
      <ul>
        {quests.map(q => (
          <li key={q.id}>
            <Link to={`/commonrooms/ravenclaw/noticeboard/${q.id}`}>
              {q.title}
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/commonrooms/ravenclaw" style={{ marginTop: "2em", display: "inline-block" }}>
        ← Back to Common Room
      </Link>
    </ThemedLayout>
  );
}
