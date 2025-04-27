// frontend/src/features/catalog/CatalogView.jsx
import { useState, useEffect } from 'react'
import ProductCard from './ProductCard'
import { useNavigate } from 'react-router-dom'

export default function CatalogView() {
  const [stock, setStock]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const navigate              = useNavigate()

  // ——————————————————————————————————————————————————————
  // Determinamos la URL base según tu bundler:
  // CRA: process.env.REACT_APP_API_URL
  // Vite: import.meta.env.VITE_API_URL
  // Fallback hard-coded si ninguna variable existe:
  const apiUrl =
    // @ts-ignore
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
    process.env.REACT_APP_API_URL ||
    'http://localhost:3001'
  // ——————————————————————————————————————————————————————

  useEffect(() => {
    fetch(`${apiUrl}/products`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(data => {
        setStock(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [apiUrl])

  const handleSelect = product => {
    localStorage.setItem('selectedProduct', JSON.stringify(product))
    navigate('/checkout')
  }

  if (loading) return <p className="p-4">Cargando productos…</p>
  if (error)   return <p className="p-4 text-red-600">Error: {error}</p>

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Productos disponibles</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {stock.map(p => (
          <ProductCard
            key={p.id}
            product={p}
            onSelect={() => handleSelect(p)}
          />
        ))}
      </div>
    </div>
  )
}
