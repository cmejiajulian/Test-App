import { useDispatch,useSelector } from "react-redux";
import { setStock,selectItem} from "./catalogSlice"
import  ProductCard from "./ProductCard"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


const sampleProducts = [
    {
        id:1,
        name:' Chorizo santarrosano',
        description:'Delicioso Chorizo artesanal santarrosano',
        price:10000,
        stock:5,
        image: 'https://placehold.co/300x200?text=Chorizo'

    },
    {
        id:2,
        name:'Torta de chocolo',
        description:'Deliciosa Torta de Chocolo de solo maiz',
        price:4000,
        stock:3,
        image:'https://placehold.co/300x200?text=Torta de Chocolo'
    }
]

export default function CatalogView(){
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const stock =useSelector((state)=>state.catalog.stock)

    useEffect(()=>{
        if(stock.length === 0){
            dispatch(setStock(sampleProducts))
        }
    },[dispatch,stock])

    
    const handleSelect = (product)=>{
    console.log('producto seleccionado',product)
    dispatch(selectItem(product)) 
    localStorage.setItem("selectedProduct",JSON.stringify(product))
    navigate('/checkout')
    }

    return (
        <div className="p-4 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Productos disponibles</h1>
            <div className="grid gap-4 md:grid-cols-2">
                {stock.map((product)=>(
                   <ProductCard key={product.id} product={product} onSelect= {()=>handleSelect(product)}/>
                ))}
            </div>
        </div>
    )

}

