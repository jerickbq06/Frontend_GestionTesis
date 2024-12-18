"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { dataConfig } from "../../config";
import Swal from "sweetalert2";

const Page = () => {
  const router = useRouter();
  // filtros
  const [estudainteSearch, setEstudianteSearch] = useState("");
  const [docenteSearch, setDocenteSearch] = useState("");
  const [propuestaSearch, setPropuestaSearch] = useState("");
  const [ambitoSearch, setAmbitoSearch] = useState("todos");
  // estados
  const [estudiantes, setEstudiantes] = useState([]);
  const [originalEstudiantes, setOriginalEstudiantes] = useState([]);

  const [propuestasTesis, setPropuestasTesis] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [originalDocentes, setOriginalDocentes] = useState([]);

  useEffect(() => {
    const fetchPropuestas = async () => {
      const response = await fetch(`${dataConfig.API_URL}/propuesta_tesis`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      const data = await response.json();
      // console.log(data);
      setPropuestasTesis(data.propuestas);
    };
    // hacer fetch de los usuarios, todos los usuarios
    const fetchUsuarios = async () => {
      const response = await fetch(`${dataConfig.API_URL}/usuarios`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      const data = await response.json();
      const estudiantes = data.data.filter(
        (estudiante) => estudiante.id_rol === 1
      ); // de aqui se filtran estudiantes
      const docentes = data.data.filter((docente) => docente.id_rol === 2); // de aqui se filtran docentes
      console.log("estudiantes", estudiantes);
      console.log("docentes", docentes);
      setDocentes(docentes); // se setean los docentes
      setEstudiantes(estudiantes); // se setean los estudiantes
      setOriginalEstudiantes(estudiantes); // se setean los estudiantes originales
      setOriginalDocentes(docentes); // se setean los docentes originales
    };
    fetchUsuarios();
    fetchPropuestas();
  }, []);

  const viewEstudiante = (id) => {
    const student = estudiantes.find(
      (estudiante) => estudiante.id_usuario === id
    );

    if (student.tesis.length === 0) {
      Swal.fire({
        title: "Estudiante",
        text: "El estudiante no tiene propuestas",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Eliminar estudiante",
        cancelButtonText: "Cerrar",
        showCloseButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Eliminar estudiante",
            text: "¿Estas seguro de eliminar al estudiante?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar",
            showCloseButton: true,
          }).then((result) => {
            if (result.isConfirmed) {
              fetch(`${dataConfig.API_URL}/usuarios/${student.id_usuario}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
                },
              })
                .then((response) => response.json())
                .then((data) => {
                  console.log(data);
                  Swal.fire({
                    title: "Estudiante eliminado",
                    text: "El estudiante ha sido eliminado correctamente",
                    icon: "success",
                  });
                  setEstudiantes(
                    estudiantes.filter((est) => est.id_usuario !== id)
                  );
                })
                .catch((error) => {
                  console.error(error);
                  Swal.fire({
                    title: "Error",
                    text: "Ha ocurrido un error al eliminar al estudiante",
                    icon: "error",
                  });
                });
            }
          });
        }
      });
      return;
    }
    Swal.fire({
      title: "Estudiante",
      html: `
      <div class="flex flex-col gap-3">
        <h1 class="text-2xl font-bold text-red-400">${
          student.nombres_usuario
        }</h1>
        <h2 class="text-lg font-bold text-red-400">Propuestas de tesis</h2>
        <ul class="list-disc list-inside">
          ${student.tesis.map((tesis) => `<li>${tesis.titulo}</li>`).join("")}
        </ul>
      </div>
      `,
      showCancelButton: true,
      allowOutsideClick: true,
      cancelButtonText: "Eliminar estudiante",
      confirmButtonText: "Aceptar propuesta",
    }).then((result) => {});
  };
  const handleViewPropuesta = (id) => {
    const propuesta = propuestasTesis.find(
      (propuesta) => propuesta.id_propuesta_tesis === id
    );
    Swal.fire({
      title: "Propuesta de tesis",
      html: `
      <div class="flex flex-col gap-3">
        <h1 class="text-2xl font-bold text-red-400">${propuesta.titulo}</h1>
        <h2 class="text-lg font-bold text-red-400">Descripcion</h2>
        <p>${propuesta.descripcion}</p>
        <h2 class="text-lg font-bold text-red-400">Ambito</h2>
        <p>${propuesta.ambito}</p>
      </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Eliminar propuesta",
      cancelButtonText: "Cerrar",
      showCloseButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Eliminar propuesta",
          text: "¿Estas seguro de eliminar la propuesta?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Eliminar",
          cancelButtonText: "Cancelar",
          showCloseButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            fetch(
              `${dataConfig.API_URL}/propuesta_tesis/${propuesta.id_propuesta_tesis}`,
              {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
                },
              }
            )
              .then((response) => response.json())
              .then((data) => {
                console.log(data);
                Swal.fire({
                  title: "Propuesta eliminada",
                  text: "La propuesta ha sido eliminada correctamente",
                  icon: "success",
                });
                setPropuestasTesis(
                  propuestasTesis.filter(
                    (prop) => prop.id_propuesta_tesis !== id
                  )
                );
              })
              .catch((error) => {
                console.error(error);
                Swal.fire({
                  title: "Error",
                  text: "Ha ocurrido un error al eliminar la propuesta",
                  icon: "error",
                });
              });
          }
        });
      }
    });
  };

  const handleFilterEstudiante = (e) => {
    const value = e.target.value.trim().toLowerCase(); // Eliminamos espacios innecesarios y normalizamos mayúsculas/minúsculas.
    setEstudianteSearch(value);

    if (value === "") {
      // Si el campo está vacío, restauramos la lista original
      setEstudiantes(originalEstudiantes);
      return;
    }

    // Filtramos sobre la lista original para no perder los datos originales
    const filtered = originalEstudiantes.filter((estudiante) =>
      estudiante.nombres_usuario.toLowerCase().includes(value)
    );
    setEstudiantes(filtered);
  };

  const handleFilterDocente = (e) => {
    const value = e.target.value.trim().toLowerCase(); // Eliminamos espacios innecesarios y normalizamos mayúsculas/minúsculas.
    setDocenteSearch(value);

    if (value === "") {
      // Si el campo está vacío, restauramos la lista original
      setDocentes(originalDocentes);
      return;
    }

    // Filtramos sobre la lista original para no perder los datos originales
    const filtered = originalDocentes.filter((docente) =>
      docente.nombres_usuario.toLowerCase().includes(value)
    );
    setDocentes(filtered);
  };

  const handleCreateStudent = () => {
    Swal.fire({
      title: "Agregar estudiante",
      html: `
      <form id="form-crear-estudiante" class="flex flex-col gap-3">
        <input type="text" id="nombres" name="nombres" placeholder="Nombres completos" class="p-2 rounded border border-red-300 focus-within:outline-none" required>
        <input type="email" id="email" name="email" placeholder="Correo" class="p-2 rounded border border-red-300 focus-within:outline-none" required>
        <input type="text" id="telefono" name="telefono" placeholder="Telefono" class="p-2 rounded border border-red-300 focus-within:outline-none" required>
        <input type="text" id="address" name="address" placeholder="Direccion" class="p-2 rounded border border-red-300 focus-within:outline-none" required>
        <input type="password" id="password" name="password" placeholder="Contraseña" class="p-2 rounded border border-red-300 focus-within:outline-none" required>
        <input type="password" id="password-confirm" name="password-confirm" placeholder="Confirmar contraseña" class="p-2 rounded border border-red-300 focus-within:outline-none" required>
      </form>
      `,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Agregar",
      cancelButtonText: "Cancelar",
      showCloseButton: true,
      preConfirm: () => {
        const names = document.getElementById("nombres").value;
        const email = document.getElementById("email").value;
        const telefono = document.getElementById("telefono").value;
        const password = document.getElementById("password").value;
        const address = document.getElementById("address").value;
        const passwordConfirm =
          document.getElementById("password-confirm").value;

        if (password !== passwordConfirm) {
          Swal.showValidationMessage("Las contraseñas no coinciden");
          return false;
        }

        if (
          names === "" ||
          email === "" ||
          telefono === "" ||
          address === "" ||
          password === "" ||
          passwordConfirm === ""
        ) {
          Swal.showValidationMessage("Todos los campos son requeridos");
          return false;
        }
        const data = {
          nombres_usuario: names,
          email,
          telefono_usuario: telefono,
          direccion_usuario: address,
          password,
          id_rol: 1, // rol de estudiante
        };
        fetch(`${dataConfig.API_URL}/usuarios`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          body: JSON.stringify(data),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            Swal.fire({
              title: "Estudiante agregado",
              text: "El estudiante ha sido agregado correctamente",
              icon: "success",
            });
            setEstudiantes([...estudiantes, data.usuario]);
          })
          .catch((error) => {
            Swal.fire({
              title: "Error",
              text: "Ha ocurrido un error al agregar el estudiante",
              icon: "error",
            });
            console.log(error);
          });
      },
    });
  };

  const handleCreatePropuesta = () => {
    Swal.fire({
      title: "Agregar propuesta",
      html: `
      <form id="form-crear-propuesta" class="flex flex-col gap-3">
        <input type="text" id="titulo" name="titulo" placeholder="Titulo de la propuesta" class="p-2 rounded border border-red-300 focus-within:outline-none" required>
        <textarea id="descripcion" name="descripcion" placeholder="Descripcion de la propuesta" class="p-2 rounded border border-red-300 focus-within:outline-none" required></textarea>
        <select name="ambito" id="ambito" class="p-2 rounded border border-red-300 focus-within:outline-none" required>
          <option value="desarrollo web">Desarrollo web</option>
          <option value="desarrollo movil">Desarrollo movil</option>
          <option value="investigacion">Investigacion</option>
          <option value="desarrollo de videojuegos">Desarrollo de videojuegos</option>
          <option value="inteligencia artificial">Inteligencia artificial</option>
        </select>
      </form>
      `,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Agregar",
      cancelButtonText: "Cancelar",
      showCloseButton: true,
      preConfirm: () => {
        const titulo = document.getElementById("titulo").value;
        const descripcion = document.getElementById("descripcion").value;
        const ambito = document.getElementById("ambito").value;

        if (titulo === "" || descripcion === "" || ambito === "") {
          Swal.showValidationMessage("Todos los campos son requeridos");
          return false;
        }
        const data = {
          titulo,
          descripcion,
          ambito,
        };
        fetch(`${dataConfig.API_URL}/propuesta_tesis`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          body: JSON.stringify(data),
        })
          .then((response) => response.json())
          .then((data) => {
            setPropuestasTesis([...propuestasTesis, data.propuesta]);
            console.log(data);
            Swal.fire({
              title: "Propuesta agregada",
              text: "La propuesta ha sido agregada correctamente",
              icon: "success",
            });
          })
          .catch((error) => {
            console.error(error);
            Swal.fire({
              title: "Error",
              text: "Ha ocurrido un error al agregar la propuesta",
              icon: "error",
            });
          });
      },
    });
  };

  const handleCreateDocente = () => {
    Swal.fire({
      title: "Agregar estudiante",
      html: `
      <form id="form-crear-estudiante" class="flex flex-col gap-3">
        <input type="text" id="nombres" name="nombres" placeholder="Nombres completos" class="p-2 rounded border border-red-300 focus-within:outline-none" required>
        <input type="email" id="email" name="email" placeholder="Correo" class="p-2 rounded border border-red-300 focus-within:outline-none" required>
        <input type="text" id="telefono" name="telefono" placeholder="Telefono" class="p-2 rounded border border-red-300 focus-within:outline-none" required>
        <input type="text" id="address" name="address" placeholder="Direccion" class="p-2 rounded border border-red-300 focus-within:outline-none" required>
        <input type="password" id="password" name="password" placeholder="Contraseña" class="p-2 rounded border border-red-300 focus-within:outline-none" required>
        <input type="password" id="password-confirm" name="password-confirm" placeholder="Confirmar contraseña" class="p-2 rounded border border-red-300 focus-within:outline-none" required>
      </form>
      `,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Agregar",
      cancelButtonText: "Cancelar",
      showCloseButton: true,
      preConfirm: () => {
        const names = document.getElementById("nombres").value;
        const email = document.getElementById("email").value;
        const telefono = document.getElementById("telefono").value;
        const password = document.getElementById("password").value;
        const address = document.getElementById("address").value;
        const passwordConfirm =
          document.getElementById("password-confirm").value;

        if (password !== passwordConfirm) {
          Swal.showValidationMessage("Las contraseñas no coinciden");
          return false;
        }

        if (
          names === "" ||
          email === "" ||
          telefono === "" ||
          address === "" ||
          password === "" ||
          passwordConfirm === ""
        ) {
          Swal.showValidationMessage("Todos los campos son requeridos");
          return false;
        }
        const data = {
          nombres_usuario: names,
          email,
          telefono_usuario: telefono,
          direccion_usuario: address,
          password,
          id_rol: 2, // rol de docente
        };
        fetch(`${dataConfig.API_URL}/usuarios`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          body: JSON.stringify(data),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            Swal.fire({
              title: "Docente agregado",
              text: "El docente ha sido agregado correctamente",
              icon: "success",
            });
            setDocentes([...docentes, data.usuario]);
          })
          .catch((error) => {
            Swal.fire({
              title: "Error",
              text: "Ha ocurrido un error al agregar al docente",
              icon: "error",
            });
            console.log(error);
          });
      },
    });
  };
  const viewDocente = (id) => {
    const docente = docentes.find((docente) => docente.id_usuario === id);
    Swal.fire({
      title: "Docente",
      html: `
      <div class="flex flex-col gap-3">
        <h1 class="text-2xl font-bold text-red-400">${
          docente.nombres_usuario
        }</h1>
        <h2 class="text-lg font-bold text-red-400">Correo</h2>
        <p>${docente.email}</p>
        <h2 class="text-lg font-bold text-red-400">Telefono</h2>
        <p>${docente.telefono_usuario ? docente.telefono_usuario : "N/A"}</p>
        <h2 class="text-lg font-bold text-red-400">Cedula</h2>
        <p>${docente.cedula ? docente.cedula : "N/A"}</p>
      </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Eliminar docente",
      cancelButtonText: "Cerrar",
      showCloseButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Eliminar docente",
          text: "¿Estas seguro de eliminar al docente?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Eliminar",
          cancelButtonText: "Cancelar",
          showCloseButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            fetch(`${dataConfig.API_URL}/usuarios/${docente.id_usuario}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
              },
            })
              .then((response) => response.json())
              .then((data) => {
                console.log(data);
                Swal.fire({
                  title: "Docente eliminado",
                  text: "El docente ha sido eliminado correctamente",
                  icon: "success",
                });
                setDocentes(docentes.filter((doc) => doc.id_usuario !== id));
              })
              .catch((error) => {
                console.error(error);
                Swal.fire({
                  title: "Error",
                  text: "Ha ocurrido un error al eliminar al docente",
                  icon: "error",
                });
              });
          }
        });
      }
    });
  };
  const logout = () => {
    console.log("Cerrar sesion");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  return (
    <div>
      <header className="py-4 px-7 bg-red-400 text-white font-bold">
        <div className="flex items-center justify-between">
          <div className="flex">
            <h1 className="text-xl font-bold text-white gap-1 flex justify-center items-center">
              <Link href={"/core/decano"}>Sistema de gestion de tesis</Link>
              Administracion
            </h1>
          </div>
          <nav className="">
            <ul className="flex gap-3 justify-center items-center">
              <li>
                <button
                  type="button"
                  onClick={logout}
                  className="bg-red-400 text-white px-3 py-1 rounded"
                >
                  Cerrar sesion
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="w-full p-3 flex flex-col items-center justify-center gap-2 min-h-[90vh]">
        <div className="w-full h-[400px] overflow-auto">
          <h1 className="font-bold text-3xl text-red-400 text-center my-5">
            Lista de estudaintes en proceso
          </h1>
          <div className="bg-red-400 p-3 rounded m-3">
            <div className=" text-center mb-3 flex justify-between items-center">
              <h1 className="text-white text-2xl font-bold text-center mb-3">
                Filtros de estudiantes
              </h1>
              <button
                className="rounded text-white border-white border py-3 px-4 hover:bg-white hover:text-red-400 transition"
                onClick={handleCreateStudent}
              >
                Agregar Estudiante al proceso
              </button>
            </div>
            <div className="flex justify-center items-center">
              <div className="flex justify-center items-center w-full gap-3">
                <label htmlFor="estado" className="text-white">
                  Buscar por Nombres
                </label>
                <input
                  type="text"
                  value={estudainteSearch}
                  onChange={handleFilterEstudiante}
                  placeholder="Buscar por nombre a estudiante"
                  className="p-2 rounded border border-red-300 w-full focus-within:outline-none"
                />
              </div>
              <div className="flex justify-center items-center w-full gap-3">
                <label htmlFor="estado" className="text-white">
                  Buscar por estado
                </label>
                <select
                  name="estado"
                  id="estado"
                  className="p-2 rounded border border-red-300 focus-within:outline-none"
                >
                  <option value="1">En espera</option>
                  <option value="2">Aprovado</option>
                  <option value="2">Rechazado</option>
                </select>
              </div>
            </div>
          </div>
          <table className="w-full border border-red-300 h-auto overflow-auto">
            <thead>
              <tr className="bg-red-400 text-white">
                <th className="p-3">ID estudainte</th>
                <th className="p-3">Nombres</th>
                <th className="p-3">Correo</th>
                <th className="p-3">Telefono</th>
                <th className="p-3">Rol</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {estudiantes.length > 0 ? (
                estudiantes.map((estudiante) => (
                  <tr key={estudiante.id_usuario}>
                    <td className="p-3 text-center">{estudiante.id_usuario}</td>
                    <td className="p-3 text-center">
                      {estudiante.nombres_usuario}
                    </td>
                    <td className="p-3 text-center">{estudiante.email}</td>
                    <td className="p-3 text-center">
                      {estudiante.telefono_usuario
                        ? estudiante.telefono_usuario
                        : "N/A"}
                    </td>
                    <td className="p-3 text-center">
                      {estudiante.id_rol === 1 ? "Estudiante" : "Otro"}
                    </td>
                    <td>
                      <button
                        onClick={() => viewEstudiante(estudiante.id_usuario)}
                        type="button"
                        className={` bg-blue-400 text-white px-3 py-1 rounded`}
                      >
                        Ver Acciones
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No hay estudiantes</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="my-7"></div> {/* espacio entre tablas */}
        <div className="w-full h-[400px] overflow-auto">
          <h1 className="font-bold text-3xl text-red-400 text-center my-5">
            Lista de docentes tutores
          </h1>
          <div className="bg-red-400 p-3 rounded m-3">
            <div className=" text-center mb-3 flex justify-between items-center">
              <h1 className="text-white text-2xl font-bold">
                Filtros de docentes
              </h1>
              <button
                className="rounded text-white border-white border py-3 px-4 hover:bg-white hover:text-red-400 transition"
                onClick={handleCreateDocente}
              >
                Agregar Docente al proceso
              </button>
            </div>
            <div className="flex justify-center items-center">
              <div className="flex justify-center items-center w-full gap-3">
                <label htmlFor="estado" className="text-white">
                  Buscar por Nombres
                </label>
                <input
                  type="text"
                  value={docenteSearch}
                  onChange={handleFilterDocente}
                  placeholder="Buscar por nombre a docente"
                  className="p-2 rounded border border-red-300 w-full focus-within:outline-none"
                />
              </div>
            </div>
          </div>
          <table className="w-full border border-red-300 h-auto overflow-auto">
            <thead>
              <tr className="bg-red-400 text-white">
                <th className="p-3">ID docente</th>
                <th className="p-3">Nombres</th>
                <th className="p-3">Correo</th>
                <th className="p-3">Cedula</th>
                <th className="p-3">Telefono</th>
                <th className="p-3">Rol</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {docentes.length > 0 ? (
                docentes.map((docente) => (
                  <tr key={docente.id_usuario}>
                    <td className="p-3 text-center">{docente.id_usuario}</td>
                    <td className="p-3 text-center">
                      {docente.nombres_usuario}
                    </td>
                    <td className="p-3 text-center">{docente.email}</td>
                    <td className="p-3 text-center">
                      {docente.cedula ? docente.cedula : "N/A"}
                    </td>
                    <td className="p-3 text-center">
                      {docente.telefono_usuario
                        ? docente.telefono_usuario
                        : "N/A"}
                    </td>
                    <td className="p-3 text-center">
                      {docente.id_rol === 2 ? "Docente" : "Otro"}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => viewDocente(docente.id_usuario)}
                        type="button"
                        className={` bg-blue-400 text-white px-3 py-1 rounded`}
                      >
                        Ver Acciones
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No hay docentes</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="my-7"></div> {/* espacio entre tablas */}
        <div className="w-full h-[400px] overflow-auto">
          <h1 className="font-bold text-3xl text-red-400 text-center my-5">
            Propuestas de tesis
          </h1>
          <div className="bg-red-400 p-3 rounded m-3">
            <div className=" text-center mb-3 flex justify-between items-center">
              <h1 className="text-white text-2xl font-bold">
                Filtros de propuestas
              </h1>
              <button
                className="rounded text-white border-white border py-3 px-4 hover:bg-white hover:text-red-400 transition"
                onClick={handleCreatePropuesta}
              >
                Agregar Propuesta
              </button>
            </div>
            <div className="flex justify-center items-center">
              <div className="flex justify-center items-center w-full gap-3">
                <label htmlFor="estado" className="text-white">
                  Buscar por Titulo
                </label>
                <input
                  type="text"
                  placeholder="Buscar por titulo de propuesta"
                  className="p-2 rounded border border-red-300 w-full focus-within:outline-none"
                />
              </div>
              <div className="flex justify-center items-center w-full gap-3">
                <label htmlFor="estado" className="text-white">
                  Buscar por ambito
                </label>
                <select
                  name="estado"
                  id="estado"
                  className="p-2 rounded border border-red-300 focus-within:outline-none"
                >
                  <option value="todos">Todos</option>
                  <option value="desarrollo web">Desarrollo web</option>
                  <option value="desarrollo movil">Desarrollo movil</option>
                  <option value="investigacion">Investigacion</option>
                  <option value="desarrollo de videojuegos">
                    Desarrollo de videojuegos
                  </option>
                  <option value="inteligencia artificial">
                    Inteligencia artificial
                  </option>
                </select>
              </div>
            </div>
          </div>
          <table className="w-full border border-red-300 h-auto overflow-auto">
            <thead>
              <tr className="bg-red-400 text-white">
                <th className="p-3">ID propuesta</th>
                <th className="p-3">Titulo</th>
                <th className="p-3">Descripcion</th>
                <th className="p-3">Ambito</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {propuestasTesis.length > 0 ? (
                propuestasTesis.map((propuesta) => (
                  <tr key={propuesta.id_propuesta_tesis}>
                    <td className="p-3 text-center">
                      {propuesta.id_propuesta_tesis}
                    </td>
                    <td className="p-3 text-center">{propuesta.titulo}</td>
                    <td className="p-3 text-center">{propuesta.descripcion}</td>
                    <td className="p-3 text-center">{propuesta.ambito}</td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        className={` bg-blue-400 text-white px-3 py-1 rounded`}
                        onClick={() =>
                          handleViewPropuesta(propuesta.id_propuesta_tesis)
                        }
                      >
                        Ver Acciones
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center rounded p-5">
                    No hay propuestas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Page;
