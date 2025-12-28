
// Internship types
export interface Internship {
  id: string;
  companyName: string;
  role: string;
  status: 'pending' | 'ongoing' | 'completed' | 'rejected';
  startDate: string;
  endDate?: string;
  description: string;
  location: string;
  skills: string[];
}

// Local storage keys
const STORAGE_KEY = 'internships';

// Mock internships
const mockInternships: Internship[] = [
  {
    id: '1',
    companyName: 'Tech Innovations Inc.',
    role: 'Frontend Developer Intern',
    status: 'completed',
    startDate: '2023-05-15',
    endDate: '2023-08-15',
    description: 'Worked on developing responsive web applications using React and TailwindCSS.',
    location: 'San Francisco, CA (Remote)',
    skills: ['React', 'JavaScript', 'TailwindCSS', 'Git']
  },
  {
    id: '2',
    companyName: 'DataViz Solutions',
    role: 'UX/UI Design Intern',
    status: 'ongoing',
    startDate: '2024-01-10',
    description: 'Creating user interfaces and conducting usability testing for data visualization tools.',
    location: 'New York, NY',
    skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research']
  },
  {
    id: '3',
    companyName: 'Global Software Labs',
    role: 'Full Stack Developer Intern',
    status: 'pending',
    startDate: '2024-06-01',
    description: 'Applied for a summer internship working on full stack development with MERN stack.',
    location: 'Boston, MA',
    skills: ['MongoDB', 'Express', 'React', 'Node.js']
  }
];

// Initialize local storage with mock data if empty
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockInternships));
  }
};

// Get all internships
export const getInternships = (): Internship[] => {
  initializeStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
};

// Get internship by ID
export const getInternshipById = (id: string): Internship | undefined => {
  const internships = getInternships();
  return internships.find(internship => internship.id === id);
};

// Add new internship
export const addInternship = (internship: Omit<Internship, 'id'>): Internship => {
  const internships = getInternships();
  const newInternship = {
    ...internship,
    id: Math.random().toString(36).substr(2, 9)
  };
  
  internships.push(newInternship);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(internships));
  
  return newInternship;
};

// Update existing internship
export const updateInternship = (updatedInternship: Internship): Internship => {
  const internships = getInternships();
  const index = internships.findIndex(i => i.id === updatedInternship.id);
  
  if (index !== -1) {
    internships[index] = updatedInternship;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(internships));
  }
  
  return updatedInternship;
};

// Delete internship
export const deleteInternship = (id: string): boolean => {
  const internships = getInternships();
  const filteredInternships = internships.filter(i => i.id !== id);
  
  if (filteredInternships.length !== internships.length) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredInternships));
    return true;
  }
  
  return false;
};
