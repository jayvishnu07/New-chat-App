import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Chat from './Components/Chat/Chat';
import Form from './Components/Form/Form';
import ChatContextProvider from './ContextAPI/chatContext';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ChatContextProvider>
          <Routes>
            <Route path='/chats' element={<Chat />} />
            <Route path='/' element={<Form />} />
          </Routes>
        </ChatContextProvider>
      </BrowserRouter>

      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

export default App;



// CLOUDINARY_URL=cloudinary://447974176498242:uJfNPNJB99tINW2xdjw4t1FgOo0@djn1saw5yf