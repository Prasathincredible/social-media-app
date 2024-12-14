
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

import Messages from './Components/Messages';


function App() {

  return (
  
     
    <div className="App">
      <UserProvider>
     <Routes>
     <Route path='/' element={<LoginPage/>}></Route>
     <Route path='/signup' element={<SignUp/>}></Route>
        <Route path='/messages' element={<Messages></Messages>}></Route>
        <Route path='/homepage' element={<HomePage/>}></Route>
        <Route path='/profile' element={<Profile/>}></Route>
        <Route path='/edit' element={<EditProfile/>}></Route>
        <Route path='/createpost' element={<CreatPost/>}></Route>
        <Route path='/newspage' element={<NewsPage/>}></Route>
        <Route path='/users' element={<UserList/>}></Route>
        <Route path="/users/:userName" element={<UserProfile/>}/>
        <Route path='search' element={<SearchBar/>}/>
        <Route path='/chat/:userName' element={<Chat/>}/>
      </Routes>  
      </UserProvider>
    </div> 
  );
}

export default App;
