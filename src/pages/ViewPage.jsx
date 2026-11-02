import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ACCESS } from "../config/constants";
import { findTemplate } from "../data/templates";
import { validateAccessToken } from "../lib/accessToken";

function formatRemaining(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export default function ViewPage() {
  const { code } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const template = findTemplate(code);

  const firstCheck = useMemo(
    () => validateAccessToken(code, token),
    [code, token]
  );

  const [remainingMs, setRemainingMs] = useState(
    firstCheck.ok ? firstCheck.remainingMs : 0
  );
  const [status, setStatus] = useState(firstCheck);

  useEffect(() => {
    const result = validateAccessToken(code, token);
    setStatus(result);
    if (!result.ok) return undefined;

    setRemainingMs(result.remainingMs);

    const timer = window.setInterval(() => {
      const next = validateAccessToken(code, token);
      setStatus(next);
      if (!next.ok) {
        window.clearInterval(timer);
        return;
      }
      setRemainingMs(next.remainingMs);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [code, token]);

  if (!template || template.available === false) {
    return (
      <main className="access-screen">
        <h1>{template ? "Coming soon" : "Template not found"}</h1>
        <p>
          {template
            ? "This catalog slot is reserved, but the live preview is not connected yet."
            : "That code is not in this showcase."}
        </p>
        <Link className="btn" to="/">
          Back to catalog
        </Link>
      </main>
    );
  }

  if (!status.ok) {
    return (
      <main className="access-screen">
        <p className="eyebrow">Access ended</p>
        <h1>{status.reason === "expired" ? "Link expired" : "Token invalid"}</h1>
        <p>
          {status.reason === "expired"
            ? `This preview token only lasts ${ACCESS.ttlMinutes} minutes. Open the template again from the showcase.`
            : "Open this template from the showcase and enter the access code to get a fresh token."}
        </p>
        <Link className="btn" to="/">
          Back to catalog
        </Link>
      </main>
    );
  }

  const gatedSrc = `${template.previewPath}?token=${encodeURIComponent(token)}`;

  return (
    <div className="view-shell">
      <header className="view-bar">
        <div>
          <p className="eyebrow">
            Token access · {formatRemaining(remainingMs)} left
          </p>
          <h1>{template.name}</h1>
        </div>
        <div className="preview-actions">
          <a className="btn ghost" href={gatedSrc} target="_blank" rel="noreferrer">
            Raw template tab
          </a>
          <Link className="btn" to="/">
            Catalog
          </Link>
        </div>
      </header>
      <iframe className="view-frame" title={template.name} src={gatedSrc} />
    </div>
  );
}
