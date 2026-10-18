import { getCategoryClass } from '../utils/categoryColors.js'

// A row of buttons to pick one category. An empty string means "All".
function CategoryChips({ categories, selected, onSelect }) {
  const options = ['', ...categories]

  return (
    <div className="category-chips" role="group" aria-label="Event categories">
      {options.map((category) => (
        <button
          key={category || 'all'}
          type="button"
          className={`chip ${category ? getCategoryClass(category) : 'cat-all'} ${
            category === selected ? 'chip-active' : ''
          }`}
          aria-pressed={category === selected}
          onClick={() => onSelect(category)}
        >
          {category || 'All'}
        </button>
      ))}
    </div>
  )
}

export default CategoryChips
