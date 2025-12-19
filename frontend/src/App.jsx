import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import FitnessTracker from "./pages/TrackerPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<FitnessTracker />} />
      </Routes>
    </Router>
  );
}

export default App;