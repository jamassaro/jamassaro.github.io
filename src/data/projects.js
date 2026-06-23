// Projects Data Structure
// Following DRY principle - centralized project data

// Import tech icons
import reactIcon from '../assets/logos/frontend/react.svg';
import tailwindIcon from '../assets/logos/frontend/tailwind.svg';
import expressIcon from '../assets/logos/backend/express.svg';
import firebaseIcon from '../assets/logos/others/firebase.svg';
import awsIcon from '../assets/logos/others/aws.svg';
import vitestIcon from '../assets/logos/testing/vitest.svg';
import cypressIcon from '../assets/logos/testing/cypress.svg';

// Import project images (if available)
// Note: Add actual project screenshots to /src/assets/images/projects/
// For now, using placeholders or no images

export const projectsData = [
  {
    id: 'deal-advisor-app',
    titleKey: 'projects.project-1.title', // "DEAL ADVISOR"
    descriptionKey: 'projects.project-1.description',
    category: 'QA & AI',
    technologies: [
      { name: 'NextJs', icon: null, color: 'blue' },
      { name: 'Tailwind', icon: null, color: 'red' },
      {name: 'TypeScript', icon: null, color: 'green' },
      { name: 'Vercel', icon: null, color: 'teal' },
      {name: 'Postgres', icon: null, color: 'yellow' },
      { name: 'Railway', icon: null, color: 'purple' },
      { name: 'OpenAI', icon: null, color: 'pink' },
       { name: 'Docker', icon: null, color: 'blue' }
    ],
    image: null, // Add image path when available
    link: 'https://www.dealadvisorapp.com', 
    featured: true,
    status: 'completed',
    year: '2026'
  },
  {
    id: 'personal-expenses',
    titleKey: 'projects.project-2.title', // "DATA BREW"
    descriptionKey: 'projects.project-2.description',
    category: 'FinTech',
    technologies: [
      { name: 'Next.js', icon: null, color: 'green' },
      { name: 'BullMQ', icon: null , color: 'brown' },
      { name: 'Tailwind', icon: null, color: 'blue' },
      { name: 'Supabase', icon: null, color: 'purple' },
      { name: 'Vercel', icon: null, color: 'teal'},
      {name: 'OCR', icon: null, color: 'green' },
      { name: 'NestJS', icon: null, color: 'red' },
      { name: 'Docker', icon: null, color: 'blue' }
    ],
    image: null, // Add image path when available
    link: 'https://www.databrewapp.com',
    featured: true,
    status: 'completed',
    year: '2024'
  },
];

// Filter functions for project display
export const getFeaturedProjects = () => {
  return projectsData.filter(project => project.featured);
};

export const getProjectsByCategory = (category) => {
  return projectsData.filter(project => project.category === category);
};

export const getProjectById = (id) => {
  return projectsData.find(project => project.id === id);
};
