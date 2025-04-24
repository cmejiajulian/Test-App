import { useState } from "react";
import { useDispatch } from "react-redux";
import {updateCheckoutInfo} from "./checkoutSlice"
import { useNavigate } from "react-router-dom";


export default function CheckoutForm(){
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({

        cardNumber:'',
        cardHolder:'',
        expiration:'',
        cvv:'',
        name:'',
        address:''
    })

    const handleChange = (e)=>{
        setFormData({...formData,[e.target.name]:e.target.value})
    }
    const handleSubmit =(e)=>{
        e.preventDefault()

        //validacion
        const isEmpty = Object.values(formData).some(val=>val.trim()==='')
        if(isEmpty){
            alert('por favor,completa los campos')
            return
        }

        dispatch(updateCheckoutInfo(formData))
        navigate('/summary')
    }

    return (
        <div className="max-w-md mx-auto p-4">
          <h2 className="text-xl font-bold mb-4">Datos de pago y entrega</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="cardNumber" placeholder="Número de tarjeta" onChange={handleChange} className="w-full border p-2 rounded" />
            <input name="cardHolder" placeholder="Nombre del titular" onChange={handleChange} className="w-full border p-2 rounded" />
            <input name="expiration" placeholder="MM/AA" onChange={handleChange} className="w-full border p-2 rounded" />
            <input name="cvv" placeholder="CVV" onChange={handleChange} className="w-full border p-2 rounded" />
            <input name="name" placeholder="Tu nombre" onChange={handleChange} className="w-full border p-2 rounded" />
            <input name="address" placeholder="Dirección de entrega" onChange={handleChange} className="w-full border p-2 rounded" />
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Continuar
            </button>
          </form>
        </div>
      )
}