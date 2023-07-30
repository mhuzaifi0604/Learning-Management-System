// importing necessory libraries for APP.jsx
import { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useFetcher
} from 'react-router-dom';
// Importing all components to be rendered
import Home from './Home';
import Admin from './Admin Panel/Admin';
import User from './User Panel/User';
import Admin_pager from './Admin Panel/Admin_Pager';
import User_pager from './User Panel/User_Pager';

// function for private route and rendering of home on unsuccessfull signup
const PrivateRoute = ({ component: Component, isloggedin, setIsLoggedIn, ...rest }) => {
  const navigate = useNavigate();
// navigating to home if note loggedin
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      setIsLoggedIn(true);
    }else{
      setIsLoggedIn(false);
    }
    if (!isloggedin) {
      navigate('/');
    }
  }, [isloggedin, navigate]);
// returning the component to be rendered
  return isloggedin ? <Component {...rest} setIsLoggedIn={setIsLoggedIn} /> : null;
};

// function for app to begin
function App() {
  // declaring and initializing necessory state variables
  const [isloggedin, setisloggedin] = useState(localStorage.getItem('isLoggedIn'));
  // function for setting login state for protected routes
  const setIsLoggedIn = (isLoggedIn) => {
    setisloggedin(isLoggedIn);
    localStorage.setItem('isLoggedIn', isLoggedIn);
  };
  // rendering the DOM
  return (
    <>
      <div>
        {/* using routers to make routes to diffrent pages*/}
        <Router>
          <Routes>
            {/* calling components to be rendered using private routes */}
            <Route path="/" element={<Home isloggedin={isloggedin} setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/Admin_Dashboard" element={<PrivateRoute component={Admin} isloggedin={isloggedin} setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/Admin_Dashboard/:newpage" element={<PrivateRoute component={Admin_pager} isloggedin={isloggedin} setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/User_Dashboard" element={<PrivateRoute component={User} isloggedin={isloggedin} setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/User_Dashboard/:new_page" element={<PrivateRoute component={User_pager} isloggedin={isloggedin} setIsLoggedIn={setIsLoggedIn} />} />
          </Routes>
        </Router>
      </div>
    </>
  )
}

export default App
