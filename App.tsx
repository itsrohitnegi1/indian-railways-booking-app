import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Chatbot } from './components/Chatbot';
import { TrainCard } from './components/TrainCard';
import { Spinner } from './components/Spinner';
import { STATIONS, TRAIN_CLASSES } from './constants';
import { User, Train, TrainClass, Booking, Passenger, SeatAvailability } from './types';
import { ArrowRightIcon } from './components/icons/ArrowRightIcon';

// --- MOCK DATA & HELPERS ---

// A mock user for demonstration purposes
const MOCK_USER: User = { id: 'user123', name: 'Priya Sharma', email: 'priya.sharma@example.com' };

// A function to generate mock train data for the search results
const generateMockTrains = (from: string, to: string, date: string): Train[] => {
    if (from === to) return [];

    const fromStation = STATIONS.find(s => s.code === from);
    const toStation = STATIONS.find(s => s.code === to);

    if (!fromStation || !toStation) return [];

    return Array.from({ length: Math.floor(Math.random() * 5) + 3 }).map((_, i) => {
        const departureHour = Math.floor(Math.random() * 18) + 5; // 05:00 to 22:00
        const departureMinutes = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
        const durationHours = Math.floor(Math.random() * 10) + 4;
        const durationMinutes = [0, 15, 30, 45][Math.floor(Math.random() * 4)];

        const departureTime = new Date();
        departureTime.setHours(departureHour, departureMinutes, 0, 0);

        const arrivalTime = new Date(departureTime.getTime() + (durationHours * 60 + durationMinutes) * 60000);

        return {
            id: `train-${i}-${Date.now()}`,
            trainNumber: `${Math.floor(Math.random() * 90000) + 10000}`,
            trainName: `${fromStation.name.split(' ')[0]} - ${toStation.name.split(' ')[0]} Express`,
            from: fromStation.name,
            fromCode: fromStation.code,
            to: toStation.name,
            toCode: toStation.code,
            departureTime: departureTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }),
            arrivalTime: arrivalTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }),
            duration: `${durationHours}h ${durationMinutes}m`,
            availability: TRAIN_CLASSES.map(tc => ({
                class: tc,
                seats: Math.random() > 0.2 ? Math.floor(Math.random() * 150) : 0,
                fare: (Object.values(TrainClass).indexOf(tc) + 1) * 250 + Math.floor(Math.random() * 200),
            })),
        };
    });
};

// --- MAIN APP COMPONENT ---

const App: React.FC = () => {
    // State Management
    const [currentPage, setCurrentPage] = useState<'home' | 'searchResults' | 'booking' | 'dashboard'>('home');
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    
    const [searchQuery, setSearchQuery] = useState({ from: 'NDLS', to: 'MMCT', date: new Date().toISOString().split('T')[0] });
    const [trains, setTrains] = useState<Train[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);
    const [selectedClass, setSelectedClass] = useState<TrainClass | null>(null);
    const [passengers, setPassengers] = useState<Passenger[]>([{ name: '', age: 0, gender: 'Male' }]);
    
    const [bookings, setBookings] = useState<Booking[]>([]);

    // --- Handlers ---
    
    const handleLogin = () => {
        setCurrentUser(MOCK_USER);
        setShowLoginModal(false);
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setCurrentPage('home');
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setCurrentPage('searchResults');
        // Simulate API call
        setTimeout(() => {
            const results = generateMockTrains(searchQuery.from, searchQuery.to, searchQuery.date);
            setTrains(results);
            setIsLoading(false);
        }, 1500);
    };

    const handleBookNow = (train: Train, trainClass: TrainClass) => {
        if (!currentUser) {
            setShowLoginModal(true);
            return;
        }
        setSelectedTrain(train);
        setSelectedClass(trainClass);
        setPassengers([{ name: currentUser.name, age: 30, gender: 'Female' }]); // Pre-fill with logged in user
        setCurrentPage('booking');
    };

    const handleConfirmBooking = () => {
        if (!selectedTrain || !selectedClass) return;

        const totalFare = selectedTrain.availability.find(a => a.class === selectedClass)!.fare * passengers.length;
        
        const newBooking: Booking = {
            id: `booking-${Date.now()}`,
            train: selectedTrain,
            passengers,
            bookedClass: selectedClass,
            date: searchQuery.date,
            totalFare,
            status: 'Confirmed'
        };
        setBookings(prev => [newBooking, ...prev]);
        alert('Booking Confirmed!');
        setCurrentPage('dashboard');
    };
    
    // --- Page Render Logic ---

    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <SearchForm onSearch={handleSearch} query={searchQuery} setQuery={setSearchQuery} />;
            case 'searchResults':
                return <SearchResults trains={trains} isLoading={isLoading} onBook={handleBookNow} query={searchQuery} />;
            case 'booking':
                if (!selectedTrain || !selectedClass) {
                    setCurrentPage('home'); // Should not happen
                    return null;
                }
                return <BookingPage 
                    train={selectedTrain} 
                    selectedClass={selectedClass}
                    passengers={passengers}
                    setPassengers={setPassengers}
                    onConfirm={handleConfirmBooking}
                    onBack={() => setCurrentPage('searchResults')}
                />;
            case 'dashboard':
                 if (!currentUser) {
                    setCurrentPage('home');
                    return null;
                }
                return <DashboardPage user={currentUser} bookings={bookings} />;
            default:
                return <SearchForm onSearch={handleSearch} query={searchQuery} setQuery={setSearchQuery} />;
        }
    };
    
    return (
        <div className="min-h-screen flex flex-col font-sans">
            <Header
                user={currentUser}
                onNavigate={(page) => setCurrentPage(page)}
                onLoginClick={() => setShowLoginModal(true)}
                onLogoutClick={handleLogout}
            />
            <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
                {renderPage()}
            </main>
            <Chatbot trainContext={trains} />
            {showLoginModal && <LoginModal onLogin={handleLogin} onClose={() => setShowLoginModal(false)} />}
        </div>
    );
};

