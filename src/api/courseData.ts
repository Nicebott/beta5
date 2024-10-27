import { Course, Section } from '../types';

export async function fetchCourseData(): Promise<{ courses: Course[], sections: Section[] }> {
  try {
    const response = await fetch('/data.json');
    const data = await response.json();
    
    const coursesMap = new Map<string, Course>();
    const sections: Section[] = [];

    data.forEach((item: any) => {
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
        rating: parseInt(item.calificacion.split('/')[0]),
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