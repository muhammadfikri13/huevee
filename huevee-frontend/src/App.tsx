import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div className=" 
      min-h-screen 
      bg-gradient-to-r 
      from-pink-200 
      via-indigo-200 
      to-cyan-200
      bg-[length:400%_400%]
      animate-gradient"
      >
      {/* Navbar atau layout bisa di sini */}
      <Outlet /> {/* Ini akan render child route seperti <Login /> */}
    </div>
  );
}

export default App;
