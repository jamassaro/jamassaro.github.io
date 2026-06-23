import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import LayOut from './components/LayOut/LayOut'
import { usePageTransition } from './hooks/useAnimations'
import PageLoader from './components/ui/PageLoader'
import Home from './pages/Home/Home' // Direct import for faster initial load

// Only lazy load secondary pages for code splitting
const ProjectPage = lazy(() => import('./pages/projects/ProjectPage'))

function App() {
  usePageTransition();

  return (
    <Router>
      <Routes>
        <Route path='/' element={<LayOut><Home /></LayOut>} exact />
        <Route path='/projects/:name' element={
          <Suspense fallback={<PageLoader />}>
            <LayOut><ProjectPage/></LayOut>
          </Suspense>
        } exact/>
      </Routes>
    </Router> 
  )
}

export default App
