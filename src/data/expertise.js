// Expertise Data Structure - Following DRY principle
// Centralized expertise and tech stack data

import HTML from '../assets/logos/frontend/html.svg';
import CSS from '../assets/logos/frontend/css.svg';
import SASS from '../assets/logos/frontend/sass.svg';
import JavaScript from '../assets/logos/frontend/javascript.svg';
import ReactLogo from '../assets/logos/frontend/react.svg';
import Tailwind from '../assets/logos/frontend/tailwind.svg';
import NODE from '../assets/logos/backend/nodejs.svg';
import Express from '../assets/logos/backend/express.svg';
import ReactTl from '../assets/logos/testing/octopus.png';
import Jest from '../assets/logos/testing/jest.svg';
import Mocha from '../assets/logos/testing/mocha.svg';
import Chai from '../assets/logos/testing/chai.svg';
import Vitest from '../assets/logos/testing/vitest.svg';
import Cypress from '../assets/logos/testing/cypress.svg';
import AWS from '../assets/logos/others/aws.svg';
import Firebase from '../assets/logos/others/firebase.svg';
import DOCKER from '../assets/logos/others/docker.svg';
import GITHUB from '../assets/logos/others/github.svg';

export const expertiseCategories = [
  {
    id: 'interface-architecture',
    label: 'INTERFACE_ARCHITECTURE',
    title: 'Interface Architecture',
    color: 'blue',
    description: 'Building responsive, accessible, and performant user interfaces with modern frameworks and best practices.',
    technologies: [
      { name: 'React', icon: ReactLogo, color: 'blue' },
      { name: 'HTML', icon: HTML, color: 'blue' },
      { name: 'CSS', icon: CSS, color: 'blue' },
      { name: 'JavaScript', icon: JavaScript, color: 'yellow' },
      { name: 'Tailwind', icon: Tailwind, color: 'blue' },
      { name: 'SASS', icon: SASS, color: 'purple' },
    ],
  },
  {
    id: 'server-logic',
    label: 'SERVER_LOGIC',
    title: 'Server Logic',
    color: 'green',
    description: 'Developing robust backend systems and APIs with focus on scalability and performance.',
    technologies: [
      { name: 'Node.js', icon: NODE, color: 'green' },
      { name: 'Express', icon: Express, color: 'green' },
      { name: 'JavaScript', icon: JavaScript, color: 'yellow' },
    ],
  },
  {
    id: 'quality-assurance',
    label: 'QUALITY_ASSURANCE',
    title: 'Quality Assurance',
    color: 'red',
    description: 'Ensuring code quality through comprehensive testing strategies and automation.',
    technologies: [
      { name: 'Vitest', icon: Vitest, color: 'yellow' },
      { name: 'Cypress', icon: Cypress, color: 'green' },
      { name: 'Jest', icon: Jest, color: 'red' },
      { name: 'Mocha', icon: Mocha, color: 'red' },
      { name: 'Chai', icon: Chai, color: 'red' },
      { name: 'React TL', icon: ReactTl, color: 'red' },
    ],
  },
  {
    id: 'cloud-devops',
    label: 'CLOUD_&_DEVOPS',
    title: 'Cloud & DevOps',
    color: 'purple',
    description: 'Managing cloud infrastructure and implementing CI/CD pipelines for efficient deployments.',
    technologies: [
      { name: 'AWS', icon: AWS, color: 'yellow' },
      { name: 'Firebase', icon: Firebase, color: 'yellow' },
      { name: 'Docker', icon: DOCKER, color: 'blue' },
      { name: 'GitHub', icon: GITHUB, color: 'purple' },
    ],
  },
];
