import { useEffect, useId } from "react";
import { IconLock } from "./Icons";

export default function ComingSoonModal({ template, onClose }) {
  const titleId = useId();
  const accent = template.theme?.accent || "#2f6f4e";
  const soft = template.theme?.soft || "#e7f2ea";

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal modal-accented modal-wide"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        style={{
          "--modal-accent": accent,
          "--modal-soft": soft,
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-top">
          <div className="modal-heading">
            <span className="modal-icon" aria-hidden="true">
              <IconLock size={20} />
            </span>
            <div>
              <p className="eyebrow">Coming soon</p>
              <h2 id={titleId}>{template.name}</h2>
            </div>
          </div>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {template.thumbnail ? (
          <div className="modal-preview modal-preview--soon">
            <img
              className="modal-preview-image"
              src={template.thumbnail}
              alt=""
            />
            <div className="modal-preview-veil">
              <IconLock size={16} />
              <span>Reserved slot · live files not connected yet</span>
            </div>
          </div>
        ) : null}

        <p className="modal-copy">
          This slot is reserved so Atlas Room already feels fuller. The live
          files are not connected yet.
        </p>
        <button type="button" className="btn" onClick={onClose}>
          Back to catalog
        </button>
      </div>
    </div>
  );
}
