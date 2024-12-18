"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { dataConfig } from "../../../config";

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
  const [currentStudent, setCurrentStudent] = React.useState({});
  const [calificacion, setCalificacion] = React.useState(null);
  const [temaAprovado, setTemaAprovado] = React.useState(false);
  const [tesisCalificada, setTesisCalificada] = React.useState(false);
  const [enEspere, setEnEspere] = React.useState(false); // esperando a que se apruebe el tema
  const [sinTema, setSinTema] = React.useState(false); // no tiene tema propuesto
  const [showFormPropuesta, setShowFormPropuesta] = React.useState(false);
  const [propuestasTesis, setPropuestasTesis] = React.useState([]);
  const [originalPropuestasTesis, setOriginalPropuestasTesis] = React.useState(
    []
  );
  const [propuestaForm, setPropuestaForm] = React.useState({
    tema: "",
    modo: "individual",
    estudiante_companero: "",
    docente: "",
    ambito: "",
  });
  const [isGrupal, setIsGrupal] = React.useState(false);
  const [estudiantes, setEstudiantes] = React.useState([]);
  const [docentes, setDocentes] = React.useState([]);
  const [ambitoFilter, setAmbitoFilter] = React.useState("todos");
  const [filteredPropuestasTesis, setfilteredPropuestasTesis] = React.useState([]);

  // los estudiantes que tengan en el array tesis un registro, es porque se les ha aprovado el tema, y ya pasan a la fase de desarrollo de tesis, si en los datos exiten registro de calificacion, es porque ya se ha aprovado la tesis, para esto estan los dos campos importantes en useState, temaAprovado y tesisCalificada, setTema aprovado pasa a ture si tesis.length > 0, y setTesisCalificada pasa a true si calificacion.length > 0

  // si el estudainte no tiene tema aprovado, debera proponer uno, este se supone que se debera almacenar en la tabla tesis del mismo estudaitne, y se debera esperar a que se apruebe, para esto se tiene el campo enEspere, que se pone en true si no tiene tema aprovado, y se pone en false si tiene tema aprovado, y se pone en false si se le aprueba el tema, y se pone en true si se le rechaza el tema, para esto se tiene el campo showFormPropuesta, que se pone en true si enEspere es true, y se pone en false si enEspere es false, y se pone en false si se le aprueba el tema, y se pone en true si se le rechaza el tema, para esto se tiene el campo showFormPropuesta, que se pone en true si enEspere es true, y se pone en false si enEspere es false, y se pone en false si se le aprueba el tema, y se pone en true si se le rechaza el tema, para esto se tiene el campo showFormPropuesta, que se pone en true si enEspere es true, y se pone en false si enEspere es false, y se pone en false si se le aprueba el tema, y se pone en true si se le rechaza el tema, para esto se tiene el campo showFormPropuesta, que se pone en true si enEspere es true, y se pone en false si enEspere es false, y se pone en false si se le aprueba el tema, y se pone en true si se le rechaza el tema, para esto se tiene el campo showFormPropuesta, que se pone en true si enEspere es true, y se pone en false si enEspere es false, y se pone en false si se le aprueba el tema, y se pone en true si se le rechaza el tema, para esto se tiene el campo showFormPropuesta, que se pone en true si enEspere es true, y se pone en false si enEspere es false, y se pone en false si se le aprueba el tema, y se pone en true si se le rechaza el tema, para esto se tiene el campo showFormPropuesta, que se pone en true si

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("estudiante"));
    if (!user || user.id_rol !== 1) {
      router.push("/auth/login");
    }

    function fetchData() {
      // fetch estudiantes
      fetch(`${dataConfig.API_URL}/usuarios`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("estudianteToken")}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const users = data.data;
          // console.log(users);
          // estudiantes
          const estudiantes = users.filter((user) => user.id_rol === 1);
          setEstudiantes(estudiantes);
          console.log("estudiantes: ", estudiantes);
          // guardar el estudiante en currentStudent, el que este logeuado, en localStorage se encuntra su id
          const currentStudent = estudiantes.find(
            (student) =>
              student.id_usuario ===
              JSON.parse(localStorage.getItem("estudiante")).id_usuario
          );
          setCurrentStudent(currentStudent); // se guarda en currentStudent
          console.log("currentStudent", currentStudent);
          const docentes = users.filter((user) => user.id_rol === 2);
          setDocentes(docentes);
          console.log("docentes", docentes);
          // si el estudiante tiene registro en caliiicacion, es porque ya se le ha aprovado la tesis, y debe mostrarse su calificacion

          // los estudaintes que tengan el array de tesis = 0 es porque no han propuesto tema, por lo tanto tampoco tendran aprovacion ni caliifcacion por eso se setea en false temaAprovado, enEspere y tesisCalificada
          if (currentStudent.tesis.length == 0) {
            setTemaAprovado(false);
            setEnEspere(false);
            setTesisCalificada(false);
            setSinTema(true); // formularo de propuesta de tema
            return; // si no tiene tesis, no tiene sentido seguir
          }

          if (currentStudent.tesis[0].calificaciones.length > 0) {
            setCalificacion(
              currentStudent.tesis[0].calificaciones[0].calificacion // calificaion que puso profesor
            );
            setTesisCalificada(true); 
          }
          // el estudiante envio su propuesta pero esta esperando que sea aprovada
          if (currentStudent.tesis[0].estado === "en espera") {
            setEnEspere(true);
            setSinTema(false);
          }
          // el estudiante ya tiene un tema aprovado
          if (currentStudent.tesis[0].estado === "aprobado") {
            setEnEspere(false);
            setTemaAprovado(true);
            setSinTema(false);
          }
        });

      fetch(`${dataConfig.API_URL}/propuesta_tesis`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("estudianteToken")}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setOriginalPropuestasTesis(data.propuestas);
        });
    }


    fetchData();



  }, []);


  const handleViewPropuesta = async (id_propuesta_tesis) => {
    try {
      const response = await fetch(
        `${dataConfig.API_URL}/propuesta_tesis/${id_propuesta_tesis}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("estudianteToken")}`,
          },
        }
      );
      const data = await response.json();
      const propuesta = data.propuesta;
      Swal.fire({
        title: propuesta.titulo,
        html: `
        <p>${propuesta.descripcion}</p>
        <p><strong>Ambito:</strong> ${propuesta.ambito}</p>
        `,
        icon: "info",
        confirmButtonText: "Cerrar",
      });
    } catch (error) {
      console.error(error);
      Toast.fire({
        icon: "error",
        title: "Error al ver propuesta",
      });
    }
  };


  // funcion para capturar los datos del fomrualrio de propuesta de tema
  const handleChangePropuesta = (e) => {
    const { name, value } = e.target;

    // Actualiza el formulario
    const updatedForm = {
      ...propuestaForm,
      [name]: value,
    };

    setPropuestaForm(updatedForm);

    // Actualiza isGrupal en función del valor de "modo"
    if (name === "modo") {
      setIsGrupal(value === "grupal");
    }
  };

  // funcion para enviar la propuesta de tema
  const handleSubmitPropuesaTema = (e) => {
    e.preventDefault();

    // Validación de los campos requeridos
    if (
      propuestaForm.tema === "" ||
      propuestaForm.docente === "" ||
      propuestaForm.modo === ""
    ) {
      Toast.fire({
        icon: "error",
        title: "Todos los campos son requeridos",
      });
      return;
    }

    // Inicializar el cuerpo de la solicitud
    let body = {
      titulo: propuestaForm.tema,
      id_estudiante: JSON.parse(localStorage.getItem("estudiante")).id_usuario,
      id_tutor_docente: propuestaForm.docente,
      descripcion: propuestaForm.tema,
      ambito: propuestaForm.ambito,
      grupal: propuestaForm.modo === "grupal", // Booleano: true si es grupal, false si no lo es
      estado: "en espera", // Por defecto, el estado es "en espera"
    };

    // Si la tesis es grupal, se agrega el id_estudiante_companero
    if (propuestaForm.modo === "grupal") {
      body.id_estudiante_companero = propuestaForm.estudiante_companero;
    } else {
      body.id_estudiante_companero = null; // Si es individual, se puede dejar como null
    }

    console.log(body); // Para verificar los datos que se enviarán

    // Realizar la solicitud POST al servidor
    fetch(`${dataConfig.API_URL}/tesis`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("estudianteToken")}`, // Usar el token del almacenamiento local
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // Mostrar mensaje de éxito
        Toast.fire({
          icon: "success",
          title: "Propuesta enviada correctamente",
        }).then(() => {
          // Actualizar el estado enEspera a true, para mostrar el mensaje de espera
          setSinTema(false); // se quita el formulario de propuesta
          setEnEspere(true); // se muestra el mensaje de espera
          // Ocultar el formulario
          setShowFormPropuesta(false);
        });
      })
      .catch((error) => {
        console.error(error);
        // Mostrar mensaje de error
        Toast.fire({
          icon: "error",
          title: "Error al enviar propuesta",
        });
      });
  };
  // evento para filtrar las propuestas de tesis por ambito
  const handleChangeTesisTopic = (e) => {
    setAmbitoFilter(e.target.value);
  };
  // nativo de nextjs
  const router = useRouter();

  // funcion para cerrar sesion
  const logout = () => {
    console.log("Cerrar sesion");
    localStorage.removeItem("estudianteToken");
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  // funcion para mostrar el formulario de propuesta de tema
  const handleShowFormPropuesta = () => {
    setShowFormPropuesta(!showFormPropuesta);
  };

  return (
    <div>
      <header className="py-4 px-7 bg-red-400 text-white font-bold">
        <div className="flex items-center justify-between">
          <div className="flex">
            <h1 className="text-xl font-bold text-white">
              <Link href={"/core/estudiante"}>Sistema de gestion de tesis</Link>
            </h1>
          </div>
          <nav className="">
            <ul className="flex gap-3 justify-center items-center">
              <li>
                <Link href={"/core/estudiante/datos"}>Mis datos</Link>
              </li>

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
      <main className="p-5 flex flex-col justify-center items-center">
        <div>
          <h1 className="text-2xl text-red-400 font-bold">
            Bienvenido - {currentStudent.nombres_usuario}
          </h1>
        </div>
        <div className="flex justify-center gap-5 p-4 items-center w-auto h-auto rounded">
          <div>
            <p className="text-lg font-bold mb-2">Tema propuesto</p>
            <div
              className={`
              ${temaAprovado ? "bg-green-400" : "bg-red-400"}
                border border-white rounded p-5 
              `}
            >
              <p className="font-bold text-white text-xl text-center">
                {temaAprovado ? "Aprobado" : "En proceso"}
              </p>
            </div>
          </div>
          <div>
            <p className="text-lg font-bold mb-2">Calificacion de tesis</p>
            <div
              className={`
              ${tesisCalificada ? "bg-green-400" : "bg-red-400"}
               border border-white rounded p-5 
              `}
            >
              <p className="font-bold text-white text-xl text-center">
                {tesisCalificada ? "Calificado" : "Sin calificar"}{" "}
                {calificacion > 0 && (
                  <span className="text-white text-lg font-light">
                    {calificacion} /10
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="w-full rounded p-5 flex flex-col items-start justify-center gap-3">
          <h1 className="text-2xl text-red-400 font-bold text-center">Tesis</h1>
          {enEspere && (
            <div className="text-center border border-red-300 p-5 rounded w-full min-w-[500px]">
              <p className="text-lg font-bold">En espera de aprobacion</p>
            </div>
          )}
          {temaAprovado && (
            <div>
              <div>
                <h2 className="text-lg font-bold">Tema de tesis</h2>
                <p className="font-light text-gray-600">
                  {currentStudent.tesis[0].titulo}
                </p>
              </div>
              <div>
                <h2 className="text-lg font-bold">Modo de trabajo</h2>
                <p className="font-light text-gray-600">
                  {currentStudent.tesis[0].grupal ? "Grupal" : "Individual"}
                </p>
              </div>
              {currentStudent.tesis[0].grupal && (
                <div>
                  <h2 className="text-lg font-bold">Compañero</h2>
                  <p className="font-light text-gray-600">
                    {
                      currentStudent.tesis[0].estudiante_companero
                        .nombres_usuario
                    }
                  </p>
                </div>
              )}
              <div>
                <h2 className="text-lg font-bold">Tutor</h2>
                <p className="font-light text-gray-600">
                  {currentStudent.tesis[0].tutor.nombres_usuario}
                </p>
              </div>
              <div>
                <h2 className="text-lg font-bold">Ambito</h2>
                <p className="font-light text-gray-600">
                  {currentStudent.tesis[0].ambito}
                </p>
              </div>
              {calificacion ? (
                <div>
                  <span
                    className={`text-lg font-light italic ${
                      calificacion >= 7 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    Tesis calificada: {calificacion} /10 -{" "}
                    {calificacion >= 7 ? "Aprobado" : "Reprobado"}
                  </span>
                </div>
              ) : (
                <div>
                  <span className="text-lg font-light italic text-red-400">
                    Tema de tesis sin calificar
                  </span>
                </div>
              )}
            </div>
          )}
          {sinTema && (
            <div className="text-center border border-red-300 p-5 rounded w-full min-w-[500px]">
              <p className="text-lg font-bold">
                Aun no tienes un tema de tesis
              </p>
              <button
                type="button"
                className="bg-red-400 text-white px-3 py-1 rounded"
                onClick={handleShowFormPropuesta}
              >
                Proponer tema de tesis
              </button>
            </div>
          )}
          {showFormPropuesta && (
            <div className="min-w-[500px] border-red-300 rounded p-5 ">
              <form onSubmit={handleSubmitPropuesaTema}>
                <div className="mb-3">
                  <label htmlFor="tema">Tema de tesis</label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded focus-within:border-red-400 outline-none"
                    type="text"
                    id="tema"
                    name="tema"
                    placeholder="Tu tema de tesis, propuesta, nucleo del problema"
                    onChange={handleChangePropuesta}
                    value={propuestaForm.tema}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="modo">Modo de trabajo</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded focus-within:border-red-400 outline-none"
                    name="modo"
                    id="modo"
                    onChange={handleChangePropuesta}
                    value={propuestaForm.modo}
                  >
                    <option value="individual">Individual</option>
                    <option value="grupal">Grupal</option>
                  </select>
                </div>

                {isGrupal && (
                  <div className="mb-3">
                    <label htmlFor="estudiante_companero">
                      Seleccionar Compañero
                    </label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded focus-within:border-red-400 outline-none"
                      name="estudiante_companero"
                      id="estudiante_companero"
                      onChange={handleChangePropuesta}
                      value={propuestaForm.estudiante_companero}
                    >
                      {estudiantes.length == 0 ? (
                        <option value="0">No hay estudiantes</option>
                      ) : (
                        estudiantes.map((estudiante) => (
                          <option
                            value={estudiante.id_usuario}
                            key={estudiante.id_usuario}
                          >
                            {estudiante.nombres_usuario}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                )}
                <div className="mb-3">
                  <label htmlFor="ambito">Ambito de la tesis</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded focus-within:border-red-400 outline-none"
                    name="ambito"
                    id="ambito"
                    onChange={handleChangePropuesta}
                    value={propuestaForm.ambito}
                  >
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
                <div className="mb-3">
                  <label htmlFor="docente">Seleccionar docente preferido</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded focus-within:border-red-400 outline-none"
                    name="docente"
                    id="docente"
                    onChange={handleChangePropuesta}
                    value={propuestaForm.docente}
                  >
                    {docentes.length == 0 ? (
                      <option value="0">No hay docentes</option>
                    ) : (
                      docentes.map((docente) => (
                        <option
                          value={docente.id_usuario}
                          key={docente.id_usuario}
                        >
                          {docente.nombres_usuario}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div className="mb-3">
                  <button
                    type="submit"
                    className="bg-red-400 text-white px-3 py-1 rounded"
                  >
                    Enviar propuesta
                  </button>
                </div>
              </form>
            </div>
          )}
          <div className="w-full p-3 flex flex-col items-center justify-center gap-2">
            <h2 className="text-2xl font-bold text-red-400">Temas de tesis</h2>
            <div>
              <div className="flex gap-1 justify-center items-center w-full">
                <label htmlFor="ambitoFilter">filtrar por ambito</label>
                <select
                  name="ambitoFilter"
                  id="ambitoFilter"
                  className={`
                  border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-1 focus:ring-red
                  `}
                  onChange={handleChangeTesisTopic}
                  value={ambitoFilter}
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
            <table className="w-full border border-red-300 max-h-[400px] overflow-y-scroll">
              <thead>
                <tr className="bg-red-400 text-white">
                  <th className="w-1/4">
                    <p className="p-3">Tema</p>
                  </th>
                  <th>
                    <p className="p-3">Descripcion</p>
                  </th>
                  <th>
                    <p className="p-3">Ambito</p>
                  </th>
                  <th className="w-1/8">
                    <p className="p-3">Acciones</p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {originalPropuestasTesis.length == 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center p-3">
                      No hay propuestas
                    </td>
                  </tr>
                ) : (
                  originalPropuestasTesis.map((tesis) => (
                    <tr key={tesis.id_propuesta_tesis}>
                      <td className="p-3 text-center">{tesis.titulo}</td>
                      <td className="p-3 text-center">{tesis.descripcion}</td>
                      <td className="p-3 text-center">{tesis.ambito}</td>
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          className="bg-red-400 text-white px-3 py-1 rounded"
                          onClick={() => {
                            handleViewPropuesta(tesis.id_propuesta_tesis);
                          }}
                        >
                          Ver propuesta 
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default page;
