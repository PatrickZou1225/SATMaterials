import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import PasswordGate from './components/PasswordGate'
import Home from './pages/Home'
import Practice from './pages/Practice'
import Subjects from './pages/Subjects'
import FAQ from './pages/FAQ'
import Knowledge from './pages/Knowledge'
import HardProblems from './pages/HardProblems'
import ReadingDetail from './pages/ReadingDetail'
import MockTestList from './pages/MockTestList'
import MockTest from './pages/MockTest'

function App() {
  return (
    <PasswordGate>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/knowledge" element={<Knowledge />} />
            <Route path="/knowledge/reading/:topic/:level" element={<ReadingDetail />} />
            <Route path="/hard-problems" element={<HardProblems />} />
            <Route path="/hard-problems/:className" element={<HardProblems />} />
            <Route path="/mock-test/:testId/:moduleIndex" element={<MockTest />} />
            <Route path="/mock-test" element={<MockTestList />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PasswordGate>
  )
}

export default App
