import { Routes, Route } from 'react-router-dom'
import CatalogView from '../features/catalog/CatalogView'
import CheckoutForm from '../features/checkout/CheckoutForm'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CatalogView />} />
      <Route path="/checkout" element={<CheckoutForm />} />
    </Routes>
  )
}
