import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CharacterCreation from './pages/CharacterCreation';

const App: React.FC = () => {
    return (
        <Router>
            <nav>
                <Link to="/">Home</Link> | <Link to="/character">Character Creation</Link>
            </nav>
            <Routes>
                <Route path="/" element={
                    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
                        <h1>Harry Potter TTRPG Starter</h1>
                        <p>Welcome to the magical world!</p>
                        </div>
                } />
                <Route path="/character" element={<CharacterCreation />} />
                </Routes>
                </Router>
    );
};

export default App;