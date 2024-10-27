import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string, campus: string) => void;
  campuses: string[];
  selectedCampus: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, campuses, selectedCampus }) => {
  const [query, setQuery] = useState('');
  const [campus, setCampus] = useState(selectedCampus);

  useEffect(() => {
    setCampus(selectedCampus);
  }, [selectedCampus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, campus);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch(query, campus);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full md:w-2/3 flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
      <div className="relative flex-grow w-full">
        <input
          type="text"
          placeholder="Buscar Materia o Profesor"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500"
        >
          <Search size={20} />
        </button>
      </div>
      <select
        value={campus}
        onChange={(e) => {
          setCampus(e.target.value);
          onSearch(query, e.target.value);
        }}
        className="w-full md:w-auto px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Todos los campus</option>
        {campuses.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </form>
  );
};

export default SearchBar;