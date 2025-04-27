export default function ProductCard({ product, onSelect }) {
    return (
      <div className="border rounded-xl p-4 shadow hover:shadow-md transition">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-40 object-cover rounded mb-3"
        />
        <h2 className="text-xl font-semibold">{product.name}</h2>
        <p className="text-sm text-gray-600">{product.description}</p>
        <p className="mt-2 font-bold text-green-700">${product.price}</p>
        <p className="text-sm text-gray-500">Stock: {product.stock}</p>
        <button
          onClick={onSelect}
          className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Comprar
        </button>
      </div>
    )
  }
  