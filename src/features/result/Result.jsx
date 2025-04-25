import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Result() {
  const [status, setStatus] = useState('loading')
  const navigate = useNavigate()

  useEffect(() => {
    setTimeout(() => {
      // ✅ Fuerza el resultado como exitoso
      const success = true // <- cambia a Math.random() > 0.3 para comportamiento real

      setStatus(success ? 'success' : 'error')
    }, 1500)
  }, [])

  const handleReset = () => {
    localStorage.removeItem('selectedProduct')
    localStorage.removeItem('checkoutData')
    navigate('/')
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 text-center">
      {status === 'loading' && (
        <p className="text-gray-500 text-lg animate-pulse">Procesando pago...</p>
      )}

      {status === 'success' && (
        <>
          <h2 className="text-2xl font-bold text-green-600 mb-2">✅ ¡Pago exitoso!</h2>
          <p className="mb-4">Gracias por tu compra. Pronto recibirás tu pedido.</p>
          <button
            onClick={handleReset}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Volver al catálogo
          </button>
        </>
      )}

      {status === 'error' && (
        <>
          <h2 className="text-2xl font-bold text-red-600 mb-2">❌ Error en el pago</h2>
          <p className="mb-4">No se pudo procesar tu compra. Inténtalo nuevamente.</p>
          <button
            onClick={handleReset}
            className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded"
          >
            Volver al inicio
          </button>
        </>
      )}
    </div>
  )
}
