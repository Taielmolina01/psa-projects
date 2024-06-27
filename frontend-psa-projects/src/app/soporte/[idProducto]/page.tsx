import Link from "next/link";

async function datosVersiones(idProducto: any) {
  const versiones = await fetch(
    `https://soporte-wyq6.onrender.com/productos/${idProducto}/versiones`,
    { cache: "no-store" },
  );
  return await versiones.json();
}

async function datosProducto(idProducto: any) {
  const producto = await fetch(
    `https://soporte-wyq6.onrender.com/productos/${idProducto}`,
    { cache: "no-store" },
  );
  return await producto.json();
}

async function Producto({ params }: any) {
  const [versiones, producto] = await Promise.all([
    datosVersiones(params.idProducto),
    datosProducto(params.idProducto),
  ]);

  return (
    <div>
      <h1 className="pt-5 text-3xl text-center font-bold text-sky-400 mb-3">
        {producto.nombre}
      </h1>
      <h2 className="text-center text-xl font-bold text-sky-300 mb-3">
        Versiones
      </h2>
      {versiones.map((version: any) => (
        <Link href={`/version/${version.idVersion}`} key={version.idVersion}>
          <div className="w-80 mb-3 group flex justify-center items-center gap-2 bg-gray-200 border-2 border-gray-200 hover:border-gray-400 rounded-md p-3 cursor-pointer">
            <h3 className="text-lg font-bold text-sky-400">{version.nombre}</h3>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default Producto;
