// frontend/src/features/result/Result.jsx
import { useEffect, useState } from 'react'
import { useNavigate }         from 'react-router-dom'

export default function Result() {
  const [tx, setTx]      = useState(null)
  const navigate         = useNavigate()

  useEffect(() => {
    const stored = localStorage.getItem('lastTransaction')
    if (!stored) return navigate('/')
    setTx(JSON.parse(stored))
  }, [])

  if (!tx) return <p className="p-4">Cargando resultado…</p>

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">
        {tx.status === 'APPROVED' ? '¡Pago aprobado!' : 'Pago rechazado'}
      </h2>
      <p><strong>ID interno:</strong> {tx.id}</p>
      <p><strong>ID Wompi:</strong> {tx.externalId}</p>
      <p><strong>Monto:</strong> ${tx.amount}</p>
      <button
        onClick={() => navigate('/')}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Volver al catálogo
      </button>
    </div>
  )
}
