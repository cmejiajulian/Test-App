import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function CheckoutForm() {
  // Estado del formulario
  const [customer, setCustomer] = useState({
    name: '',
    cardNumber: '',
    expMonth: '',
    expYear: '',
    cvc: '',
  })
  const [delivery, setDelivery] = useState({
    address: '',
    city: '',
    postal: '',
    phone: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Producto seleccionado + precio + fees
  const product = JSON.parse(localStorage.getItem('selectedProduct'))
  const amount = product.price // + cualquier fee

  const handleChange = (e, group, setter) => {
    setter(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          customerInfo: customer,
          deliveryInfo: delivery,
        }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const tx = await res.json()
      localStorage.setItem('transaction', JSON.stringify(tx))
      navigate('/summary')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Checkout</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Datos del cliente */}
        <fieldset>
          <legend className="font-semibold">Datos de tarjeta</legend>
          <input name="name"     placeholder="Nombre en la tarjeta"       onChange={e => handleChange(e, 'customer', setCustomer)} required />
          <input name="cardNumber"placeholder="Número de tarjeta"           onChange={e => handleChange(e, 'customer', setCustomer)} required />
          <input name="expMonth"  placeholder="Mes (MM)"                     onChange={e => handleChange(e, 'customer', setCustomer)} required />
          <input name="expYear"   placeholder="Año (YYYY)"                  onChange={e => handleChange(e, 'customer', setCustomer)} required />
          <input name="cvc"       placeholder="CVC"                          onChange={e => handleChange(e, 'customer', setCustomer)} required />
        </fieldset>

        {/* Datos de envío */}
        <fieldset>
          <legend className="font-semibold">Dirección de envío</legend>
          <input name="address" placeholder="Dirección" onChange={e => handleChange(e, 'delivery', setDelivery)} required />
          <input name="city"    placeholder="Ciudad"     onChange={e => handleChange(e, 'delivery', setDelivery)} required />
          <input name="postal"  placeholder="Código postal"onChange={e => handleChange(e, 'delivery', setDelivery)} required />
          <input name="phone"   placeholder="Teléfono"    onChange={e => handleChange(e, 'delivery', setDelivery)} required />
        </fieldset>

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? 'Procesando…' : `Pagar $${amount}`}
        </button>
      </form>
    </div>
  )
}
