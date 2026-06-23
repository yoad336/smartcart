import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import HomePage from './pages/HomePage'
import CreateListPage from './pages/CreateListPage'
import ComparePage from './pages/ComparePage'
import ResultPage from './pages/ResultPage'
import SavedListsPage from './pages/SavedListsPage'

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="app__main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreateListPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/saved" element={<SavedListsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
