import React, { useState } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import BookingFlow from './components/BookingFlow';
import MechanicConsole from './components/MechanicConsole';

function App() {
    const [currentScreen, setCurrentScreen] = useState('dashboard');

    return (
        <div className="app">
            <nav className="navbar">
                <div className="nav-container">
                    <h1 className="app-title">SMR Appointment Scheduler</h1>
                    <ul className="nav-menu">
                        <li>
                            <button
                                className={currentScreen === 'dashboard' ? 'active' : ''}
                                onClick={() => setCurrentScreen('dashboard')}
                            >
                                Dashboard
                            </button>
                        </li>
                        <li>
                            <button
                                className={currentScreen === 'booking' ? 'active' : ''}
                                onClick={() => setCurrentScreen('booking')}
                            >
                                Book Appointment
                            </button>
                        </li>
                        <li>
                            <button
                                className={currentScreen === 'mechanic' ? 'active' : ''}
                                onClick={() => setCurrentScreen('mechanic')}
                            >
                                Mechanic Console
                            </button>
                        </li>
                    </ul>
                </div>
            </nav>

            <main className="main-content">
                {currentScreen === 'dashboard' && <Dashboard />}
                {currentScreen === 'booking' && <BookingFlow />}
                {currentScreen === 'mechanic' && <MechanicConsole />}
            </main>
        </div>
    );
}

export default App;
