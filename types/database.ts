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
  subject_code: string;
  status: 'present' | 'absent' | 'late';
}
export interface AttendanceRecord {
  student_id: number;
  subject_id: number;
  date: string;
  status: 'present' | 'absent' | 'late';
  marked_by: string;
  subject_code:string
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
// export const COURSES = [
//   "diploma In Administration Services",
//   "diploma In Apparel Manufacture and Design",
//   "diploma In Electronics",
//   "diploma In Food Technology",
//   "diploma In Interior Design",
//   "diploma In Medical Laboratory Technology",
//   "diploma In Ophthalmic Technology",
//   "diploma In Pharmacy",
//   "diploma In Jewellery Design & Manufacture",
//   "B.Voc In Optometry",
//   "B.Voc In Fashion Design",
//   "B.Voc In Food Processing Technology",
//   "B.Voc In Interior Design",
//   "B.Voc In Jewellery Design"
// ] as const;

export const COURSES = [
  "diploma-administration-services",
  "diploma-apparel-manufacture-design",
  "diploma-electronics",
  "diploma-food-technology",
  "diploma-interior-design",
  "diploma-medical-lab-tech",
  "diploma-ophthalmic-tech",
  "diploma-pharmacy",
  "diploma-jewellery-design",
  "bvoc-optometry",
  "bvoc-fashion-design",
  "bvoc-food-processing",
  "bvoc-interior-design",
  "bvoc-jewellery-design"
] as const;

export const SUBJECTS = [
  "java",
  "css",
  "c",
] as const;

export type Course = typeof COURSES[number];

// Semester options
export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8] as const;
export type Semester = typeof SEMESTERS[number];
