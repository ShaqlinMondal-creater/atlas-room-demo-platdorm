import { IconArrow, IconClock, IconLock } from "./Icons";

/** True when a hex background is dark enough that ink text would fail contrast. */
function softIsDark(hex) {
  const raw = String(hex || "").replace("#", "").trim();
  if (raw.length !== 3 && raw.length !== 6) return false;
  const full =
    raw.length === 3
      ? raw
          .split("")
          .map((c) => c + c)
          .join("")
      : raw;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  // Relative luminance (sRGB)
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return lum < 0.45;
}

export default function TemplateCard({ template, unlocked, onOpen }) {
  const accent = template.theme?.accent || "#2f6f4e";
  const soft = template.theme?.soft || "#e7f2ea";
  const darkSoft = softIsDark(soft);
  const available = template.available !== false;
  const thumb = template.thumbnail;

  return (
    <article
      className={`template-card ${unlocked ? "is-open" : "is-locked"} ${
        available ? "" : "is-soon"
      } ${darkSoft ? "is-dark-soft" : ""}`}
      style={{
        "--card-accent": accent,
        "--card-soft": soft,
        "--card-on-soft": darkSoft ? "#e8eef8" : "var(--ink)",
        "--card-on-soft-muted": darkSoft ? "#9aa8c0" : "var(--muted)",
      }}
    >
      <button type="button" className="template-card-hit" onClick={() => onOpen(template)}>
        <div className="template-card-visual" aria-hidden="true">
          {thumb ? (
            <img
              className="template-thumb"
              src={thumb}
              alt=""
              loading="lazy"
              width="640"
              height="400"
            />
          ) : (
            <>
              <span className="template-card-orb" />
              <span className="template-card-orb template-card-orb--two" />
            </>
          )}
          {!available ? <span className="template-soon-badge">Coming soon</span> : null}
        </div>

        <div className="template-card-body">
          <div className="template-card-top">
            <p className="template-category">{template.category}</p>
            <p
              className={`template-status ${
                !available ? "soon" : unlocked ? "open" : "locked"
              }`}
            >
              {!available ? (
                <>
                  <IconLock size={14} /> Soon
                </>
              ) : unlocked ? (
                <>
                  <IconClock size={14} /> Token active
                </>
              ) : (
                <>
                  <IconLock size={14} /> Code locked
                </>
              )}
            </p>
          </div>

          <h3>{template.name}</h3>
          <p className="template-summary">{template.summary}</p>

          {Array.isArray(template.tags) && template.tags.length ? (
            <ul className="template-tags">
              {template.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          ) : null}

          <dl className="template-meta">
            <div>
              <dt>Stack</dt>
              <dd>{template.stack}</dd>
            </div>
            <div>
              <dt>Look</dt>
              <dd>{template.theme?.label || template.status}</dd>
            </div>
          </dl>

          <span className="card-action">
            {available ? "Open preview" : "Notify later"}
            <IconArrow size={16} />
          </span>
        </div>
      </button>
    </article>
  );
}
