import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout'
import WorksPage from './pages/WorksPage'
import WorkDetailPage from './pages/WorkDetailPage'
import ArticlesPage from './pages/ArticlesPage'
import ArticleDetailPage from './pages/ArticleDetailPage'
import TagsPage from './pages/TagsPage'
import AboutPage from './pages/AboutPage'
import AdminPage from './pages/AdminPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <WorksPage /> },
      { path: 'works/:id', element: <WorkDetailPage /> },
      { path: 'articles', element: <ArticlesPage /> },
      { path: 'articles/:slug', element: <ArticleDetailPage /> },
      { path: 'tags', element: <TagsPage /> },
      { path: 'about', element: <AboutPage /> },
    ],
  },
  { path: '/admin', element: <AdminPage /> },
])

export default function App() {
  return <RouterProvider router={router} />
}
