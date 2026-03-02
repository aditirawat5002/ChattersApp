import Login from "./login/Login.jsx"
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Route ,Routes } from "react-router-dom";
import Register from "./register/Register.jsx";
import Home from "./home/Home.jsx";
import Profile from "./profile/Profile.jsx";
import { VerifyUser } from "./utils/VerifyUser.jsx";

function App() {
  
  return (
    <>
    <div className="w-screen min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900">
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route element={<VerifyUser/>}>
        <Route path="/" element={<Home/>}/>
        <Route path="/profile/:id" element={<Profile/>}/>
        </Route>
      </Routes>
      <ToastContainer 
        theme="dark"
        position="bottom-right"
        autoClose={3000}
      />
    </div>
    </>
  )
}

export default App
