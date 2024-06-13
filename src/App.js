import logo from './logo.svg';
import './App.css';
import CustomFooter from './components/footer/Footer'; 
import CustomHeader from './components/header/Header';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import NewTodo from './NewTodo';
import NewUser from './NewUser';
import UserTodo from './UserTodo';
import Details from './Details';

function App() {
  return (
    <>
    <div className="App">
      <CustomHeader />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/UserTodo/:id" element={<UserTodo />} />
          <Route path="/NewTodo" element={<NewTodo />} />
          <Route path="/NewUser" element={<NewUser />} />
          <Route path="/Details/:id" element={<Details />} />
        </Routes>
      </main>
      </div>
      <CustomFooter />       
    </>
  );
}

export default App;

