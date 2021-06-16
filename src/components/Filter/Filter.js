export default function Filter({ changeFilter, filter }) {
  return (
    <input
      className="filter"
      type="text"
      onChange={changeFilter}
      value={filter}
      placeholder="Search..."
    />
  );
}
