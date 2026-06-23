// Expertise Data Structure - Following DRY principle
// Centralized expertise and tech stack data

import NEXTJS from '../assets/logos/frontend/nextjs.svg';
import TYPESCRIPT from '../assets/logos/frontend/typescript.svg';
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
    id: 'frontend',
    label: 'expertise.frontend.label',
    title: 'expertise.frontend.title',
    color: 'blue',
    description: 'expertise.frontend.description',
    technologies: [
      { name: 'React', icon: ReactLogo, color: 'blue' },
      { name: 'NextJs', icon: NEXTJS, color: 'blue', invertOnDark: true },
      { name: 'TypeScript', icon: TYPESCRIPT, color: 'blue' },
      { name: 'JavaScript', icon: JavaScript, color: 'yellow' },
      { name: 'Tailwind', icon: Tailwind, color: 'blue' },
      { name: 'SASS', icon: SASS, color: 'purple' },
    ],
  },
  {
    id: 'backend',
    label: 'expertise.backend.label',
    title: 'expertise.backend.title',
    color: 'green',
    description: 'expertise.backend.description',
    technologies: [
      { name: 'Node.js', icon: NODE, color: 'green' },
      { name: 'Express', icon: Express, color: 'green' },
      { name: 'JavaScript', icon: JavaScript, color: 'yellow' },
    ],
  },
  {
    id: 'testing-reliability',
    label: 'expertise.testing.label',
    title: 'expertise.testing.title',
    color: 'red',
    description: 'expertise.testing.description',
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
    label: 'expertise.cloud.label',
    title: 'expertise.cloud.title',
    color: 'purple',
    description: 'expertise.cloud.description',
    technologies: [
      { name: 'AWS', icon: AWS, color: 'yellow' },
      { name: 'Firebase', icon: Firebase, color: 'yellow' },
      { name: 'Docker', icon: DOCKER, color: 'blue' },
      { name: 'GitHub', icon: GITHUB, color: 'purple' },
    ],
  },
];
