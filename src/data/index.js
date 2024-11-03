import BupImage from '../assets/Logoblanco.png'
import Home from '../assets/images/braveup-app/home.png'
import Resources from '../assets/images/braveup-app/resources.png'
import ModoBupInbox from '../assets/images/braveup-app/modo-bup-inbox.png'
import ModoBupChatBox from  '../assets/images/braveup-app/modo-bup-chat-box.png'
import WebHome from '../assets/images/braveup-web/home.png'
import Function from '../assets/images/braveup-web/function.png'
import Testimonials from '../assets/images/braveup-web/testimonials.png'
import Footer from '../assets/images/braveup-web/footer.png'
import Contact from '../assets/images/braveup-web/contact.png'
import AdminHome from '../assets/images/braveup-admin/home.png'
import AdminResources from '../assets/images/braveup-admin/resources.png'
import AdminUsers from '../assets/images/braveup-admin/user-create.png'
import AdminDiagnosis from '../assets/images/braveup-admin/diagnosis.png'


export const myWorkData = [
    {
      title: 'BRAVE UP! Platform',
      cover: BupImage,
      color: '#17bebb',
      project: {
        navigation: 'braveup-app',
        name: 'BRAVE UP!',
        description: 'my-work.my-work-page.project-1.braveup-app-description',
        images: [Home, Resources, ModoBupInbox, ModoBupChatBox],
        stack: ['React', 'Vite', 'React-router-v5', 'AntDesign', 'Firebase', 'Intercom', 'MixPanel', 'Vitest', 'React-Testing-Library', 'D3'],
        url: 'app.braveup.co'
      }
    },
    {
      title: 'BRAVE UP! Website',
      cover: BupImage,
      color: '#6441a5',
      project: {
        navigation: 'braveup-website',
        name: 'BRAVE UP! website',
        description: 'my-work.my-work-page.project-2.braveup-website-description',
        images: [WebHome, Function, Testimonials, Footer, Contact],
        stack: ['React', 'CRA', 'React-router-v6', 'AntDesign', 'Google Analytics', 'Connected to google form'],
        url: 'www.braveup.com'
      }
     },
     {
     title: 'BRAVE UP! Admin',
       cover: WebHome,
       color: '',
       project: {
         navigation: 'braveup-admin',
         name: 'BRAVE UP! Admin',
         description: 'my-work.my-work-page.project-3.braveup-admin-description',
         images: [AdminHome, AdminResources, AdminUsers, AdminDiagnosis],
         stack: ['React', 'Vite', 'React-router-v5', 'AntDesign', 'Firebase', 'Vitest', 'React-Testing-Library'],
         url: 'admin.braveup.co'
       }
     },
  ]

  export const projects = [
    {
      projectName: 'projects.project-1.title',
      technologies: ['React', 'Java', 'Azure-SSO', 'AWS', 'Vitest', 'React-Testing-Library'],
      description: 'projects.project-1.description'
    },
    {
      projectName: 'projects.project-2.title',
      technologies: ['Next.js', 'React Native', 'Tailwind', 'Clerk'],
      description: 'projects.project-2.description'
    },
    {
      projectName: 'projects.project-3.title',
      technologies: ['React', 'Tailwind', 'Express', 'firabase', 'Vitest', 'React-Testing-Library'],
      description: 'projects.project-3.description'
    }
  ]