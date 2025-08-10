// Database type definitions for Supabase integration

export interface Student {
  id: number;
  created_at: string;
  username: string;
  password: string;
  course: string;
  sem: number;
  roll: number;
}

export interface Teacher {
  id: number;
  created_at: string;
  username: string;
  password: string;
  course: string;
  semester: number;
}

export interface Subject {
  id: number;
  created_at: string;
  name: string;
  code: string;
  is_active: string;
  course: string;
  semester: number;
}

export interface Attendance {
  id: number;
  created_at: string;
  name: string;
  roll: number;
  subject: string;
  semester: string;
  course: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  student_id: number;
  subject_id: number;
}

export interface Database {
  public: {
    Tables: {
      students: {
        Row: Student;
        Insert: Omit<Student, 'id' | 'created_at'>;
        Update: Partial<Omit<Student, 'id' | 'created_at'>>;
      };
      teachers: {
        Row: Teacher;
        Insert: Omit<Teacher, 'id' | 'created_at'>;
        Update: Partial<Omit<Teacher, 'id' | 'created_at'>>;
      };
      subjects: {
        Row: Subject;
        Insert: Omit<Subject, 'id' | 'created_at'>;
        Update: Partial<Omit<Subject, 'id' | 'created_at'>>;
      };
      attendance: {
        Row: Attendance;
        Insert: Omit<Attendance, 'id' | 'created_at'>;
        Update: Partial<Omit<Attendance, 'id' | 'created_at'>>;
      };
    };
  };
}

// Course options for dropdowns
export const COURSES = [
  "Diploma In Administration Services",
  "Diploma In Apparel Manufacture and Design",
  "Diploma In Electronics",
  "Diploma In Food Technology",
  "Diploma In Interior Design",
  "Diploma In Medical Laboratory Technology",
  "Diploma In Ophthalmic Technology",
  "Diploma In Pharmacy",
  "Diploma In Jewellery Design & Manufacture",
  "B.Voc In Optometry",
  "B.Voc In Fashion Design",
  "B.Voc In Food Processing Technology",
  "B.Voc In Interior Design",
  "B.Voc In Jewellery Design"
] as const;

export type Course = typeof COURSES[number];

// Semester options
export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8] as const;
export type Semester = typeof SEMESTERS[number];
