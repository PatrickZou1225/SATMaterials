import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Practice from './pages/Practice'
import Subjects from './pages/Subjects'
import FAQ from './pages/FAQ'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/faq" element={<FAQ />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
