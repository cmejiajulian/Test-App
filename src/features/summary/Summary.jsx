import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function Summary() {
  const navigate = useNavigate()

  const reduxProduct = useSelector(state => state.catalog.selectedItem)
  const storedProduct = localStorage.getItem('selectedProduct')
  let product = reduxProduct
  if (!product && storedProduct) {
    try {
      product = JSON.parse(storedProduct)
    } catch (e) {
      console.error("Error en producto:", e)
      product = null
    }
  }

  // Verificación completa
  const isValidProduct =
    product &&
    typeof product === 'object' &&
    !Array.isArray(product) &&
    product.name &&
    product.price !== undefined &&
    product.description

  const reduxCheckout = useSelector(state => state.checkout)
  const storedCheckout = localStorage.getItem('checkoutData')
  let checkout = reduxCheckout
  if ((!checkout || Object.keys(checkout).length === 0) && storedCheckout) {
    try {
      checkout = JSON.parse(storedCheckout)
    } catch (e) {
      console.error("Error checkoutData:", e)
    }
  }

  if (!isValidProduct) {
    return (
      <div className="max-w-md mx-auto p-4 text-center text-red-600 font-semibold">
        No hay producto seleccionado. Por favor vuelve al catálogo.
        <button
          onClick={() => navigate('/result')}
          className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded"
        >
          Volver al catálogo
        </button>
      </div>
    )
  }

  const handleConfirm = () => {
    localStorage.removeItem('selectedProduct')
    localStorage.removeItem('checkoutData')
    navigate('/result')
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Resumen del pedido</h2>

      <div className="mb-4 border rounded p-4">
        <h3 className="text-lg font-semibold mb-2">Producto:</h3>
        <p><strong>{product.name}</strong></p>
        <p>Precio: ${product.price}</p>
        <p>Descripción: {product.description}</p>
      </div>

      <div className="mb-4 border rounded p-4">
        <h3 className="text-lg font-semibold mb-2">Entrega y pago:</h3>
        <p>Cliente: {checkout?.name || '—'}</p>
        <p>Dirección: {checkout?.address || '—'}</p>
        <p>Tarjeta: {checkout?.cardHolder || '—'} | {checkout?.cardNumber || '—'}</p>
      </div>

      <button
        onClick={handleConfirm}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Finalizar compra
      </button>
    </div>
  )
}
