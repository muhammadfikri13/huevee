// import { Routes, Route } from 'react-router-dom'
// // import Home from './pages/Home'
// import Login from './pages/Login'
// import Register from './pages/Register'
// import Explore from './pages/Explore'
// import Dashboard from './pages/Dashboard'

// function App() {
//   return (
//     <Routes>
//       <Route path='/login' element={<Login />} />

//       {/* <Route path='/' element={<Home />} />
//       <Route path='/register' element={<Register />} />
//       <Route path='/explore' element={<Explore />} />
//       <Route path='/dashboard' element={<Dashboard />} /> */}
//     </Routes>
//   )
// }

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