// --- SUB-COMPONENTS for PAGES ---

const SearchForm: React.FC<{
    onSearch: (e: React.FormEvent) => void;
    query: { from: string; to: string; date: string; };
    setQuery: React.Dispatch<React.SetStateAction<{ from: string; to: string; date: string; }>>;
}> = ({ onSearch, query, setQuery }) => {

    const handleSwapStations = () => {
        setQuery(q => ({...q, from: q.to, to: q.from }));
    };

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Book Your Next Journey</h2>
            <p className="text-gray-500 mb-8">Experience seamless train travel across India.</p>
            <form onSubmit={onSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                <div className="relative col-span-1 md:col-span-2 lg:col-span-2 flex items-center">
                    <div className="w-1/2">
                        <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-1">From</label>
                        <select id="from" value={query.from} onChange={e => setQuery({...query, from: e.target.value})} className="w-full p-3 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500 text-lg">
                            {STATIONS.map(s => <option key={s.code} value={s.code}>{s.name} ({s.code})</option>)}
                        </select>
                    </div>
                     <button type="button" onClick={handleSwapStations} className="p-2 mt-4 self-center rounded-full border bg-gray-100 hover:bg-gray-200 mx-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                    </button>
                    <div className="w-1/2">
                        <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">To</label>
                        <select id="to" value={query.to} onChange={e => setQuery({...query, to: e.target.value})} className="w-full p-3 border border-gray-300 rounded-r-md focus:ring-blue-500 focus:border-blue-500 text-lg">
                            {STATIONS.map(s => <option key={s.code} value={s.code}>{s.name} ({s.code})</option>)}
                        </select>
                    </div>
                </div>
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date of Journey</label>
                    <input type="date" id="date" value={query.date} onChange={e => setQuery({...query, date: e.target.value})} className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-lg" />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 transition-colors text-lg">
                    Search Trains
                </button>
            </form>
        </div>
    );
};

const SearchResults: React.FC<{
    trains: Train[];
    isLoading: boolean;
    onBook: (train: Train, trainClass: TrainClass) => void;
    query: { from: string; to: string; };
}> = ({ trains, isLoading, onBook, query }) => {
    if (isLoading) return <div className="mt-16"><Spinner /></div>;
    const fromStation = STATIONS.find(s => s.code === query.from)?.name;
    const toStation = STATIONS.find(s => s.code === query.to)?.name;
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Trains from {fromStation} to {toStation}
            </h2>
            {trains.length > 0 ? (
                trains.map(train => <TrainCard key={train.id} train={train} onBook={onBook} />)
            ) : (
                <div className="text-center py-16 bg-white rounded-lg shadow-md">
                    <p className="text-xl font-semibold text-gray-700">No trains found for this route.</p>
                    <p className="text-gray-500 mt-2">Please try searching for a different route or date.</p>
                </div>
            )}
        </div>
    );
};

