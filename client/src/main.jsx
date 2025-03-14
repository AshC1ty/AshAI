import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './routes/home/home'
import Dashboard from './routes/dashboard/dashboard'
import Chat from './routes/chat/chat'
import RootLayout from './layouts/rootLayout/rootLayout'
import DashboardLayout from './layouts/dashboardLayout/dashboardLayout'
import Login from './routes/login/login'
import Register from './routes/register/register'



const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/',
        element: <Home />
      },
      { path: '/login',
        element: <Login />
      },
      { path: '/register',
        element: <Register />
      },
      { 
        element: <DashboardLayout />,
        children:[
          {
            path: "/dashboard",
            element: <Dashboard />
          },
          {
            path: "/dashboard/chat/:id",
            element: <Chat />
          }
        ],
      },
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
