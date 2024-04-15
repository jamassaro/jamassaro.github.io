import BupImage from '../assets/Logoblanco.png'
import Website from '../assets/website.png'
import Home from '../assets/images/braveup-app/home.png'
import Resources from '../assets/images/braveup-app/resources.png'
import ModoBupInbox from '../assets/images/braveup-app/modo-bup-inbox.png'
import ModoBupChatBox from  '../assets/images/braveup-app/modo-bup-chat-box.png'


export const myWorkData = [
    {
      title: 'BRAVE UP! Platform',
      cover: BupImage,
      color: '#17bebb',
      project: {
        navigation: 'braveup-app',
        name: 'BRAVE UP!',
        description: 'Web application designed to assist schools in predicting and preventing instances of bullying and cyberbullying.',
        images: [Home, Resources, ModoBupInbox, ModoBupChatBox],
        stack: ['React', 'Vite', 'React-router-v5', 'AntDesign', 'Firebase', 'Intercom', 'MixPanel', 'Vitest', 'React-Testing-Library'],
        url: 'app.braveup.co'
      }
    },
    {
      title: 'BRAVE UP! Webiste',
      cover: BupImage,
      color: '#6441a5',
      project: {
        navigation: 'braveup-website',
        name: 'BRAVE UP! website',
        description: '',
        images: [''],
        stack: 'hola mundo',
        url: 'www.braveup.co'
      }
    },
    {
      title: 'Website project',
      cover: Website,
      color: '',
      project: {
        navigation: 'website',
        name: 'Website for an independant lawyer',
        description: '',
        images: [''],
        stack: 'hola mundo',
        url: 'https://jamassaro.github.io/monicawebsite/'
      }
    }
    
  ]