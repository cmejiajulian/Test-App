// frontend/src/features/summary/Summary.jsx
import { useEffect, useState } from 'react'
import { useNavigate }         from 'react-router-dom'

export default function Summary() {
  const [tx,   setTx]   = useState(null)
  const [fees, setFees] = useState(null)
  const navigate        = useNavigate()

  // 1) URL base (toma de .env.local o fallback)
  const API =
    import.meta.env.VITE_API_URL?.replace(/\/$/, '') ||
    'http://localhost:3002'

  // 2) Cargo la transacción PENDING que guardé al crearla
  useEffect(() => {
    const stored = localStorage.getItem('transaction')
    if (!stored) return navigate('/')
    setTx(JSON.parse(stored))
  }, [navigate])

  // 3) Pido al backend el desglose de fees
  useEffect(() => {
    if (!tx) return;
    
    fetch(`${API}/transactions/summary/${tx.amount}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setFees)
      .catch(err => {
        console.error('Error al cargar resumen:', err);
        alert('No se pudo cargar el resumen de pago');
      });
  }, [tx, API]);

  // 4) Confirmar pago en Wompi y actualizar la tx
  const handleConfirm = async () => {
    try {
      const res = await fetch(
        `${API}/transactions/${tx.id}/confirm`,
        { method: 'POST' }
      )
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const updated = await res.json()
      localStorage.setItem('transaction', JSON.stringify(updated))
      navigate('/result')
    } catch (err) {
      console.error('Error al confirmar pago:', err)
      alert('Error al procesar el pago')
    }
  }

  if (!tx || !fees) return <p className="p-4">Cargando resumen…</p>

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Resumen de pago</h2>

      <p>Producto ID: <strong>{tx.deliveryInfo.productId}</strong></p>
      <p>Cantidad: <strong>{tx.deliveryInfo.quantity}</strong></p>
      <hr className="my-2" />

      <p>Importe producto: ${fees.itemAmount}</p>
      <p>Base fee (3%): ${fees.baseFee}</p>
      <p>Delivery fee: ${fees.deliveryFee}</p>
      <p className="font-bold mt-2">Total: ${fees.total}</p>

      <button
        onClick={handleConfirm}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Confirmar pago
      </button>
    </div>
  )
}
