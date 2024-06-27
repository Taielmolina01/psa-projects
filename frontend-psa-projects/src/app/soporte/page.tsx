import Link from "next/link";

const SOPORTE_URL = "https://soporte-wyq6.onrender.com";

async function datosProductos() {
  const productos = await fetch(`${SOPORTE_URL}/productos`, {
    cache: "no-store",
  });
  return await productos.json();
}

async function Soporte() {
  const productos = await datosProductos();
  return (
    <div>
      <h1 className="pt-5 text-3xl text-center font-bold text-sky-400 mb-3">
        Productos
      </h1>
      {productos.map((producto: any) => (
        <Link href={`/soporte/${producto.idProducto}`}>
          <div
            key={producto.idProducto}
            className="w-80 mb-3 group flex justify-center items-center gap-2 bg-gray-200 border-2 border-gray-200 hover:border-gray-400 rounded-md p-3 cursor-pointer"
          >
            <h3 className="text-lg font-bold text-sky-400">
              {producto.nombre}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default Soporte;
