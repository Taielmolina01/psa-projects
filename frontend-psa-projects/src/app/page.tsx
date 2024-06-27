import Footer from ".//footer.tsx";

export default function Home() {
  return (
    <div className="w-full h-min-full h-full">
      <div className="bg-gray-100 h-full">
        <div className="py-20 relative flex items-center justify-center">
          <img
            src="/logo.png"
            alt="Logo PSA"
            className="img-center w-85 h-85 object-contain"
          />
        </div>

        <div className="relative flex items-center justify-center">
          <div className="bg-white dark:bg-gray-200 p-5 rounded-lg shadow-lg max-w-4xl mb-5">
            <p className="text-lg text-neutral-950 dark:text-neutral-950 text-justify">
              Somos una empresa dedicada a brindar soluciones tecnológicas
              innovadoras. Nuestra misión es mejorar la vida de las personas a
              través de la tecnología, ofreciendo productos y servicios de alta
              calidad. Nos comprometemos a mantenernos a la vanguardia de las
              tendencias tecnológicas y a satisfacer las necesidades cambiantes
              de nuestros clientes.
            </p>
          </div>
        </div>

        <div className="relative flex items-center justify-center mb-10">
          <div className="bg-white dark:bg-gray-200 p-5 rounded-lg shadow-lg max-w-4xl">
            <p className="text-lg text-neutral-950 dark:text-neutral-950 text-justify">
              Con poco más de quince años en el mercado, una facturación anual
              cercana a los USD 20M, una dotación de 450 empleados y oficinas en
              Buenos Aires, Santiago de Chile y Lima, nos hemos consolidado como
              un proveedor muy competitivo en el difícil segmento de productos
              ERP (Enterprise Resource Planning), CRM (Customer Relationship
              Management) y BI (Business Intelligence) para empresas medianas y
              medianas/grandes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
