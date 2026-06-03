import { FaTrash, FaEdit } from "react-icons/fa";

function ProductTable({ products, onDelete }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="p-4 text-left text-zinc-400">Producto</th>
            <th className="p-4 text-left text-zinc-400">Categoría</th>
            <th className="p-4 text-left text-zinc-400">Precio</th>
            <th className="p-4 text-left text-zinc-400">Estado</th>
            <th className="p-4 text-right text-zinc-400">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="border-b border-white/5"
            >
              <td className="p-4">
                <div>
                  <p className="text-white font-semibold">
                    {product.name}
                  </p>

                  <p className="text-zinc-500 text-sm">
                    {product.slug}
                  </p>
                </div>
              </td>

              <td className="p-4 text-zinc-300">
                {product.categoryName}
              </td>

              <td className="p-4 text-zinc-300">
                ${product.basePrice}
              </td>

              <td className="p-4">
                <span
                  className={
                    product.active
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {product.active ? "Activo" : "Inactivo"}
                </span>
              </td>

              <td className="p-4">
                <div className="flex justify-end gap-3">
                  <button>
                    <FaEdit />
                  </button>

                  <button
                    onClick={() => onDelete(product.id)}
                    className="text-red-400"
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;