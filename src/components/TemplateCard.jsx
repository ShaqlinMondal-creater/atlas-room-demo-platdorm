import { IconArrow, IconClock, IconLock } from "./Icons";

export default function TemplateCard({ template, unlocked, onOpen }) {
  const accent = template.theme?.accent || "#2f6f4e";
  const soft = template.theme?.soft || "#e7f2ea";
  const available = template.available !== false;
  const thumb = template.thumbnail;

  return (
    <article
      className={`template-card ${unlocked ? "is-open" : "is-locked"} ${
        available ? "" : "is-soon"
      }`}
      style={{
        "--card-accent": accent,
        "--card-soft": soft,
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
