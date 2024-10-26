import { Course, Section } from '../types';

export async function fetchCourseData(): Promise<{ courses: Course[], sections: Section[] }> {
  try {
    const response = await fetch('/data.json');
    const data = await response.json();
    
    const coursesMap = new Map<string, Course>();
    const sections: Section[] = [];

    data.forEach((item: any) => {
      // Convert rating from "N/A" or "X/10" to number
      const rating = item.calificacion === "N/A" ? 0 : parseInt(item.calificacion.split('/')[0]);

      if (!coursesMap.has(item.clave)) {
        coursesMap.set(item.clave, {
          id: item.clave,
          name: item.asignatura,
          code: item.clave
        });
      }

      sections.push({
        id: item.nrc,
        courseId: item.clave,
        professor: item.profesor,
        schedule: item.horario,
        campus: item.provincia,
        rating,
        nrc: item.nrc,
        modalidad: item.modalidad
      });
    });

    const courses = Array.from(coursesMap.values());
    return { courses, sections };
  } catch (error) {
    console.error('Error fetching course data:', error);
    return { courses: [], sections: [] };
  }
}