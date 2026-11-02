import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { templates } from "../data/templates";
import { buildViewUrl, listActiveAccess } from "../lib/accessToken";
import { IconClock, IconSpark, IconTab } from "./Icons";

function formatRemaining(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export default function ActiveTokenStrip({ refreshKey = 0 }) {
  const [sessions, setSessions] = useState(() => listActiveAccess());

  useEffect(() => {
    function refresh() {
      setSessions(listActiveAccess());
    }

    refresh();
    const timer = window.setInterval(refresh, 1000);
    return () => window.clearInterval(timer);
  }, [refreshKey]);

  if (!sessions.length) {
    return (
      <section className="token-strip token-strip--empty" aria-label="Preview sessions">
        <div className="wrap token-strip-row">
          <div className="token-strip-label">
            <IconSpark size={16} />
            <strong>No active previews</strong>
          </div>
          <p className="token-strip-empty-copy">
            Unlock a template below to start a timed session. Tokens appear here
            while they are still valid.
          </p>
          <a className="token-strip-cta" href="#catalog">
            Browse catalog
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="token-strip" aria-label="Active preview tokens">
      <div className="wrap token-strip-row">
        <div className="token-strip-label">
          <IconClock size={16} />
          <strong>Active previews</strong>
        </div>

        <ul className="token-strip-list">
          {sessions.map((session) => {
            const template = templates.find((item) => item.code === session.code);
            const name = template?.name || session.code;
            const href = buildViewUrl(session.code, session.token);

            return (
              <li key={session.code} className="token-chip">
                <span className="token-chip-dot" aria-hidden="true" />
                <span className="token-chip-name">{name}</span>
                <span className="token-chip-time">{formatRemaining(session.remainingMs)} left</span>
                <Link className="token-chip-open" to={href} target="_blank" rel="noreferrer">
                  <IconTab size={14} />
                  Open
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
