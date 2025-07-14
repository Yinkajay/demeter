import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import RecipeDetail from './pages/RecipeDetail'
import Layout from './layouts/Layout'
import Auth from './pages/Auth'
import ProtectedRoute from './components/ProtectedRoute'
import Profile from './pages/Profile'
import Recipes from './pages/Recipes'

const routes = createBrowserRouter([
  {
    path: '/', element: <Layout />, children: [
      { index: true, element: <Home /> },
      { path: 'recipes', element: <Recipes /> },
      { path: '/recipe/:id', element: <RecipeDetail /> },
      {
        path: '/profile', element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        )
      }
    ]
  },
  { path: '/auth', element: <Auth /> },
])



function App() {

  return (
    <RouterProvider router={routes} />
  )
}

export default App
