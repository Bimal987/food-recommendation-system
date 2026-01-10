import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Home from './pages/Home';
import Recommendations from './pages/Recommendations';

function App() {
  const [userId, setUserId] = useState(1);

  return (
    <Router>
      <div className="app">
        <Header
          currentUserId={userId}
          setUserId={setUserId}
        />

        <main>
          <Routes>
            <Route
              path="/"
              element={<Home userId={userId} />}
            />
            <Route
              path="/recommendations"
              element={<Recommendations userId={userId} />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
