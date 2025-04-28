// frontend/src/features/checkout/CheckoutForm.jsx
import { useState }    from 'react'
import { useNavigate } from 'react-router-dom'

export default function CheckoutForm() {
  /* -------------------------------------------------- */
  /* 1) Producto elegido                                */
  /* -------------------------------------------------- */
  const product = JSON.parse(localStorage.getItem('selectedProduct'))
  if (!product) return <p className="p-4">No hay producto seleccionado.</p>

  /* -------------------------------------------------- */
  /* 2) Estados del formulario                          */
  /* -------------------------------------------------- */
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    cardNumber: '',
    expMonth: '',
    expYear: '',
    cvc: '',
  })

  const [delivery, setDelivery] = useState({
    productId: product.id, // lo enviamos al backend
    quantity : 1,
    address  : '',
    city     : '',
    postal   : '',
    phone    : '',
  })

  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const navigate              = useNavigate()

  /* -------------------------------------------------- */
  /* 3) Aux: total (sin fees)                           */
  /* -------------------------------------------------- */
  const amount = product.price * delivery.quantity

  /* -------------------------------------------------- */
  /* 4) Handlers                                        */
  /* -------------------------------------------------- */
  const handleChange = (e, setter) => {
    const { name, value } = e.target
    setter(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')

    /* Normaliza Nº tarjeta (quita espacios) */
    const payload = {
      amount,
      customerInfo: {
        ...customer,
        cardNumber: customer.cardNumber.replace(/\s+/g, ''),
      },
      deliveryInfo: delivery,
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/transactions`,
        {
          method : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body   : JSON.stringify(payload),
        },
      )
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

  /* -------------------------------------------------- */
  /* 5) Render                                          */
  /* -------------------------------------------------- */
  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Checkout</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Datos de tarjeta */}
        <fieldset className="space-y-2">
          <legend className="font-semibold">Datos del comprador</legend>

          <input
            name="name"
            placeholder="Nombre en la tarjeta"
            value={customer.name}
            onChange={e => handleChange(e, setCustomer)}
            required
            className="input"
          />

          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={customer.email}
            onChange={e => handleChange(e, setCustomer)}
            required
            className="input"
          />

          <input
            name="cardNumber"
            placeholder="Número de tarjeta (16 dígitos)"
            maxLength={19}
            value={customer.cardNumber}
            onChange={e => handleChange(e, setCustomer)}
            required
            className="input"
          />

          <div className="flex gap-2">
            <input
              name="expMonth"
              placeholder="Mes (MM)"
              maxLength={2}
              value={customer.expMonth}
              onChange={e => handleChange(e, setCustomer)}
              required
              className="input flex-1"
            />
            <input
              name="expYear"
              placeholder="Año (YYYY)"
              maxLength={4}
              value={customer.expYear}
              onChange={e => handleChange(e, setCustomer)}
              required
              className="input flex-1"
            />
            <input
              name="cvc"
              placeholder="CVC"
              maxLength={3}
              value={customer.cvc}
              onChange={e => handleChange(e, setCustomer)}
              required
              className="input flex-1"
            />
          </div>
        </fieldset>

        {/* Datos de envío */}
        <fieldset className="space-y-2">
          <legend className="font-semibold">Dirección de envío</legend>

          <input
            name="address"
            placeholder="Dirección"
            value={delivery.address}
            onChange={e => handleChange(e, setDelivery)}
            required
            className="input"
          />
          <input
            name="city"
            placeholder="Ciudad"
            value={delivery.city}
            onChange={e => handleChange(e, setDelivery)}
            required
            className="input"
          />
          <input
            name="postal"
            placeholder="Código postal"
            value={delivery.postal}
            onChange={e => handleChange(e, setDelivery)}
            required
            className="input"
          />
          <input
            name="phone"
            placeholder="Teléfono"
            value={delivery.phone}
            onChange={e => handleChange(e, setDelivery)}
            required
            className="input"
          />

          <div className="flex items-center gap-2">
            <label htmlFor="quantity" className="whitespace-nowrap">
              Cantidad:
            </label>
            <input
              id="quantity"
              type="number"
              name="quantity"
              min="1"
              value={delivery.quantity}
              onChange={e => handleChange(e, setDelivery)}
              required
              className="input w-20"
            />
          </div>
        </fieldset>

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? 'Procesando…' : `Pagar $${amount}`}
        </button>
      </form>
    </div>
  )
}

/* Utilidad de clase Tailwind usada arriba */
const input =
  'block w-full border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400'
