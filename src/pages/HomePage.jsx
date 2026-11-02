import { useMemo, useState } from "react";
import ActiveTokenStrip from "../components/ActiveTokenStrip";
import CatalogToolbar from "../components/CatalogToolbar";
import ComingSoonModal from "../components/ComingSoonModal";
import SiteHeader from "../components/SiteHeader";
import TemplateAccessModal from "../components/TemplateAccessModal";
import TemplateCard from "../components/TemplateCard";
import {
  IconClock,
  IconCode,
  IconFolder,
  IconKey,
  IconPalette,
  IconShield,
  IconSpark,
  IconTab,
  IconUsers,
} from "../components/Icons";
import { ACCESS, APP } from "../config/constants";
import { templates } from "../data/templates";
import { hasActiveAccess } from "../lib/accessToken";

const FLOW = [
  {
    icon: IconKey,
    title: "Enter the code",
    text: "Click a template card. A popup asks for that sample’s access code.",
  },
  {
    icon: IconTab,
    title: "Open a fresh tab",
    text: "Atlas Room issues a token and opens the live preview in a new tab.",
  },
  {
    icon: IconClock,
    title: `${ACCESS.ttlMinutes} minute window`,
    text: "When the timer ends, the preview blocks until you unlock again.",
  },
];

const PUBLIC_POINTS = [
  {
    icon: IconShield,
    title: "Codes before pages",
    text: "A sample only opens after its code. When the window ends, the link goes quiet.",
  },
  {
    icon: IconUsers,
    title: "Each sample keeps its look",
    text: "The room stays forest and sand. Inside each tab, the template owns colour and type.",
  },
  {
    icon: IconSpark,
    title: "Space to grow",
    text: "Live pages sit next to reserved slots, so the catalog already feels like a set.",
  },
];

const BUILDER_STEPS = [
  {
    icon: IconFolder,
    title: "Copy a folder",
    text: (
      <>
        Duplicate an existing folder under <code>public/templates/</code> into a
        new private code folder.
      </>
    ),
  },
  {
    icon: IconPalette,
    title: "Own the look",
    text: "Give that sample its own colours, fonts, and demo config.",
  },
  {
    icon: IconCode,
    title: "Register the card",
    text: (
      <>
        Add one object in <code>src/data/templates.js</code>, then tune{" "}
        <code>src/config/constants.js</code> for the shell. Keep the access code
        off the public UI — share it only with people you unlock for.
      </>
    ),
  },
];

