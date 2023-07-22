import { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate
} from 'react-router-dom';
import Home from './Home';
import Admin from './Admin Panel/Admin';
import User from './User Panel/User';
import Admin_pager from './Admin Panel/Admin_Pager';
import User_pager from './User Panel/User_Pager';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <Router>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/Admin_Dashboard' element={<Admin/>}/>
            <Route path='/Admin_Dashboard/:newpage' element={<Admin_pager/>}/>
            <Route path='/User_Dashboard' element={<User/>}/>
            <Route path='/User_Dashboard/:new_page' element={<User_pager/>}/>
          </Routes>
        </Router>
        </div>
    </>
  )
}

export default App
