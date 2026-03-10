import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar atau layout bisa di sini */}
      <Outlet /> {/* Ini akan render child route seperti <Login /> */}
    </div>
  );
}

export default App;