function matchesQuery(template, query) {
  const haystack = [
    template.name,
    template.category,
    template.stack,
    template.summary,
    template.status,
    ...(template.tags || []),
    template.theme?.label,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

export default function HomePage() {
  const [selected, setSelected] = useState(null);
  const [comingSoon, setComingSoon] = useState(null);
  const [tick, setTick] = useState(0);
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  const categories = useMemo(() => {
    const unique = [...new Set(templates.map((item) => item.category))];
    return ["All", ...unique];
  }, []);

  const filteredBySearch = useMemo(() => {
    const cleaned = query.trim().toLowerCase();
    if (!cleaned) return templates;
    return templates.filter((template) => matchesQuery(template, cleaned));
  }, [query]);

  const categoryCounts = useMemo(() => {
    const counts = { All: filteredBySearch.length };
    for (const item of categories) {
      if (item === "All") continue;
      counts[item] = filteredBySearch.filter(
        (template) => template.category === item
      ).length;
    }
    return counts;
  }, [categories, filteredBySearch]);

  const filtered = useMemo(() => {
    if (category === "All") return filteredBySearch;
    return filteredBySearch.filter((template) => template.category === category);
  }, [category, filteredBySearch]);

  function handleOpen(template) {
    if (template.available === false) {
      setComingSoon(template);
      return;
    }
    setSelected(template);
  }

  return (
    <>
      <SiteHeader />
      <ActiveTokenStrip refreshKey={tick} />

      <main>
        <section className="hero">
          <div className="hero-glow" aria-hidden="true" />
          <div className="hero-orb hero-orb--one" aria-hidden="true" />
          <div className="hero-orb hero-orb--two" aria-hidden="true" />

          <div className="wrap hero-layout">
            <div className="hero-copy reveal">
              <p className="eyebrow">
                <IconSpark size={14} />
                {APP.eyebrow}
              </p>
              <p className="hero-brand">{APP.name}</p>
              <h1>{APP.headline}</h1>
              <p className="lede">{APP.lede}</p>

              <div className="hero-actions">
                <a className="btn" href="#catalog">
                  Browse templates
                </a>
                <a className="btn ghost" href="#flow">
                  See the flow
                </a>
              </div>
            </div>

            <aside className="hero-panel reveal reveal-delay" aria-label="Access highlights">
              <div className="hero-panel-top">
                <span className="hero-panel-badge">Live desk</span>
                <strong>Timed private previews</strong>
              </div>
              <ul className="hero-features">
                <li>
                  <span className="feature-icon">
                    <IconKey />
                  </span>
                  <div>
                    <strong>Code gate</strong>
                    <p>Each template opens only with its own access code.</p>
                  </div>
                </li>
                <li>
                  <span className="feature-icon">
                    <IconTab />
                  </span>
                  <div>
                    <strong>New-tab preview</strong>
                    <p>The sample runs alone, with its own colours and type.</p>
                  </div>
                </li>
                <li>
                  <span className="feature-icon">
                    <IconClock />
                  </span>
                  <div>
                    <strong>{ACCESS.ttlMinutes}-minute token</strong>
                    <p>Timed access keeps private demos from staying open forever.</p>
                  </div>
                </li>
              </ul>
            </aside>
          </div>
        </section>

        <section className="section" id="catalog" aria-labelledby="catalog-title">
          <div className="wrap">
            <div className="section-head reveal">
              <p className="eyebrow">Catalog</p>
              <h2 id="catalog-title">{APP.catalogTitle}</h2>
              <p>{APP.catalogLede}</p>
            </div>

            <CatalogToolbar
              categories={categories}
              category={category}
              onCategoryChange={setCategory}
              query={query}
              onQueryChange={setQuery}
              counts={categoryCounts}
            />

            {filtered.length ? (
              <div className="catalog-stage" aria-live="polite">
                <span className="catalog-stage-wash" aria-hidden="true">
                  {filtered.length}
                </span>
                <div className="template-grid">
                  {filtered.map((template, index) => (
                    <div
                      key={`${template.code}-${tick}`}
                      className="reveal"
                      style={{ animationDelay: `${0.08 + index * 0.06}s` }}
                    >
                      <TemplateCard
                        template={template}
                        unlocked={hasActiveAccess(template.code)}
                        onOpen={handleOpen}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="catalog-empty" role="status">
                <IconSpark size={22} />
                <h3>No templates match</h3>
                <p>Try another category or clear the search.</p>
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() => {
                    setCategory("All");
                    setQuery("");
                  }}
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="section flow" id="flow" aria-labelledby="flow-title">
          <div className="wrap">
            <div className="section-head reveal">
              <p className="eyebrow">Access flow</p>
              <h2 id="flow-title">How a preview opens</h2>
              <p>Three short moves from catalog card to live sample.</p>
            </div>

            <ol className="flow-grid">
              {FLOW.map((item, index) => {
                const Icon = item.icon;
                return (
                  <li
                    key={item.title}
                    className="flow-card reveal"
                    style={{ animationDelay: `${0.1 + index * 0.08}s` }}
                  >
                    <span className="flow-index">0{index + 1}</span>
                    <span className="flow-icon">
                      <Icon size={22} />
                    </span>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        <section className="section public-value" aria-labelledby="public-title">
          <div className="wrap">
            <div className="section-head reveal">
              <p className="eyebrow">Why this desk</p>
              <h2 id="public-title">{APP.publicTitle}</h2>
              <p>{APP.publicLede}</p>
            </div>

            <div className="add-grid">
              {PUBLIC_POINTS.map((item, index) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.title}
                    className="add-card reveal"
                    style={{ animationDelay: `${0.1 + index * 0.08}s` }}
                  >
                    <span className="add-icon">
                      <Icon size={20} />
                    </span>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                );
              })}
            </div>

            <details className="builder-notes reveal">
              <summary>
                <span>
                  <strong>{APP.builderTitle}</strong>
                  <span className="builder-notes-copy">{APP.builderLede}</span>
                </span>
              </summary>
              <div className="builder-notes-body">
                {BUILDER_STEPS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <article key={item.title} className="builder-step">
                      <span className="add-icon">
                        <Icon size={18} />
                      </span>
                      <div>
                        <h3>{item.title}</h3>
                        <p>{item.text}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </details>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="wrap footer-row">
          <div>
            <strong>{APP.name}</strong>
            <p>{APP.footerNote}</p>
          </div>
          <p className="footer-mark">{APP.mark}</p>
        </div>
      </footer>

      {selected ? (
        <TemplateAccessModal
          template={selected}
          onClose={() => setSelected(null)}
          onIssued={() => setTick((value) => value + 1)}
        />
      ) : null}

      {comingSoon ? (
        <ComingSoonModal
          template={comingSoon}
          onClose={() => setComingSoon(null)}
        />
      ) : null}
    </>
  );
}
