import { useState } from "react";

function useBulkSelection<T>(initialSelected: T[] = []) {
  const [selected, setSelected] = useState<T[]>(initialSelected);

  const isSelected = (id: T) => selected.includes(id);

  const toggleSelection = (id: T) => {
    setSelected((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id]
    );
  };

  const selectAll = (ids: T[]) => {
    setSelected(ids);
  };

  const clearSelection = () => {
    setSelected([]);
  };

  return { selected, isSelected, toggleSelection, selectAll, clearSelection };
}

export default useBulkSelection;
