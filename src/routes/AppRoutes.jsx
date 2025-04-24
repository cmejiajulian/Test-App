import { Routes, Route } from 'react-router-dom'
import CatalogView from '../features/catalog/CatalogView'
import CheckoutForm from '../features/checkout/CheckoutForm'
import Summary from '../features/summary/Summary'


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CatalogView />} />
      <Route path="/checkout" element={<CheckoutForm />} />
      <Route path="/summary" element={<Summary />} />
    </Routes>
  )
}
