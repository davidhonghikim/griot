import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import DocPage from './components/DocPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DocPage />} />
          <Route path="docs/*" element={<DocPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
