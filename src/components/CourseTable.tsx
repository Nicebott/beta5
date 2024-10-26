import React from 'react';
import { Course, Section } from '../types';
import { Star } from 'lucide-react';

interface CourseTableProps {
  courses: Course[];
  sections: Section[];
  onRateSection: (sectionId: string, rating: number) => void;
  darkMode: boolean;
}

const CourseTable: React.FC<CourseTableProps> = ({ courses, sections, onRateSection, darkMode }) => {
  return (
    <div className={`overflow-x-auto ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md rounded-lg w-full mt-8`}>
      <table className="min-w-full table-auto">
        <thead className={`${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-600'} uppercase text-sm leading-normal`}>
          <tr>
            <th className="py-3 px-2 sm:px-4 text-left">NRC</th>
            <th className="py-3 px-2 sm:px-4 text-left">Asignatura</th>
            <th className="py-3 px-2 sm:px-4 text-left">Profesor</th>
            <th className="py-3 px-2 sm:px-4 text-left">Campus</th>
            <th className="py-3 px-2 sm:px-4 text-left">Horario</th>
            <th className="py-3 px-2 sm:px-4 text-center">Calificación</th>
          </tr>
        </thead>
        <tbody className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm font-light`}>
          {sections.map((section) => {
            const course = courses.find(c => c.id === section.courseId);
            return (
              <tr key={section.id} className={`border-b ${
                darkMode 
                  ? 'border-gray-700 hover:bg-gray-700'
                  : 'border-gray-200 hover:bg-gray-100'
              }`}>
                <td className="py-3 px-2 sm:px-4 text-left whitespace-nowrap">
                  <span className="font-medium">{section.nrc}</span>
                </td>
                <td className="py-3 px-2 sm:px-4 text-left">
                  <span className="font-medium">{course?.name} ({course?.code})</span>
                </td>
                <td className="py-3 px-2 sm:px-4 text-left">
                  <span>{section.professor}</span>
                </td>
                <td className="py-3 px-2 sm:px-4 text-left">
                  <span>{section.campus}</span>
                </td>
                <td className="py-3 px-2 sm:px-4 text-left">
                  <span>{section.schedule} ({section.modalidad})</span>
                </td>
                <td className="py-3 px-2 sm:px-4">
                  <div className="flex justify-center items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        fill={star <= section.rating ? 'gold' : 'none'}
                        stroke="gold"
                        className="cursor-pointer"
                        onClick={() => onRateSection(section.id, star)}
                      />
                    ))}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CourseTable;