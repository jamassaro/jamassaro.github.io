import { Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import { initGA, logPageView } from './configs/analytics'
import LayOut from './components/LayOut/LayOut'
import { usePageTransition } from './hooks/useAnimations'
import PageLoader from './components/ui/PageLoader'
import Home from './pages/Home/Home' // Direct import for faster initial load

// Only lazy load secondary pages for code splitting
const ProjectPage = lazy(() => import('./pages/projects/ProjectPage'))

function App() {
  usePageTransition();

   const location = useLocation();
     
    useEffect(() => {
      // Initialize Google Analytics when the provider is mounted
      initGA();
    }, []);
  
    useEffect(() => {
      logPageView(location.pathname + location.search);
    },[location]);
  

  return (
      <Routes>
        <Route path='/' element={<LayOut><Home /></LayOut>} exact />
        <Route path='/projects/:name' element={
          <Suspense fallback={<PageLoader />}>
            <LayOut>
              <ProjectPage/>
              </LayOut>
          </Suspense>
        } exact/>
      </Routes>
  )
}

export default App
