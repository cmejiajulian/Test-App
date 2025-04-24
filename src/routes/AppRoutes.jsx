import { Routes, Route } from 'react-router-dom'
import CatalogView from '../features/catalog/CatalogView'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CatalogView />} />
    </Routes>
  )
}
