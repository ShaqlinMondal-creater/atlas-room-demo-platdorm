import { IconSearch } from "./Icons";

export default function CatalogToolbar({
  categories,
  category,
  onCategoryChange,
  query,
  onQueryChange,
  counts,
}) {
  return (
    <div className="catalog-toolbar">
      <div className="catalog-search">
        <IconSearch size={16} />
        <label className="visually-hidden" htmlFor="catalog-search">
          Search templates
        </label>
        <input
          id="catalog-search"
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search by name or tag"
          autoComplete="off"
        />
      </div>

      <div className="catalog-chips" role="tablist" aria-label="Template categories">
        {categories.map((item) => {
          const active = category === item;
          const count = counts[item] ?? 0;
          return (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={active}
              className={`catalog-chip ${active ? "is-active" : ""}`}
              onClick={() => onCategoryChange(item)}
            >
              <span>{item}</span>
              <span className="catalog-chip-count">{count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
