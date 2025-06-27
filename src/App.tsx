
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { App as AppPage } from './pages/App'
import { BriefDetail } from './pages/BriefDetail'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<AppPage />} />
        <Route path="/brief/:id" element={<BriefDetail />} />
      </Routes>
    </Router>
  )
}

export default App
