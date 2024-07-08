import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from "./pages/Home/Home"
import ProjectPage from './pages/projects/ProjectPage'
import LayOut from './components/LayOut/LayOut'
import NbaDataPage from './pages/skills/nba-data/nbaDataPage'
import TeamsByConferencePage from './pages/skills/nba-data/teamsByConferencePage'
import TeamPage from './pages/skills/nba-data/teamPage'
function App() {
  return (
    <Router>
      <Routes>
          <Route path='/' element={<LayOut><Home /></LayOut>} exact />
          <Route  path='/projects/:name' element={<LayOut><ProjectPage/></LayOut>} exact/>
          <Route path='/nba-data-page' element={<LayOut><NbaDataPage/></LayOut>} exact/>
          <Route path='/nba-data-page/conference/:conferenceName' element={<LayOut><TeamsByConferencePage /></LayOut>} exact />
          <Route path='/nba-data-page/conference/:conferenceName/team/:id' element={<LayOut><TeamPage /></LayOut>} exact/>
      </Routes>
    </Router> 
  )
}

export default App
