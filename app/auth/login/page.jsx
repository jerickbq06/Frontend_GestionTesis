"use client";
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import Logo from '../../../public/logo.png'
import React from 'react';
import { dataConfig } from "../../../config";
import Swal from 'sweetalert2';
const Page = () => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${dataConfig.API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log(data);
      const user = data.user;

      if (user.id_rol === 1) { // Estudiante
        localStorage.setItem("estudianteToken", data.token);
        localStorage.setItem("estudiante", JSON.stringify(user));
        router.push("/core/estudiante");
      }
      if (user.id_rol === 2) { // Docente
        localStorage.setItem("docenteToken", data.token);
        localStorage.setItem("docente", JSON.stringify(user));
        router.push("/core/docente");
      }
      if (user.id_rol === 3) { // Decano
        localStorage.setItem("decanoToken", data.token);
        localStorage.setItem("decano", JSON.stringify(user));
        router.push("/core/decano");
      }
      if (user.id_rol === 4) { // Admin
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("admin", JSON.stringify(user));
        router.push("/admin");
      }
    } catch (error) {
      console.error(error);
      Toast.fire({
        icon: "error",
        title: "Error al ingresar",
      })
    }
  }
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  })
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }
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
            <p>Ingresar</p>
          </Link>
        </div>
      </div>
    </header>
    <main className="flex justify-center items-center min-h-[90vh]">
      <div className="border border-gray-500  min-w-[500px] h-auto p-5 rounded">
        <div className="flex justify-center items-center py-5">
          <Image
            src={Logo}
            width={300}
            height={100}
            alt="Logo"
          />
        </div>
        <h2 className="text-2xl font-bold text-center">
          Ingresar al sistema de tesis
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col justify-center items-start mb-1 p-3">
            <label htmlFor="email">Correo electronico</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              name="email"
              className="border border-gray-600 rounded px-[20px] py-[10px] w-full focus-within:border-red-500 outline-none"
              placeholder="alguien@example.com"
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col justify-center items-start mb-1 p-3">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              name="password"
              className="border border-gray-600 rounded px-[20px] py-[10px] w-full focus-within:border-red-500 outline-none"
              placeholder="**********"
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-center items-center p-5 ">
            <button
              type="submit"
              className="bg-red-500 text-white px-5 py-2 rounded font-bold"
            >
              Ingresar
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>
  )
}

export default Page