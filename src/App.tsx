import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Practice from './pages/Practice'
import Subjects from './pages/Subjects'
import FAQ from './pages/FAQ'
import Knowledge from './pages/Knowledge'
import ReadingDetail from './pages/ReadingDetail'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/knowledge" element={<Knowledge />} />
          <Route path="/knowledge/reading/:topic/:level" element={<ReadingDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
