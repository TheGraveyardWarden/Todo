import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import UserContextProvider from './UserContext';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Signup from './signup';
import Login from './login';
import Authenticate from './Authenticate';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Authenticate beLoggedIn={true} element={<App/>}/>,
    errorElement: <h1>Not Found</h1>
  },
  {
    path: '/signup',
    element: <Authenticate beLoggedIn={false} element={<Signup/>}/>,
    errorElement: <h1>Not Found</h1>
  },
  {
    path: '/login',
    element: <Authenticate beLoggedIn={false} element={<Login/>}/>,
    errorElement: <h1>Not Found</h1>
  }
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
    <UserContextProvider>
      <RouterProvider router={router} />
    </UserContextProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
