
// Project types
export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
  startDate: string;
  endDate?: string;
  status: 'in-progress' | 'completed' | 'on-hold';
  imageUrl?: string;
}

// Local storage keys
const STORAGE_KEY = 'projects';

// Mock projects
const mockProjects: Project[] = [
  {
    id: '1',
    title: 'E-commerce Website Redesign',
    description: 'Redesigned and implemented a responsive e-commerce website with modern UI and enhanced user experience.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'TailwindCSS'],
    githubUrl: 'https://github.com/username/ecommerce',
    demoUrl: 'https://ecommerce-demo.example.com',
    startDate: '2023-09-10',
    endDate: '2023-12-20',
    status: 'completed'
  },
  {
    id: '2',
    title: 'Weather Forecast App',
    description: 'Built a weather application that provides real-time forecasts and historical weather data.',
    technologies: ['JavaScript', 'HTML', 'CSS', 'OpenWeather API'],
    githubUrl: 'https://github.com/username/weather-app',
    startDate: '2024-01-05',
    status: 'in-progress'
  },
  {
    id: '3',
    title: 'Task Management System',
    description: 'Developing a comprehensive task management system with team collaboration features.',
    technologies: ['React', 'Firebase', 'Material UI'],
    githubUrl: 'https://github.com/username/task-manager',
    startDate: '2023-11-15',
    status: 'in-progress'
  }
];

// Initialize local storage with mock data if empty
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockProjects));
  }
};

// Get all projects
export const getProjects = (): Project[] => {
  initializeStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
};

// Get project by ID
export const getProjectById = (id: string): Project | undefined => {
  const projects = getProjects();
  return projects.find(project => project.id === id);
};

// Add new project
export const addProject = (project: Omit<Project, 'id'>): Project => {
  const projects = getProjects();
  const newProject = {
    ...project,
    id: Math.random().toString(36).substr(2, 9)
  };
  
  projects.push(newProject);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  
  return newProject;
};

// Update existing project
export const updateProject = (updatedProject: Project): Project => {
  const projects = getProjects();
  const index = projects.findIndex(p => p.id === updatedProject.id);
  
  if (index !== -1) {
    projects[index] = updatedProject;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }
  
  return updatedProject;
};

// Delete project
export const deleteProject = (id: string): boolean => {
  const projects = getProjects();
  const filteredProjects = projects.filter(p => p.id !== id);
  
  if (filteredProjects.length !== projects.length) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredProjects));
    return true;
  }
  
  return false;
};
