import { useEffect, useState } from 'react'
import { useNavigate }         from 'react-router-dom'

export default function Summary() {
  const [tx, setTx]     = useState(null)
  const navigate        = useNavigate()

  useEffect(() => {
    const stored = localStorage.getItem('transaction')
    if (!stored) return navigate('/')
    setTx(JSON.parse(stored))
  }, [])

  if (!tx) return null

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Resultado de la transacción</h2>
      <p>ID: {tx.id}</p>
      <p>Monto: ${tx.amount}</p>
      <p>Estado: {tx.status}</p>
      <p>Creado: {new Date(tx.createdAt).toLocaleString()}</p>
      <button
        onClick={() => {
          localStorage.removeItem('transaction')
          navigate('/')
        }}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        Volver al catálogo
      </button>
    </div>
  )
}
