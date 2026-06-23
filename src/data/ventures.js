// Ventures Data Structure - BRAVE UP! Projects
// Following DRY principle - centralized venture data

// Import BRAVE UP! images
import BupLogo from '../assets/Logoblanco.png';

// BRAVE UP! Platform images
import AppHome from '../assets/images/braveup-app/home.png';
import AppResources from '../assets/images/braveup-app/resources.png';
import AppInbox from '../assets/images/braveup-app/modo-bup-inbox.png';
import AppChatBox from '../assets/images/braveup-app/modo-bup-chat-box.png';

// BRAVE UP! Website images
import WebHome from '../assets/images/braveup-web/home.png';
import WebFunction from '../assets/images/braveup-web/function.png';
import WebTestimonials from '../assets/images/braveup-web/testimonials.png';
import WebFooter from '../assets/images/braveup-web/footer.png';
import WebContact from '../assets/images/braveup-web/contact.png';

// BRAVE UP! Admin images
import AdminHome from '../assets/images/braveup-admin/home.png';
import AdminResources from '../assets/images/braveup-admin/resources.png';
import AdminUsers from '../assets/images/braveup-admin/user-create.png';
import AdminDiagnosis from '../assets/images/braveup-admin/diagnosis.png';

// Import tech icons
import reactIcon from '../assets/logos/frontend/react.svg';
import viteIcon from '../assets/logos/others/firebase.svg'; // Using as placeholder for Vite
import firebaseIcon from '../assets/logos/others/firebase.svg';
import vitestIcon from '../assets/logos/testing/vitest.svg';

export const venturesData = [
  {
    id: 'braveup-platform',
    titleKey: 'BRAVE UP! Platform',
    descriptionKey: 'my-work.my-work-page.project-1.braveup-app-description',
    category: 'EdTech Platform',
    logo: BupLogo,
    coverImage: AppHome,
    images: [AppHome, AppResources, AppInbox, AppChatBox],
    technologies: [
      { name: 'React', icon: reactIcon, color: 'blue' },
      { name: 'Vite', icon: null, color: 'purple' },
      { name: 'Firebase', icon: firebaseIcon, color: 'purple' },
      { name: 'AntDesign', icon: null, color: 'blue' },
      { name: 'Vitest', icon: vitestIcon, color: 'green' },
      { name: 'React TL', icon: null, color: 'red' },
      { name: 'Intercom', icon: null, color: 'blue' },
      { name: 'MixPanel', icon: null, color: 'purple' },
      { name: 'D3', icon: null, color: 'green' }
    ],
    url: 'https://app.braveup.co',
    urlDisplay: 'app.braveup.co',
    status: 'active',
    year: '2023-2025',
    featured: true,
    accentColor: '#17bebb'
  },
  {
    id: 'braveup-website',
    titleKey: 'BRAVE UP! Website',
    descriptionKey: 'my-work.my-work-page.project-2.braveup-website-description',
    category: 'Marketing Site',
    logo: BupLogo,
    coverImage: WebHome,
    images: [WebHome, WebFunction, WebTestimonials, WebFooter, WebContact],
    technologies: [
      { name: 'React', icon: reactIcon, color: 'blue' },
      { name: 'CRA', icon: reactIcon, color: 'blue' },
      { name: 'AntDesign', icon: null, color: 'blue' },
      { name: 'Google Analytics', icon: null, color: 'purple' },
      { name: 'Google Forms', icon: null, color: 'green' }
    ],
    url: 'https://www.braveup.com',
    urlDisplay: 'www.braveup.com',
    status: 'active',
    year: '2023',
    featured: true,
    accentColor: '#6441a5'
  },
  {
    id: 'braveup-admin',
    titleKey: 'BRAVE UP! Admin',
    descriptionKey: 'my-work.my-work-page.project-3.braveup-admin-description',
    category: 'Admin Platform',
    logo: BupLogo,
    coverImage: AdminHome,
    images: [AdminHome, AdminResources, AdminUsers, AdminDiagnosis],
    technologies: [
      { name: 'React', icon: reactIcon, color: 'blue' },
      { name: 'Vite', icon: null, color: 'purple' },
      { name: 'Firebase', icon: firebaseIcon, color: 'purple' },
      { name: 'AntDesign', icon: null, color: 'blue' },
      { name: 'Vitest', icon: vitestIcon, color: 'green' },
      { name: 'React TL', icon: null, color: 'red' }
    ],
    url: 'https://admin.braveup.co',
    urlDisplay: 'admin.braveup.co',
    status: 'active',
    year: '2023-2025',
    featured: true,
    accentColor: '#4edea3'
  }
];

// Filter functions
export const getFeaturedVentures = () => {
  return venturesData.filter(venture => venture.featured);
};

export const getVentureById = (id) => {
  return venturesData.find(venture => venture.id === id);
};
