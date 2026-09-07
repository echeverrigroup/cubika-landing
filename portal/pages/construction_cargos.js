import { cargosService }
from "../services/cargosService.js";

import {
    showConfirmModal,
    showFormModal,
    setModalError,
    setModalLoading
}
from "../components/modal.js";


// ============================================================
// RENDER DE LA PESTAÑA CARGOS
// ============================================================

export async function renderCargosTab(container) {

    if (!container)
        return;


    container.innerHTML = `

        <div class="page-header">

            <h2>Cargos</h2>

            <button id="btnNuevoCargo">

                + Nuevo Cargo

            </button>

        </div>


        <div class="table-filters">

            <input
                id="buscarCargo"
                class="cubika-input"
                type="text"
                placeholder="Buscar cargo...">

        </div>


        <div id="cargosTable">

            Cargando...

        </div>

    `;


    await cargarCargos(container);


    const btnNuevo =
        container.querySelector("#btnNuevoCargo");


    if (btnNuevo) {

       btnNuevo.addEventListener(
            "click",
            () => mostrarFormularioNuevoCargo(container)
        );

    }


    const buscar =
        container.querySelector("#buscarCargo");


    if (buscar) {

        buscar.addEventListener(
            "keyup",
            () => cargarCargos(container)
        );

    }

}


// ============================================================
// CARGAR CARGOS
// ============================================================

async function cargarCargos(container) {

    const table =
        container.querySelector("#cargosTable");


    if (!table)
        return;


    const filtro =
        container
            .querySelector("#buscarCargo")
            ?.value
            .trim()
            .toUpperCase();


    let cargos =
        await cargosService.getAll();


    if (filtro) {

        cargos =
            cargos.filter(cargo =>

                `${cargo.nombre}
                 ${cargo.descripcion ?? ""}`

                    .toUpperCase()

                    .includes(filtro)

            );

    }


    let html = `

        <table class="cubika-table">

            <thead>

                <tr>

                    <th>Nombre</th>

                    <th>Descripción</th>

                    <th>Estado</th>

                    <th>Acciones</th>

                </tr>

            </thead>

            <tbody>

    `;


    if (!cargos.length) {

        html += `

            <tr>

                <td
                    colspan="4"
                    style="text-align:center;padding:30px;">

                    No existen cargos registrados.

                </td>

            </tr>

        `;

    }


    cargos.forEach(cargo => {

        html += `

            <tr>

                <td>

                    ${cargo.nombre}

                </td>

                <td>

                    ${cargo.descripcion ?? ""}

                </td>

                <td>

                    <span class="
                        estado-badge
                        ${cargo.estado === "Activo"
                            ? "activo"
                            : "inactivo"}">

                        ${cargo.estado}

                    </span>

                </td>

                <td>

                    <button
                        class="btn-edit"
                        data-id="${cargo.id}">

                        Editar

                    </button>

                    <button
                        class="${cargo.estado === "Activo"
                            ? "btn-danger"
                            : "btn-primary"} btn-toggle-estado"
                        data-id="${cargo.id}">

                        ${cargo.estado === "Activo"
                            ? "Desactivar"
                            : "Activar"}

                    </button>

                </td>

            </tr>

        `;

    });


    html += `

            </tbody>

        </table>

    `;


    table.innerHTML =
        html;


    container
        .querySelectorAll(".btn-edit")
        .forEach(btn => {

            btn.addEventListener(
                "click",
                () => editarCargo(
                    btn.dataset.id,
                    container
                )
            );

        });


    container
        .querySelectorAll(".btn-toggle-estado")
        .forEach(btn => {

            btn.addEventListener(
                "click",
                () => cambiarEstadoCargo(
                    btn.dataset.id,
                    container
                )
            );

        });

}


// ============================================================
// NUEVO CARGO
// ============================================================

async function mostrarFormularioNuevoCargo(container) {

    showFormModal({

        title: "Nuevo Cargo",

        content:
            await obtenerFormularioCargo(),

        submitText: "Guardar",

        onSubmit: () =>
            crearCargo(container)

    });

}


// ============================================================
// EDITAR CARGO
// ============================================================

async function editarCargo(id, container) {

    const cargo =
        await cargosService.getById(id);


    if (!cargo)
        return;


    showFormModal({

        title: "Editar Cargo",

        content:
            await obtenerFormularioCargo(cargo),

        submitText: "Actualizar",

        onSubmit: () =>
            actualizarCargo(id, container)

    });

}


// ============================================================
// FORMULARIO
// ============================================================

async function obtenerFormularioCargo(cargo = null) {

    return `

        <form id="formCargo">

            <div class="form-grid">

                <div class="form-group">

                    <label>Nombre</label>

                    <input
                        id="nombre"
                        class="cubika-input"
                        type="text"
                        value="${cargo?.nombre ?? ""}"
                        required>

                </div>


                <div class="form-group">

                    <label>Descripción</label>

                    <input
                        id="descripcion"
                        class="cubika-input"
                        value="${cargo?.descripcion ?? ""}"
                        
                    >

                </div>

            </div>


            <div
                id="modalFormError"
                class="form-error"
                style="display:none;">
            </div>

        </form>

    `;

}


// ============================================================
// CREAR CARGO
// ============================================================

async function crearCargo(container) {

    setModalError("");


    const nombre =
        document
            .getElementById("nombre")
            .value
            .trim();


    const descripcion =
        document
            .getElementById("descripcion")
            .value
            .trim();


    if (!nombre) {

        setModalError(
            "Debe ingresar el nombre del cargo."
        );

        return false;

    }


    try {

        setModalLoading(true);


        await cargosService.create({

            nombre,

            descripcion,

            estado: "Activo"

        });


        if (container)
            await cargarCargos(container);


        setModalLoading(false);

        return true;

    }

    catch (error) {

        console.error(error);


        setModalLoading(false);


        setModalError(
            "No fue posible guardar el cargo."
        );


        return false;

    }

}


// ============================================================
// ACTUALIZAR CARGO
// ============================================================

async function actualizarCargo(id, container) {

    setModalError("");


    const nombre =
        document
            .getElementById("nombre")
            .value
            .trim();


    const descripcion =
        document
            .getElementById("descripcion")
            .value
            .trim();


    if (!nombre) {

        setModalError(
            "Debe ingresar el nombre del cargo."
        );

        return false;

    }


    try {

        setModalLoading(true);


        await cargosService.update(id, {

            nombre,

            descripcion,

            updated_at:
                new Date().toISOString()

        });


        if (container)
            await cargarCargos(container);


        setModalLoading(false);

        return true;

    }

    catch (error) {

        console.error(error);


        setModalLoading(false);


        setModalError(
            "No fue posible actualizar el cargo."
        );


        return false;

    }

}


// ============================================================
// CAMBIAR ESTADO
// ============================================================

async function cambiarEstadoCargo(id, container) {

    const cargo =
        await cargosService.getById(id);


    if (!cargo)
        return;


    const nuevoEstado =
        cargo.estado === "Activo"
            ? "Inactivo"
            : "Activo";


    showConfirmModal(

        `${nuevoEstado} Cargo`,

        `¿Desea ${nuevoEstado.toLowerCase()} este cargo?`,

        async () => {

            try {

                await cargosService.update(id, {

                    estado: nuevoEstado,

                    updated_at:
                        new Date().toISOString()

                });


                if (container)
                    await cargarCargos(container);

            }

            catch (error) {

                console.error(error);

            }

        }

    );

}
