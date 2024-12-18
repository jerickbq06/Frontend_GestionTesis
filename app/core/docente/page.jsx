"use client";
import { dataConfig } from "../../../config";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const page = () => {
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
  const [currentDocente, setCurrentDocente] = useState({});
  const [filteredEstudaintes, setFilteredEstudiantes] = useState([]);
  const [originalEstudiantes, setOriginalEstudiantes] = useState([]);
  const [estudainteSearch, setEstudainteSearch] = useState("");

  useEffect(() => {
    const docente = JSON.parse(localStorage.getItem("docente"));
    setCurrentDocente(docente);

    const fetchData = async () => {
      try {
        const res = await fetch(`${dataConfig.API_URL}/usuarios`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("docenteToken")}`,
          },
        });
        const data = await res.json();
        const usuarios = data.data;
        const docenteId = docente.id_usuario;
        console.log("Usuarios:", usuarios);
        // Filtrar estudiantes relacionados con el docente
        const estudiantes = usuarios.filter(
          (student) =>
            student.id_rol === 1 && // Es estudiante
            student.tesis.some((tesis) => tesis.id_tutor_docente === docenteId)
        );

        // Actualizar listas
        setOriginalEstudiantes(estudiantes);
        setFilteredEstudiantes(estudiantes); // Inicializar la lista filtrada
        console.log("Estudiantes realcinados a docente de id: "+ docenteId, originalEstudiantes);
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      }
    };

    fetchData();
  }, []);

  const handleFilterEstudiante = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setEstudainteSearch(searchValue);

    if (searchValue === "") {
      // Restaurar la lista original si no hay búsqueda
      setFilteredEstudiantes(originalEstudiantes);
      return;
    }

    const filtered = originalEstudiantes.filter((estudiante) =>
      estudiante.nombres_usuario.toLowerCase().includes(searchValue)
    );

    setFilteredEstudiantes(filtered);
  };

  const logout = () => {
    console.log("Cerrar sesión");
    localStorage.removeItem("docenteToken");
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  const handleCalificarTesis = async (idTesis) => {
    try {
      const response = await fetch(`${dataConfig.API_URL}/tesis/${idTesis}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("docenteToken")}`,
        },
      });
      const data = await response.json();
      console.log( data);
      Swal.fire({
        title: "Calificar tesis",
        html: `
        <div class="mb-3 flex flex-col w-full justify-center items-center">
          <label for="calificacion">Calificación</label>
          <input type="number" id="calificacion" class="swal2-input w-full" placeholder="Calificación" min="0" max="100" required>
        </div>
        <div>
          <label for="observaciones">Observaciones</label>
          <textarea id="observaciones" class="swal2-textarea" placeholder="Observaciones" required></textarea></textarea>

        </div>

        `,
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: "Calificar",
        cancelButtonText: "Cancelar",
        preConfirm: () => {
          const calificacion = Swal.getPopup().querySelector("#calificacion").value;
          const observaciones = Swal.getPopup().querySelector("#observaciones").value;
          if (calificacion < 0 || calificacion > 10) {
            Swal.showValidationMessage("La calificación debe ser un número entre 0 y 10");
          }
          if (!calificacion || !observaciones) {
            Swal.showValidationMessage("Todos los campos son requeridos");
          }
          return { calificacion: calificacion, observaciones: observaciones };
        }
      }).then(async (result) => {
        if(result.isConfirmed) {
          console.log("Calificación:", result.value.calificacion);
          console.log("Observaciones:", result.value.observaciones);
          // guardar en la base de datos, calificación y observaciones
          try {
            const response = await fetch(`${dataConfig.API_URL}/calificacion_tesis`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("docenteToken")}`,
              },
              body: JSON.stringify({
                id_tesis: idTesis,
                id_estudiante: data.tesis.estudiante.id_usuario,
                calificacion: result.value.calificacion,
                observaciones: result.value.observaciones,
              }),
            })
            const res = await response.json();
            console.log("Calificación guardada:", res);
          } catch (error) {
            console.error("Error al guardar la calificación:", error);
            Toast.fire({
              icon: "error",
              title: "Error al guardar la calificación",
            });
          }

          Swal.fire({
            title: "Calificación guardada",
            text: "La calificación ha sido guardada correctamente,",

            icon: "success",
          })
        }
      });
    } catch (error) {
      console.error("Error al obtener la tesis:", error);
      Toast.fire({
        icon: "error",
        title: "Error al obtener la tesis",
      });
    }
      
  }
  const handleViewTesis = async (idTesis) => {
    try {
      const response = await fetch(`${dataConfig.API_URL}/tesis/${idTesis}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("docenteToken")}`,
        },
      });
      const data = await response.json();
      console.log( data);
      if (data.tesis.estado === "aprobado") {
        Swal.fire({
          title: "Detalles de la tesis",
          html: `Título: ${data.tesis.titulo}<br>Descripción: ${data.tesis.descripcion}<br>Estado: ${data.tesis.estado}<br>Estudiante: ${data.tesis.estudiante.nombres_usuario}<br>Tutor: ${data.tesis.tutor.nombres_usuario}<br>Grupal: ${data.tesis.grupal ? "Sí" : "No"}`,
          showCloseButton: true,
        });
        return;
      }
      Swal.fire({
        title: "Detalles de la tesis, aprobar o rechazar",
        html: `
        Título: ${data.tesis.titulo}<br>
        Descripción: ${data.tesis.descripcion}<br>
        Estado: ${data.tesis.estado}<br>
        Estudiante: ${data.tesis.estudiante.nombres_usuario}<br>
        Tutor: ${data.tesis.tutor.nombres_usuario}<br>
        Grupal: ${data.tesis.grupal ? "Sí" : "No"}`,
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: "Aprobar",
        cancelButtonText: "Rechazar",
      }).then((result) => {
        if (result.isConfirmed) {
          // hacer el cambio de estado de en espera a aprovado en el campo estado de la tesis
          fetch(`${dataConfig.API_URL}/tesis/actualizarEstado/${idTesis}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("docenteToken")}`,
            },
            body: JSON.stringify({
              estado: "aprobado",
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log("Tesis aprovada:", data);
              Toast.fire({
                icon: "success",
                title: "Tesis aprovada",
              });
            })
            .catch((error) => {
              console.error("Error al aprobar la tesis:", error);
              Toast.fire({
                icon: "error",
                title: "Error al aprobar la tesis",
              });
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // no hacer nada
          Swal.fire("Rechazado", "", "error");
        }
      });

      
    } catch (error) {
      console.error("Error al obtener la tesis:", error);
      Toast.fire({
        icon: "error",
        title: "Error al obtener la tesis",
      });
      
    }
  }
  return (
    <div>
      <header className="py-4 px-7 bg-red-400 text-white font-bold">
        <div className="flex items-center justify-between">
          <div className="flex">
            <h1 className="text-xl font-bold text-white gap-1 flex justify-center items-center">
              <Link href={"/core/decano"}>Sistema de gestión de tesis</Link>
            </h1>
            <div className="flex justify-center items-center gap-1 ml-5">
              Docente - {currentDocente.nombres_usuario}
            </div>
          </div>
          <nav>
            <ul className="flex gap-3 justify-center items-center">
              <li>
                <button
                  type="button"
                  onClick={logout}
                  className="bg-red-400 text-white px-3 py-1 rounded"
                >
                  Cerrar sesión
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="w-full p-3 flex flex-col items-center justify-center gap-2 min-h-[90vh]">
        <div className="w-full min-h-[400px] overflow-auto">
          <h1 className="font-bold text-3xl text-red-400 text-center my-5">
            Lista de estudiantes en proceso, publicación de temas
          </h1>
          <div className="bg-red-400 p-3 rounded m-3">
            <div className="text-center mb-3 flex justify-between items-center">
              <h1 className="text-white text-2xl font-bold text-center mb-3">
                Filtros de estudiantes
              </h1>
            </div>
            <div className="flex justify-center items-center">
              <div className="flex justify-center items-center w-full gap-3">
                <label htmlFor="estado" className="text-white">
                  Buscar por nombres
                </label>
                <input
                  type="text"
                  value={estudainteSearch}
                  onChange={handleFilterEstudiante}
                  placeholder="Buscar por nombre a estudiante"
                  className="p-2 rounded border border-red-300 w-full focus-within:outline-none"
                />
              </div>
            </div>
          </div>
          <table className="w-full border border-red-300 h-auto overflow-auto">
            <thead>
              <tr className="bg-red-400 text-white">
                <th className="p-3">Nombres</th>
                <th className="p-3">Correo</th>
                <th className="p-3">Tema</th>
                <th className="p-3">Descripción</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Calificacion</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredEstudaintes.length > 0 ? (
                filteredEstudaintes.map((estudiante) => (
                  <tr key={estudiante.id_usuario}>
                    <td className="p-3 text-center">{estudiante.nombres_usuario}</td>
                    <td className="p-3 text-center">{estudiante.email}</td>
                    <td className="p-3 text-center">{estudiante.tesis[0].titulo}</td>
                    <td className="p-3 text-center">{estudiante.tesis[0].descripcion}</td>
                    <td className="p-3 text-center">{estudiante.tesis[0].estado}</td>
                    <td className="p-3 text-center">{estudiante.tesis[0].calificaciones.length != 0 ? 
                    estudiante.tesis[0].calificaciones[0].calificacion : "Sin calificar"  
                  }</td>
                    <td className="p-3 text-center flex justify-center items-center gap-3">
                      <button
                        type="button"
                        className="bg-red-400 text-white px-4 py-2 rounded"
                        onClick={() => handleViewTesis(estudiante.tesis[0].id_tesis)}
                      >
                        Ver tesis
                      </button>
                      {estudiante.tesis[0].estado === "aprobado" && estudiante.tesis[0].calificaciones.length == 0 ? (
                        <button
                          type="button"
                          className="bg-blue-400 text-white px-4 py-2 rounded"
                          onClick={() => handleCalificarTesis(estudiante.tesis[0].id_tesis)}
                        >
                          Calificar tesis 
                        </button>
                      ) : (
                        "Tesis ya calificada o sin aprobar"
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-3 text-center">
                    No hay estudiantes
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

export default page;
