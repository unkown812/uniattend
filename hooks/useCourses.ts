import { useState } from 'react';
import { COURSES } from '../types/database';

export const useCourses = () => {
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  return {
    courses: COURSES,
    selectedCourse,
    setSelectedCourse,
  };
};

export const courses = COURSES;