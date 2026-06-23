import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import LayOut from './components/LayOut/LayOut'
import { usePageTransition } from './hooks/useAnimations'
import PageLoader from './components/ui/PageLoader'

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home/Home'))
const ProjectPage = lazy(() => import('./pages/projects/ProjectPage'))

function App() {
  usePageTransition();

  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path='/' element={<LayOut><Home /></LayOut>} exact />
          <Route path='/projects/:name' element={<LayOut><ProjectPage/></LayOut>} exact/>
        </Routes>
      </Suspense>
    </Router> 
  )
}

export default App
