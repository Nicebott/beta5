import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GraduationCap, Menu, X } from 'lucide-react';
import SearchBar from './components/SearchBar';
import CourseTable from './components/CourseTable';
import Pagination from './components/Pagination';
import { Course, Section } from './types';
import { fetchCourseData } from './api/courseData';
import { removeDiacritics } from './utils/stringUtils';

const ALL_CAMPUSES = [
  'Santo Domingo',
  'Santiago',
  'San Francisco de Macorís',
  'Puerto Plata',
  'San Juan de la Maguana',
  'Barahona',
  'Mao',
  'Hato Mayor',
  'Higüey',
  'Bonao',
  'La Vega',
  'Baní',
  'Azua',
  'Neyba',
  'Cotuí',
  'Nagua',
  'Dajabón'
];

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [allSections, setAllSections] = useState<Section[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedCampus, setSelectedCampus] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCourseData().then(({ courses, sections }) => {
      setAllCourses(courses);
      setAllSections(sections);
    });
  }, []);

  const handleSearch = useCallback((query: string, campus: string) => {
    setSearchQuery(query);
    setSelectedCampus(campus);
    setCurrentPage(1);
  }, []);

  const filteredSections = useMemo(() => {
    const normalizedQuery = removeDiacritics(searchQuery.toLowerCase());
    
    return allSections.filter(section => {
      const matchesSearch = !normalizedQuery || 
        removeDiacritics(section.professor.toLowerCase()).includes(normalizedQuery) ||
        allCourses.some(course => 
          course.id === section.courseId && 
          (removeDiacritics(course.name.toLowerCase()).includes(normalizedQuery) ||
           removeDiacritics(course.code.toLowerCase()).includes(normalizedQuery))
        );

      const matchesCampus = !selectedCampus || section.campus === selectedCampus;

      return matchesSearch && matchesCampus;
    });
  }, [allSections, allCourses, searchQuery, selectedCampus]);

  const totalItems = filteredSections.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // Ensure current page is valid
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [totalPages, currentPage]);

  // Get current page items
  const currentSections = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSections.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSections, currentPage, itemsPerPage]);

  const currentCourses = useMemo(() => {
    const courseIds = new Set(currentSections.map(section => section.courseId));
    return allCourses.filter(course => courseIds.has(course.id));
  }, [currentSections, allCourses]);

  const handleRateSection = useCallback((sectionId: string, rating: number) => {
    setAllSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId ? { ...section, rating } : section
      )
    );
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  }, [totalPages]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center relative">
          <div className="flex items-center">
            <GraduationCap size={48} className="text-blue-600 mr-4" />
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
              Programación Docente UASD 2024-20
            </h1>
          </div>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <nav className={`${isMenuOpen ? 'block' : 'hidden'} md:block absolute md:relative top-full right-0 w-48 md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none z-10`}>
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 md:flex md:space-x-4 md:space-y-0">
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:text-blue-800 hover:bg-gray-100">Inicio</a>
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:text-blue-800 hover:bg-gray-100">Virtual</a>
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:text-blue-800 hover:bg-gray-100">SemiPresencial</a>
            </div>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center">
          <SearchBar 
            onSearch={handleSearch} 
            campuses={ALL_CAMPUSES} 
            selectedCampus={selectedCampus} 
          />
          {currentSections.length > 0 ? (
            <>
              <CourseTable
                courses={currentCourses}
                sections={currentSections}
                onRateSection={handleRateSection}
              />
              <Pagination
                itemsPerPage={itemsPerPage}
                totalItems={totalItems}
                paginate={handlePageChange}
                currentPage={currentPage}
              />
              <p className="text-sm text-gray-600 mt-4">
                Mostrando {currentSections.length} de {totalItems} resultados
                {selectedCampus && ` en ${selectedCampus}`}
              </p>
            </>
          ) : (
            <p className="mt-8 text-lg text-gray-600">
              {selectedCampus
                ? `No se encontraron asignaturas para el campus de ${selectedCampus}.`
                : "No se encontraron asignaturas que coincidan con la búsqueda."}
            </p>
          )}
        </div>
      </main>
      
      <footer className="bg-white shadow-md mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-gray-500">
          © 2024 Nicebott. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}

export default App;