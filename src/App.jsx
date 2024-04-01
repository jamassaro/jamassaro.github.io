import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from "./pages/Home/Home"
import ProjectPage from './pages/projects/ProjectPage'
import LayOut from './components/LayOut/LayOut'


function App() {
  return (
    <Router>
      <Routes>
          <Route 
            path='/' 
            element={
              <LayOut>  
                <Home /> 
              </LayOut>
              } 
            exact
          />
          <Route 
            path='/projects/:name' 
            element={
              <LayOut>
                <ProjectPage/>
              </LayOut>
            } 
            exact
          />
      </Routes>
    </Router> 
  )
}

export default App
