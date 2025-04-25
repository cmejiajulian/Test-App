import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  cardNumber: '',
  cardHolder: '',
  expiration: '',
  cvv: '',
  name: '',
  address: ''
}

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    updateCheckoutInfo: (state, action) => {
      return { ...state, ...action.payload }
    },
    resetCheckout: () => initialState
  }
})

// ✅ Exporta las acciones individualmente
export const { updateCheckoutInfo, resetCheckout } = checkoutSlice.actions

// ✅ Exporta el reducer por defecto
export default checkoutSlice.reducer
