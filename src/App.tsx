import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { App as AppPage } from './pages/App'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<AppPage />} />
      </Routes>
    </Router>
  )
}

export default App