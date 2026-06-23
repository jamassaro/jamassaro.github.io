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
      { name: 'React', icon: reactIcon, color: 'blue' },
      { name: 'Java', icon: null, color: 'red' },
      { name: 'Azure-SSO', icon: null, color: 'blue' },
      { name: 'AWS', icon: awsIcon, color: 'purple' },
      { name: 'Vitest', icon: vitestIcon, color: 'green' },
      { name: 'React TL', icon: null, color: 'red' }
    ],
    image: null, // Add image path when available
    link: 'https://www.dealadvisorapp.com', 
    featured: true,
    status: 'completed',
    year: '2026'
  },
  {
    id: 'personal-expenses',
    titleKey: 'projects.project-2.title', // "PERSONAL EXPENSES"
    descriptionKey: 'projects.project-2.description',
    category: 'FinTech',
    technologies: [
      { name: 'Next.js', icon: null, color: 'blue' },
      { name: 'React Native', icon: reactIcon, color: 'blue' },
      { name: 'Tailwind', icon: tailwindIcon, color: 'blue' },
      { name: 'Clerk', icon: null, color: 'purple' }
    ],
    image: null,
    link: null,
    featured: true,
    status: 'completed',
    year: '2024'
  },
  // {
  //   id: 'accurate',
  //   titleKey: 'projects.project-3.title', // "ACCURATE"
  //   descriptionKey: 'projects.project-3.description',
  //   category: 'AI & Safety',
  //   technologies: [
  //     { name: 'React', icon: reactIcon, color: 'blue' },
  //     { name: 'Tailwind', icon: tailwindIcon, color: 'blue' },
  //     { name: 'Express', icon: expressIcon, color: 'green' },
  //     { name: 'Firebase', icon: firebaseIcon, color: 'purple' },
  //     { name: 'Vitest', icon: vitestIcon, color: 'green' },
  //     { name: 'React TL', icon: null, color: 'red' }
  //   ],
  //   image: null,
  //   link: null,
  //   featured: true,
  //   status: 'completed',
  //   year: '2023'
  // }
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
