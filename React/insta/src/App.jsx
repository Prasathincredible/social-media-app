
import './App.css';
import HomePage from './Components/HomePage';
import {Routes,Route} from 'react-router-dom';
import NewsPage from './Components/NewsPage';
import Profile from './Components/Profile';
import SignUp from './Components/SignUp';
import LoginPage from './Components/LoginPage';
import EditProfile from './Components/EditProfile';
import CreatPost from './Components/CreatPost';
import UserList from './Components/UserList';
import UserProfile from './Components/UserProfile';
import SearchBar from './Components/SearchBar';
import Chat from './Components/Chat';
import { UserProvider } from './contexts/UserContext';
import ProtectedRoute from './Components/ProtectedRoute';
import Messages from './Components/Messages';


function App() {

  return ( 
    <div className="App">
     <UserProvider>
     <Routes>
     <Route path='/' element={<LoginPage/>}></Route>
     <Route path='/signup' element={<SignUp/>}></Route>
        <Route path='/messages' element={<ProtectedRoute><Messages></Messages></ProtectedRoute>}></Route>
        <Route path='/homepage' element={<ProtectedRoute><HomePage/></ProtectedRoute>}></Route>
        <Route path='/profile' element={<ProtectedRoute><Profile/></ProtectedRoute>}></Route>
        <Route path='/edit' element={<ProtectedRoute><EditProfile/></ProtectedRoute>}></Route>
        <Route path='/createpost' element={<ProtectedRoute><CreatPost/></ProtectedRoute>}></Route>
        <Route path='/newspage' element={<ProtectedRoute><NewsPage/></ProtectedRoute>}></Route>
        <Route path='/users' element={<ProtectedRoute><UserList/></ProtectedRoute>}></Route>
        <Route path="/users/:userName" element={<ProtectedRoute><UserProfile/></ProtectedRoute>}/>
        <Route path='search' element={<ProtectedRoute><SearchBar/></ProtectedRoute>}/>
        <Route path='/chat/:userName' element={<ProtectedRoute><Chat/></ProtectedRoute>}/>
      </Routes>  
      </UserProvider>
    </div> 
  );
}

export default App;