const BookingPage: React.FC<{
    train: Train;
    selectedClass: TrainClass;
    passengers: Passenger[];
    setPassengers: React.Dispatch<React.SetStateAction<Passenger[]>>;
    onConfirm: () => void;
    onBack: () => void;
}> = ({ train, selectedClass, passengers, setPassengers, onConfirm, onBack }) => {

    const fareInfo = train.availability.find(a => a.class === selectedClass)!;
    const totalFare = fareInfo.fare * passengers.length;

    const handlePassengerChange = (index: number, field: keyof Passenger, value: string | number) => {
        const newPassengers = [...passengers];
        (newPassengers[index] as any)[field] = value;
        setPassengers(newPassengers);
    };

    const addPassenger = () => {
        setPassengers([...passengers, { name: '', age: 0, gender: 'Male' }]);
    };
    
    const removePassenger = (index: number) => {
        setPassengers(passengers.filter((_, i) => i !== index));
    };

    return (
        <div className="max-w-4xl mx-auto">
             <button onClick={onBack} className="mb-4 text-blue-600 hover:underline">&larr; Back to results</button>
            <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-4">Booking Summary</h2>
                <div className="border-b pb-4 mb-4">
                    <h3 className="text-lg font-semibold">{train.trainName} ({train.trainNumber})</h3>
                    <p className="text-gray-600">{train.from} &rarr; {train.to}</p>
                    <p className="text-gray-600">Class: <span className="font-semibold">{selectedClass}</span></p>
                </div>
                
                <h3 className="text-xl font-semibold mb-4">Passenger Details</h3>
                {passengers.map((p, i) => (
                     <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-center p-4 bg-gray-50 rounded-md">
                        <input type="text" placeholder="Full Name" value={p.name} onChange={e => handlePassengerChange(i, 'name', e.target.value)} className="md:col-span-2 p-2 border rounded" />
                        <input type="number" placeholder="Age" value={p.age || ''} onChange={e => handlePassengerChange(i, 'age', parseInt(e.target.value))} className="p-2 border rounded" />
                        <div className="flex items-center space-x-2">
                             <select value={p.gender} onChange={e => handlePassengerChange(i, 'gender', e.target.value)} className="p-2 border rounded w-full">
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                            {passengers.length > 1 && <button onClick={() => removePassenger(i)} className="text-red-500 p-2 hover:bg-red-100 rounded-full">&times;</button>}
                        </div>
                    </div>
                ))}
                <button onClick={addPassenger} className="text-blue-600 font-medium">+ Add Passenger</button>
                
                <div className="mt-6 border-t pt-6 flex justify-between items-center">
                    <div>
                        <p className="text-xl font-bold">Total Fare:</p>
                        <p className="text-2xl font-extrabold text-blue-700">₹{totalFare.toLocaleString('en-IN')}</p>
                    </div>
                    <button onClick={onConfirm} className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 text-lg transition-colors">
                        Confirm Booking
                    </button>
                </div>
            </div>
        </div>
    );
};

const DashboardPage: React.FC<{ user: User; bookings: Booking[] }> = ({ user, bookings }) => {
    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Welcome, {user.name}!</h2>
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">Your Bookings</h3>
            <div className="space-y-6">
                {bookings.length > 0 ? bookings.map(b => (
                    <div key={b.id} className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-start">
                             <div>
                                <p className="font-bold text-lg">{b.train.trainName} ({b.train.trainNumber})</p>
                                <p className="text-gray-600">{b.train.from} to {b.train.to}</p>
                                <p className="text-sm text-gray-500">Journey Date: {new Date(b.date).toLocaleDateString('en-GB')}</p>
                             </div>
                             <div className={`px-3 py-1 text-sm font-medium rounded-full ${b.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {b.status}
                             </div>
                        </div>
                        <div className="mt-4 border-t pt-4">
                            <p className="font-semibold">Passengers ({b.passengers.length}) in {b.bookedClass}</p>
                            <ul className="list-disc list-inside text-gray-600">
                                {b.passengers.map((p,i) => <li key={i}>{p.name} ({p.age}, {p.gender})</li>)}
                            </ul>
                            <p className="text-right font-bold text-lg mt-2">Total Fare: ₹{b.totalFare.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                )) : (
                     <div className="text-center py-16 bg-white rounded-lg shadow-md">
                        <p className="text-xl font-semibold text-gray-700">No bookings yet.</p>
                        <p className="text-gray-500 mt-2">Time to plan your next trip!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const LoginModal: React.FC<{ onLogin: () => void; onClose: () => void; }> = ({ onLogin, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Login to Continue</h2>
                <p className="text-center text-gray-600 mb-6">This is a simulated login for demonstration purposes.</p>
                <div className="space-y-4">
                    <input type="email" placeholder="Email (e.g., user@example.com)" className="w-full p-3 border rounded-md" defaultValue="priya.sharma@example.com" />
                    <input type="password" placeholder="Password" className="w-full p-3 border rounded-md" defaultValue="password123" />
                </div>
                <button onClick={onLogin} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 mt-6">
                    Login
                </button>
                 <button onClick={onClose} className="w-full bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-md hover:bg-gray-300 mt-2">
                    Cancel
                </button>
            </div>
        </div>
    );
};


export default App;
