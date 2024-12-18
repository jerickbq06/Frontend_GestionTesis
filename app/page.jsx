import Link from "next/link";
const Page = () => {

  return (
    <div>
      <header className="py-4 px-7 bg-red-400 text-white font-bold ">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold ml-4">
              Sistema de Gestion de Tesis
            </h1>
          </div>
          <div className="flex gap-5 justify-center items-center">
            <Link href="/auth/login">
              <p>
                Ingresar
              </p>
            </Link>
          </div>
        </div>
      </header>
      <main className="min-h-[90vh] w-[100%] p-7 flex justify-center items-center">
        <div className="rounded border border-gray-500 mx-5 flex flex-col justify-center items-start">
          <div className="bg-red-400 text-white w-full p-5 font-bold text-xl">
            <h1>Mision</h1>
          </div>
          <div className="p-6 text-gray-500 font-light text-l italic">
            Formar profesionales competentes y emprendedores desde lo académico,
            la investigación, y la vinculación, que contribuyan a mejorar la
            calidad de vida de la sociedad.
          </div>
        </div>
        <div className="rounded border border-gray-500 mx-5">
          <div className="bg-red-400 text-white w-full p-5 font-bold text-xl">
            <h1>Vision</h1>
          </div>
          <div className="p-6 text-gray-500 font-light text-l italic">
            Formar profesionales competentes y emprendedores desde lo académico,
            la investigación, y la vinculación, que contribuyan a mejorar la
            calidad de vida de la sociedad.
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;
