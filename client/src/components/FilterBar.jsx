const CATEGORIES = [
  'All', 'Web Dev', 'JavaScript', 'Data Structures', 'Server',
  'Music', 'Information Technology', 'Gaming', 'Live', 'Spring Framework',
  'News', 'Movies',
];

/**
 * FilterBar component — horizontally scrollable category filter chips.
 * @param {string} activeCategory - currently selected category
 * @param {Function} onCategoryChange - callback when a category chip is clicked
 */
const FilterBar = ({ activeCategory, onCategoryChange }) => {
  return (
    <div className="flex gap-3 overflow-x-auto hide-scrollbar py-3 px-2">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          id={`filter-${cat.replace(/\s+/g, '-').toLowerCase()}`}
          onClick={() => onCategoryChange(cat)}
          className={`filter-chip shrink-0 ${
            activeCategory === cat ? 'filter-chip-active' : 'filter-chip-inactive'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
