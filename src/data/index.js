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
        images: [WebHome,
          Function,
          Testimonials,
          Footer,
          Contact],
        stack: ['React', 'CRA', 'React-router-v6', 'AntDesign', 'Google Analytics', 'Connected to google form'],
        url: 'www.braveup.com'
      }
     },
     {
     title: 'BRAVE UP! Administrator',
       cover: WebHome,
       color: '',
       project: {
         navigation: 'braveup-admin',
         name: 'BRAVE UP! Admin',
         description: '',
         images: [''],
         stack: ['React', 'Vite', 'Express'],
         url: 'admin.braveup.co'
       }
     },
    // {
    //   title: 'BRAVE UP! Corporation',
    //   cover: Website,
    //   color: '',
    //   project: {
    //     navigation: 'braveup-corp',
    //     name: 'BRAVE UP! Corp',
    //     description: '',
    //     images: [''],
    //     stack: ['hola mundo'],
    //     url: 'corp.braveup.com'
    //   }
    // },
    
  ]