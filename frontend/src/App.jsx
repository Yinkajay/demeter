import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import RecipeDetail from './pages/RecipeDetail'
import Layout from './layouts/Layout'
import Auth from './pages/Auth'

const routes = createBrowserRouter([
  {
    path: '/', element: <Layout />, children: [
      { index: true, element: <Home /> },
      { path: '/recipe/:id', element: <RecipeDetail /> }
    ]
  },
  { path: '/auth', element: <Auth /> }
])



function App() {

  return (
    <RouterProvider router={routes} />
  )
}

export default App
