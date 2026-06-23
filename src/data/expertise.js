// Expertise Data Structure - Following DRY principle
// Centralized expertise and tech stack data

import NEXTJS from '../assets/logos/frontend/nextjs.svg';
import TYPESCRIPT from '../assets/logos/frontend/typescript.svg';
import AGGRID from '../assets/logos/frontend/ag-grid.svg';
import JavaScript from '../assets/logos/frontend/react-query-icon.svg';
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
import PYTHON from '../assets/logos/backend/python.svg';
import FASTAPI from '../assets/logos/backend/fastapi.svg';
import CLAUDE from '../assets/logos/backend/claude.svg';
import VERTEXAI from '../assets/logos/backend/vertexai.svg';
import POSTGRES from '../assets/logos/data/postgresql.svg';
import BIGQUERY from '../assets/logos/data/bigquery.svg';
import REDIS from '../assets/logos/data/redis.svg';
import VECTOREMBEDDINGS from '../assets/logos/data/vector-embeddings.svg';
import SEMANTICSEARCH from '../assets/logos/data/semantic-search.svg';
import GCP from '../assets/logos/others/gcp.svg';
import CICD from '../assets/logos/others/cicd.svg';
import TERRAFORM from '../assets/logos/others/terraform.svg';
 
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
      { name: 'React Query', icon: JavaScript, color: 'blue' },
      { name: 'Tailwind', icon: Tailwind, color: 'blue' },
      { name: 'AG Grid', icon: AGGRID, color: 'blue' },
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
      { name: 'Express', icon: Express, color: 'green', invertOnDark: true },
      { name: 'Python', icon: PYTHON, color: 'green', invertOnDark: true },
      { name: 'FastApi', icon: FASTAPI, color: 'green' },
      { name: 'Claude', icon: CLAUDE, color: 'green' },
      { name: 'Vertex AI', icon: VERTEXAI, color: 'green' },
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
    id: 'data-intelligence',
    label: 'expertise.data-intelligence.label',
    title: 'expertise.data-intelligence.title',
    color: 'orange',
    description: 'expertise.data-intelligence.description',
    technologies: [
      { name: 'PostgresSQL', icon: POSTGRES, color: 'yellow' },
      { name: 'BigQuery', icon: BIGQUERY, color: 'yellow' },
      { name: 'Redis', icon: REDIS, color: 'blue' },
      { name: 'Semantic Search', icon: SEMANTICSEARCH, color: 'purple', invertOnDark: true },
      { name: 'Vector Embeddings', icon: VECTOREMBEDDINGS, color: 'purple', invertOnDark: true },
    ],

  },
  {
    id: 'cloud-devops',
    label: 'expertise.cloud.label',
    title: 'expertise.cloud.title',
    color: 'purple',
    description: 'expertise.cloud.description',
    technologies: [
      { name: 'AWS', icon: AWS, color: 'yellow', invertOnDark: true  },
      { name: 'Google Cloud Platform', icon: GCP, color: 'yellow' },
      { name: 'Docker', icon: DOCKER, color: 'blue' },
      {name: 'CICD', icon: CICD, color: 'blue', invertOnDark: true },
      { name: 'Terraform', icon: TERRAFORM, color: 'blue', invertOnDark: true  },
      { name: 'GitHub', icon: GITHUB, color: 'purple' , invertOnDark: true },
    ],
  },
];
