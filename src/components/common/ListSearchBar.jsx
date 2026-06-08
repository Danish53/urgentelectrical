"use client";

/**
 * @param {{
 *   value: string,
 *   onChange: (value: string) => void,
 *   placeholder?: string,
 *   id?: string,
 *   label?: string,
 *   className?: string,
 * }} props
 */
export default function ListSearchBar({
  value,
  onChange,
  placeholder = "Search by title or description…",
  id = "list-search",
  label = "Search list",
  className = "",
}) {
  return (
    <div className={`home1-list-search ${className}`.trim()}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div className="home1-list-search-inner">
        <svg
          className="home1-list-search-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
        </svg>
        <input
          id={id}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="home1-list-search-input"
          autoComplete="off"
          enterKeyHint="search"
        />
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="home1-list-search-clear"
            aria-label="Clear search"
          >
            ×
          </button>
        ) : null}
      </div>
    </div>
  );
}
