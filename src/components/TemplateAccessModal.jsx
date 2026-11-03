import { useEffect, useId, useRef, useState } from "react";
import { ACCESS } from "../config/constants";
import { normalizeCode } from "../data/templates";
import { buildViewUrl, issueAccessToken } from "../lib/accessToken";
import { IconCheck, IconKey, IconLock } from "./Icons";

function useNarrowPhone() {
  const [narrow, setNarrow] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 700px)").matches
      : false
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 700px)");
    const update = () => setNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return narrow;
}

export default function TemplateAccessModal({ template, onClose, onIssued }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [opened, setOpened] = useState(false);
  const inputRef = useRef(null);
  const titleId = useId();
  const narrow = useNarrowPhone();
  const accent = template.theme?.accent || "#2f6f4e";
  const soft = template.theme?.soft || "#e7f2ea";
  const deskSrc = template.previewPath
    ? `${template.previewPath}?desk=1`
    : "";
  // Live iframe desk preview is awkward on phones — prefer the thumbnail there.
  const useLiveDesk = Boolean(deskSrc) && !narrow;
  const useThumb = Boolean(template.thumbnail) && (narrow || !deskSrc);

  useEffect(() => {
    // Delay focus slightly so iOS doesn't jump the sheet under the keyboard mid-open.
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 120);

    function onKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (normalizeCode(code) !== template.code) {
      setError(`Wrong code for ${template.name}. Try again.`);
      return;
    }

    const access = issueAccessToken(template.code);
    const url = buildViewUrl(access.code, access.token);
    const tab = window.open(url, "_blank");

    if (!tab) {
      setError("Pop-up blocked. Allow pop-ups for this site, then try again.");
      return;
    }

    tab.opener = null;
    onIssued?.(access.code);
    setOpened(true);
  }

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
              {opened ? <IconCheck size={20} /> : <IconLock size={20} />}
            </span>
            <div>
              <p className="eyebrow">{opened ? "Preview opened" : "Access required"}</p>
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

        {!opened ? (
          <>
            <div className="modal-preview">
              {useLiveDesk ? (
                <div className="modal-preview-frame" aria-hidden="true">
                  <iframe title="" src={deskSrc} tabIndex={-1} />
                </div>
              ) : useThumb ? (
                <img
                  className="modal-preview-image"
                  src={template.thumbnail}
                  alt=""
                />
              ) : null}
              <div className="modal-preview-veil">
                <IconLock size={16} />
                <span>
                  {narrow
                    ? "Unlock to open full preview"
                    : "Live desk preview · unlock to open full tab"}
                </span>
              </div>
            </div>

            <p className="modal-copy">
              Enter the access code. Atlas Room opens a new tab with a token that
              works for {ACCESS.ttlMinutes} minutes only.
            </p>

            <form className="unlock-form" onSubmit={handleSubmit}>
              <label htmlFor="access-code">
                <IconKey size={14} /> Access code
              </label>
              <input
                ref={inputRef}
                id="access-code"
                name="code"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                maxLength={32}
                placeholder="Enter code"
                required
              />
              <button type="submit">Open in new tab</button>
              {error ? (
                <p className="form-error" role="alert">
                  {error}
                </p>
              ) : (
                <p className="form-hint">
                  Token expires after {ACCESS.ttlMinutes} minutes. Unlock again
                  for a fresh link.
                </p>
              )}
            </form>
          </>
        ) : (
          <>
            <p className="modal-copy">
              Preview opened in a new tab. That token stays valid for{" "}
              {ACCESS.ttlMinutes} minutes.
            </p>
            <button type="button" className="btn" onClick={onClose}>
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );
}
