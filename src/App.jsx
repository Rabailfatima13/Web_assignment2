import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Events from './pages/Events.jsx'
import EventDetails from './pages/EventDetails.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import MyEvents from './pages/MyEvents.jsx'
import NotFound from './pages/NotFound.jsx'
import './App.css'

function App() {
  return (
    <>
      <Navbar />

      <main className="container">
        <Routes>
          <Route path="/" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/my-events" element={<MyEvents />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  )
}

export default App
