import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/Header/Header';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import './styles/global.css';

function App() {
    return (
        <Router>
            <AuthProvider>
                <CartProvider>
                    <div className="app">
                        <Header />
                        <main>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/products" element={<Home />} />
                                {/* Add more routes as needed */}
                            </Routes>
                        </main>
                    </div>
                </CartProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
