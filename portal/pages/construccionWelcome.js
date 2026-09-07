/*
|--------------------------------------------------------------------------
| CUBIKA — BIENVENIDA MÓDULO CONSTRUCCIÓN
|--------------------------------------------------------------------------
|
| Wizard de onboarding para nuevos usuarios del módulo Construcción.
|
| Objetivos:
| - Presentar el módulo.
| - Explicar responsabilidades y alcance.
| - Introducir seguridad, usuarios y soporte.
| - Mostrar el servicio contratado.
| - Derivar a la documentación completa.
|
|--------------------------------------------------------------------------
*/

import { navigate } from "../router.js";


let currentStep = 0;


/*
|--------------------------------------------------------------------------
| CONFIGURACIÓN
|--------------------------------------------------------------------------
|
| Estos datos son actualmente demostrativos.
| Posteriormente podrán venir desde Supabase según:
|
| - empresa
| - servicio contratado
| - módulos habilitados
| - cantidad de usuarios
| - vigencia
|
|--------------------------------------------------------------------------
*/

const steps = [
    {
        number: "01",
        label: "Bienvenido"
    },
    {
        number: "02",
        label: "Tu espacio"
    },
    {
        number: "03",
        label: "Tu información"
    },
    {
        number: "04",
        label: "Seguridad"
    },
    {
        number: "05",
        label: "Tu servicio"
    }
];


/*
|--------------------------------------------------------------------------
| ICONOS SVG
|--------------------------------------------------------------------------
*/

const icons = {

    building: `
        <svg viewBox="0 0 24 24"
             aria-hidden="true"
             fill="none"
             stroke="currentColor"
             stroke-width="1.8"
             stroke-linecap="round"
             stroke-linejoin="round">
            <path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/>
            <path d="M16 9h2a2 2 0 0 1 2 2v10"/>
            <path d="M8 7h4"/>
            <path d="M8 11h4"/>
            <path d="M8 15h4"/>
            <path d="M9 21v-3h2v3"/>
        </svg>
    `,

    workers: `
        <svg viewBox="0 0 24 24"
             aria-hidden="true"
             fill="none"
             stroke="currentColor"
             stroke-width="1.8"
             stroke-linecap="round"
             stroke-linejoin="round">
            <circle cx="9" cy="8" r="3"/>
            <path d="M3 21a6 6 0 0 1 12 0"/>
            <path d="M16 4a3 3 0 0 1 0 6"/>
            <path d="M18 14a6 6 0 0 1 3 5"/>
        </svg>
    `,

    construction: `
        <svg viewBox="0 0 24 24"
             aria-hidden="true"
             fill="none"
             stroke="currentColor"
             stroke-width="1.8"
             stroke-linecap="round"
             stroke-linejoin="round">
            <path d="M3 21h18"/>
            <path d="M5 21V9l7-5 7 5v12"/>
            <path d="M9 21v-7h6v7"/>
            <path d="M9 9h6"/>
        </svg>
    `,

    briefcase: `
        <svg viewBox="0 0 24 24"
             aria-hidden="true"
             fill="none"
             stroke="currentColor"
             stroke-width="1.8"
             stroke-linecap="round"
             stroke-linejoin="round">
            <rect x="3" y="7" width="18" height="13" rx="2"/>
            <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            <path d="M3 12h18"/>
            <path d="M10 12v2h4v-2"/>
        </svg>
    `,

    document: `
        <svg viewBox="0 0 24 24"
             aria-hidden="true"
             fill="none"
             stroke="currentColor"
             stroke-width="1.8"
             stroke-linecap="round"
             stroke-linejoin="round">
            <path d="M6 3h9l4 4v14H6z"/>
            <path d="M14 3v5h5"/>
            <path d="M9 13h6"/>
            <path d="M9 17h6"/>
        </svg>
    `,

    settings: `
        <svg viewBox="0 0 24 24"
             aria-hidden="true"
             fill="none"
             stroke="currentColor"
             stroke-width="1.8"
             stroke-linecap="round"
             stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.2h-2.6v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H4.3v-2.6h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V4.3h2.6v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.2V13h-.2a1.7 1.7 0 0 0-1.5 1z"/>
        </svg>
    `,

    shield: `
        <svg viewBox="0 0 24 24"
             aria-hidden="true"
             fill="none"
             stroke="currentColor"
             stroke-width="1.8"
             stroke-linecap="round"
             stroke-linejoin="round">
            <path d="M12 3l7 3v5c0 4.8-2.9 8.3-7 10-4.1-1.7-7-5.2-7-10V6z"/>
            <path d="m9 12 2 2 4-4"/>
        </svg>
    `,

    users: `
        <svg viewBox="0 0 24 24"
             aria-hidden="true"
             fill="none"
             stroke="currentColor"
             stroke-width="1.8"
             stroke-linecap="round"
             stroke-linejoin="round">
            <circle cx="9" cy="8" r="3"/>
            <path d="M3 20a6 6 0 0 1 12 0"/>
            <path d="M16 11a3 3 0 1 0 0-6"/>
            <path d="M16 14a5 5 0 0 1 5 5"/>
        </svg>
    `,

    activity: `
        <svg viewBox="0 0 24 24"
             aria-hidden="true"
             fill="none"
             stroke="currentColor"
             stroke-width="1.8"
             stroke-linecap="round"
             stroke-linejoin="round">
            <path d="M3 12h4l2-6 4 12 2-6h6"/>
        </svg>
    `,

    lightbulb: `
        <svg viewBox="0 0 24 24"
             aria-hidden="true"
             fill="none"
             stroke="currentColor"
             stroke-width="1.8"
             stroke-linecap="round"
             stroke-linejoin="round">
            <path d="M9 18h6"/>
            <path d="M10 21h4"/>
            <path d="M8.5 14.5A6 6 0 1 1 15.5 14"/>
            <path d="M9 14c1 .7 2 .9 3 .9s2-.2 3-.9"/>
        </svg>
    `,

    arrow: `
        <svg viewBox="0 0 24 24"
             aria-hidden="true"
             fill="none"
             stroke="currentColor"
             stroke-width="2"
             stroke-linecap="round"
             stroke-linejoin="round">
            <path d="M5 12h14"/>
            <path d="m13 6 6 6-6 6"/>
        </svg>
    `,

    calendarClock: `
            <svg viewBox="0 0 24 24"
                 aria-hidden="true"
                 fill="none"
                 stroke="currentColor"
                 stroke-width="1.8"
                 stroke-linecap="round"
                 stroke-linejoin="round">
        
                <path d="M7 3v4"/>
                <path d="M17 3v4"/>
                <path d="M4 9h16"/>
        
                <rect x="4" y="5" width="16" height="15" rx="2"/>
        
                <circle cx="16" cy="16" r="3"/>
                <path d="M16 14.5v1.5l1 1"/>
            </svg>
        `,

    check: `
        <svg viewBox="0 0 24 24"
             aria-hidden="true"
             fill="none"
             stroke="currentColor"
             stroke-width="2"
             stroke-linecap="round"
             stroke-linejoin="round">
            <path d="m5 12 4 4L19 6"/>
        </svg>
    `

};


/*
|--------------------------------------------------------------------------
| RENDER PRINCIPAL
|--------------------------------------------------------------------------
*/

export function renderConstructionWelcome() {

    const content =
        document.querySelector(".content");

    if (!content) return;


    currentStep = 0;


    const userName =
        document
            .getElementById("user-name")
            ?.textContent
            ?.trim()
            ?.split(" ")[0] || "usuario";


    content.innerHTML = `

        <section class="construction-welcome">

            <div class="construction-welcome-header">

                <div>

                    <div class="construction-welcome-eyebrow">
                        GUÍA DE INICIO · ÁREA CONSTRUCCIÓN
                    </div>

                    <h1>
                        ¡Bienvenido(a) ${userName}!
                    </h1>

                    <p>
                        Queremos mostrarte algunos
                        aspectos importantes sobre tu espacio de trabajo,
                        tu servicio y el uso de Cubika.
                    </p>

                </div>

            </div>


            <nav
                class="construction-welcome-steps"
                aria-label="Guía de inicio">

                ${steps.map((step, index) => `

                    <button
                        type="button"
                        class="construction-welcome-step ${
                            index === 0 ? "active" : ""
                        }"
                        data-welcome-step="${index}"
                        aria-label="Paso ${step.number}: ${step.label}">

                        <span class="construction-welcome-step-number">
                            ${step.number}
                        </span>

                        <span class="construction-welcome-step-label">
                            ${step.label}
                        </span>

                    </button>

                `).join("")}

            </nav>


            <div
                id="constructionWelcomeContent"
                class="construction-welcome-panel">
            </div>


            <div class="construction-welcome-footer">

                <div
                    id="constructionWelcomeProgress"
                    class="construction-welcome-progress">
                </div>


                <div class="construction-welcome-navigation">

                    <button
                        type="button"
                        id="constructionWelcomeBack"
                        class="construction-welcome-btn secondary">

                        Atrás

                    </button>


                    <button
                        type="button"
                        id="constructionWelcomeNext"
                        class="construction-welcome-btn primary">

                        Continuar
                        ${icons.arrow}

                    </button>

                </div>

            </div>

        </section>

    `;


    bindEvents();

    renderStep();

}


/*
|--------------------------------------------------------------------------
| CONTENIDO DE CADA PASO
|--------------------------------------------------------------------------
*/

function getStepContent(step) {

    switch (step) {


        /*
        ==============================================================
        PASO 01
        ==============================================================
        */

        case 0:

            return `

                <div class="construction-welcome-intro">

                    <div class="construction-welcome-intro-visual">

                        <div class="construction-welcome-cube">

                            <div class="construction-welcome-cube-inner">
                                G
                            </div>

                        </div>

                        <div class="construction-welcome-flow flow-one"></div>
                        <div class="construction-welcome-flow flow-two"></div>
                        <div class="construction-welcome-flow flow-three"></div>

                    </div>


                    <div class="construction-welcome-intro-copy">

                        <span class="construction-welcome-kicker">
                            MODULO Gestor Documental
                        </span>
                            

                        <h2>
                            Una forma más simple de gestionar tu operación.
                        </h2>

                        <p>
                            Cubika es la infraestructura tecnológica que
                            permite centralizar y conectar distintos procesos
                            administrativos de tu operación.
                        </p>

                        <p>
                            En este módulo de Construcción podrás organizar
                            información de empresas, trabajadores, obras,
                            cargos y procesos documentales desde un mismo
                            espacio.
                        </p>


                        <div class="construction-welcome-highlight">

                            ${icons.check}

                            <span>
                                Cubika pone la tecnología.
                                Tú mantienes el control de tu operación.
                            </span>

                        </div>

                    </div>

                </div>

            `;


        /*
        ==============================================================
        PASO 02
        ==============================================================
        */

        case 1:

            return `

                <div class="construction-welcome-section">

                    <div class="construction-welcome-section-heading">

                        <span class="construction-welcome-kicker">
                            TU ESPACIO DE TRABAJO
                        </span>

                        <h2>
                            Todo lo que necesitas, conectado.
                        </h2>

                        <p>
                            El módulo <strong>Gestor Documental</strong> de Construcción, reúne los principales
                            elementos de tu gestión administrativa y los
                            relaciona dentro de una misma estructura.
                        </p>

                    </div>


                    <div class="construction-welcome-module-grid">

                        ${moduleCard(
                            icons.building,
                            "Empresas",
                            "Organiza las empresas que forman parte de tu operación."
                        )}

                        ${moduleCard(
                            icons.workers,
                            "Trabajadores",
                            "Centraliza la información de las personas que gestionas."
                        )}

                        ${moduleCard(
                            icons.construction,
                            "Obras",
                            "Administra los proyectos y lugares asociados a tu operación."
                        )}

                        ${moduleCard(
                            icons.briefcase,
                            "Cargos",
                            "Define los cargos utilizados en tus procesos."
                        )}


                        ${moduleCard(
                            icons.document,
                            "Motor Documental",
                            "Genera contratos y anexos usando plantillas y datos previamente registrados."
                        )}
                        

                        ${moduleCard(
                            icons.calendarClock,
                            "Control de Vigencia",
                            "Seguimiento de contratos según su vigencia y fechas relevantes."
                        )}


                    </div>


                    <div class="construction-welcome-note">

                        ${icons.settings}

                        <span>
                            Los módulos de Cubika están diseñados para compartir información y evitar duplicaciones entre procesos.

                            <br>Por ejemplo, los datos gestionados en este <strong>Gestor Documental</strong> pueden utilizarse posteriormente en <strong>Asistencia y Remuneraciones</strong>.
                            <br><br>Puedes incorporar nuevos módulos según las necesidades de tu operación.
                        </span>

                    </div>

                </div>

            `;


        /*
        ==============================================================
        PASO 03
        ==============================================================
        */

        case 2:

            return `

                <div class="construction-welcome-section">

                    <div class="construction-welcome-section-heading">

                        <span class="construction-welcome-kicker">
                            INFORMACIÓN Y RESPONSABILIDAD
                        </span>

                        <h2>
                            Tu información. Tu control.
                        </h2>

                        <p>
                            La información que ingresas y gestionas en la plataforma
                            corresponde a tu organización. Cubika proporciona
                            la infraestructura tecnológica necesaria para
                            procesarla y prestarte el servicio contratado.
                        </p>

                    </div>


                    <div class="construction-welcome-two-columns">

                        <div class="construction-welcome-info-card">

                            <div class="construction-welcome-card-icon">
                                ${icons.users}
                            </div>

                            <h3>
                                Tú decides
                            </h3>

                            <ul>

                                <li>
                                    Qué información ingresas.
                                </li>

                                <li>
                                    Qué usuarios tienen acceso.
                                </li>

                                <li>
                                    Qué datos y parámetros utilizas.
                                </li>

                                <li>
                                    Qué documentos generas.
                                </li>

                                <li>
                                    Qué decisiones tomas a partir de esa información.
                                </li>

                            </ul>

                        </div>


                        <div class="construction-welcome-info-card">

                            <div class="construction-welcome-card-icon">
                                ${icons.settings}
                            </div>

                            <h3>
                                Cubika proporciona
                            </h3>

                            <ul>

                                <li>
                                    La plataforma.
                                </li>

                                <li>
                                    Las herramientas de gestión.
                                </li>

                                <li>
                                    Las alertas y seguimiento.
                                </li>

                                <li>
                                    La automatización disponible.
                                </li>

                                <li>
                                    La trazabilidad propia del sistema.
                                </li>

                            </ul>

                        </div>

                    </div>


                    <div class="construction-welcome-responsibility">

                        <div class="construction-welcome-responsibility-icon">
                            ${icons.document}
                        </div>

                        <div>

                            <h3>
                                Los documentos generados requieren tu revisión.
                            </h3>

                            <p>
                                Cubika proporciona la infraestructura tecnológica
                                para generar documentos a partir de las plantillas,
                                datos y configuraciones que tu mismo gestionas en la plataforma.
                            </p>

                            <p>
                                La generación automática de un documento
                                <strong>
                                    no constituye una certificación de su validez,
                                    suficiencia o adecuación legal por parte de Cubika.
                                </strong>
                            </p>

                            <p>
                                Antes de utilizar, firmar, presentar o entregar
                                un documento, corresponde a tu organización
                                revisar su contenido y determinar si es adecuado
                                para el propósito correspondiente.
                            </p>

                        </div>

                    </div>


                    <div class="construction-welcome-disclaimer">

                        <strong>
                            Importante
                        </strong>

                        <span>
                            Cubika es una herramienta tecnológica y no reemplaza
                            la asesoría jurídica, laboral, contable o profesional
                            que pueda requerir tu organización.
                        </span>

                    </div>

                </div>

            `;


        /*
        ==============================================================
        PASO 04
        ==============================================================
        */

        case 3:

            return `

                <div class="construction-welcome-section">

                    <div class="construction-welcome-section-heading">

                        <span class="construction-welcome-kicker">
                            SEGURIDAD Y SOPORTE
                        </span>

                        <h2>
                            Trabaja seguro. Trabaja con trazabilidad.
                        </h2>

                        <p>
                            El uso correcto de Cubika comienza con una buena
                            gestión de usuarios, accesos y responsabilidades.
                        </p>

                    </div>


                    <div class="construction-welcome-security-grid">

                        ${securityCard(
                            icons.users,
                            "Usuarios y permisos",
                            "Cada persona debe utilizar su propia cuenta. Los permisos y funcionalidades dependen del rol asignado."
                        )}

                        ${securityCard(
                            icons.shield,
                            "Protege tus accesos",
                            "Nunca compartas tus credenciales. Si otra persona necesita acceso, crea una cuenta para ella."
                        )}

                        ${securityCard(
                            icons.activity,
                            "Trazabilidad",
                            "Las acciones relevantes pueden quedar asociadas al usuario que las ejecutó, permitiendo mantener un historial de actividad."
                        )}

                        ${securityCard(
                            icons.lightbulb,
                            "Tu feedback importa",
                            "Puedes reportar errores, sugerir mejoras o plantear nuevas necesidades relacionadas con tu operación."
                        )}

                    </div>


                    <div class="construction-welcome-support">

                        <div>

                            <span class="construction-welcome-kicker">
                                SOPORTE
                            </span>

                            <h3>
                                ¿Necesitas ayuda?
                            </h3>

                            <p>
                                Estamos aquí para ayudarte a utilizar
                                correctamente las herramientas que forman
                                parte de tu servicio.
                            </p>

                        </div>


                        <div class="construction-welcome-support-types">

                            <span>Error</span>
                            <span>Ayuda</span>
                            <span>Mejora</span>
                            <span>Nueva funcionalidad</span>

                        </div>

                    </div>

                </div>

            `;


        /*
        ==============================================================
        PASO 05
        ==============================================================
        */

        case 4:

            return `

                <div class="construction-welcome-section">

                    <div class="construction-welcome-section-heading">

                        <span class="construction-welcome-kicker">
                            TU SERVICIO
                        </span>

                        <h2>
                            Esto es lo que tienes disponible.
                        </h2>

                        <p>
                            Tu servicio Cubika está configurado de acuerdo
                            con el alcance contratado.
                        </p>

                    </div>


                    <div class="construction-welcome-service-card">

                        <div class="construction-welcome-service-header">

                            <div>

                                <span class="construction-welcome-service-label">
                                    MÓDULO CONTRATADO - CONSTRUCCIÓN
                                </span>

                                <h3>
                                 GESTOR DOCUMENTAL
                                 </h3>
                                

                            </div>


                            <div class="construction-welcome-service-badge">
                                ACTIVO
                            </div>

                        </div>


                        <div class="construction-welcome-service-meta">

                            <div>

                                <span>
                                    Inicio
                                </span>

                                <strong>
                                    Según contrato
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Vigencia
                                </span>

                                <strong>
                                    Según contrato
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Usuarios
                                </span>

                                <strong>
                                    1
                                </strong>

                            </div>

                        </div>


                        <div class="construction-welcome-service-divider"></div>


                        <div>

                            <span class="construction-welcome-service-label">
                                FUNCIONALIDADES DISPONIBLES
                            </span>


                            <div class="construction-welcome-service-features">

                                ${serviceFeature("Empresas")}
                                ${serviceFeature("Trabajadores")}
                                ${serviceFeature("Obras")}
                                ${serviceFeature("Cargos")}
                                ${serviceFeature("Contratos")}
                                ${serviceFeature("Motor Documental")}

                            </div>

                        </div>

                    </div>


                    <div class="construction-welcome-evolution">

                        <div class="construction-welcome-card-icon">
                            ${icons.lightbulb}
                        </div>

                        <div>

                            <h3>
                                Cubika seguirá evolucionando.
                            </h3>

                            <p>
                                Tu experiencia puede ayudarnos a mejorar
                                el producto. Puedes compartir sugerencias,
                                reportar problemas o plantear nuevas necesidades.
                            </p>

                            <p>
                                El feedback de nuestros clientes puede influir
                                en la evolución de Cubika, pero las funcionalidades,
                                mejoras, desarrollos, infraestructura y conocimiento
                                que forman parte de la plataforma permanecen bajo
                                propiedad de Cubika.
                            </p>

                        </div>

                    </div>


                    <div class="construction-welcome-documents">

                        <div>

                            <span class="construction-welcome-kicker">
                                DOCUMENTACIÓN
                            </span>

                            <h3>
                                Toda la información importante, siempre disponible.
                            </h3>

                            <p>
                                Esta guía es un resumen para comenzar.
                                La documentación contractual, legal y técnica
                                aplicable a tu servicio estará disponible
                                permanentemente desde el menú lateral.
                            </p>

                        </div>


                        <button
                            type="button"
                            id="constructionWelcomeDocuments"
                            class="construction-welcome-link-btn">

                            Ver documentación

                            ${icons.arrow}

                        </button>

                    </div>


                    <div class="construction-welcome-complete">

                        <div class="construction-welcome-complete-icon">
                            ${icons.check}
                        </div>

                        <div>

                            <h3>
                                Ya estás listo para comenzar.
                            </h3>

                            <p>
                                Has revisado los aspectos principales de tu
                                servicio Cubika. La documentación completa
                                seguirá disponible desde tu panel.
                            </p>

                        </div>

                    </div>

                </div>

            `;


        default:
            return "";

    }

}


/*
|--------------------------------------------------------------------------
| TARJETA DE MÓDULO
|--------------------------------------------------------------------------
*/

function moduleCard(icon, title, description) {

    return `

        <div class="construction-welcome-module-card">

            <div class="construction-welcome-card-icon">
                ${icon}
            </div>

            <div>

                <h3>
                    ${title}
                </h3>

                <p>
                    ${description}
                </p>

            </div>

        </div>

    `;

}


/*
|--------------------------------------------------------------------------
| TARJETA DE SEGURIDAD
|--------------------------------------------------------------------------
*/

function securityCard(icon, title, description) {

    return `

        <div class="construction-welcome-security-card">

            <div class="construction-welcome-card-icon">
                ${icon}
            </div>

            <h3>
                ${title}
            </h3>

            <p>
                ${description}
            </p>

        </div>

    `;

}


/*
|--------------------------------------------------------------------------
| FUNCIONALIDAD CONTRATADA
|--------------------------------------------------------------------------
*/

function serviceFeature(label) {

    return `

        <span class="construction-welcome-feature">

            ${icons.check}

            ${label}

        </span>

    `;

}


/*
|--------------------------------------------------------------------------
| EVENTOS
|--------------------------------------------------------------------------
*/

function bindEvents() {

    document
        .querySelectorAll("[data-welcome-step]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const step =
                        Number(
                            button.dataset.welcomeStep
                        );


                    if (
                        Number.isInteger(step) &&
                        step >= 0 &&
                        step < steps.length
                    ) {

                        currentStep = step;

                        renderStep();

                    }

                }
            );

        });


    document
        .getElementById("constructionWelcomeBack")
        ?.addEventListener(
            "click",
            () => {

                if (currentStep > 0) {

                    currentStep--;

                    renderStep();

                }

            }
        );


    document
        .getElementById("constructionWelcomeNext")
        ?.addEventListener(
            "click",
            () => {

                if (currentStep < steps.length - 1) {

                    currentStep++;

                    renderStep();

                    return;

                }


                /*
                ------------------------------------------------------
                FINALIZAR
                ------------------------------------------------------

                Por ahora dirigimos al primer módulo operativo.
                Posteriormente aquí podremos:

                1. Registrar onboarding completado.
                2. Guardar versión de la guía aceptada.
                3. Registrar fecha/hora.
                4. Dirigir al dashboard de Construcción.
                ------------------------------------------------------
                */

                navigate("construction_contratos");

            }
        );

}


/*
|--------------------------------------------------------------------------
| RENDER DEL PASO ACTUAL
|--------------------------------------------------------------------------
*/

function renderStep() {

    const container =
        document.getElementById(
            "constructionWelcomeContent"
        );


    if (!container) return;


    container.innerHTML =
        getStepContent(currentStep);


    /*
    ------------------------------------------------------
    ESTADO DE LOS PASOS
    ------------------------------------------------------
    */

    document
        .querySelectorAll("[data-welcome-step]")
        .forEach((button, index) => {

            button.classList.toggle(
                "active",
                index === currentStep
            );


            button.classList.toggle(
                "completed",
                index < currentStep
            );

        });


    /*
    ------------------------------------------------------
    PROGRESO
    ------------------------------------------------------
    */

    const progress =
        document.getElementById(
            "constructionWelcomeProgress"
        );


    if (progress) {

        progress.innerHTML = `

            <span>
                ${String(currentStep + 1).padStart(2, "0")}
                /
                ${String(steps.length).padStart(2, "0")}
            </span>

            <strong>
                ${steps[currentStep].label}
            </strong>

        `;

    }


    /*
    ------------------------------------------------------
    BOTÓN ATRÁS
    ------------------------------------------------------
    */

    const backBtn =
        document.getElementById(
            "constructionWelcomeBack"
        );


    if (backBtn) {

        backBtn.disabled =
            currentStep === 0;

    }


    /*
    ------------------------------------------------------
    BOTÓN SIGUIENTE
    ------------------------------------------------------
    */

    const nextBtn =
        document.getElementById(
            "constructionWelcomeNext"
        );


    if (nextBtn) {

        if (currentStep === steps.length - 1) {

            nextBtn.innerHTML = `
                Comenzar a trabajar
                ${icons.arrow}
            `;

        } else {

            nextBtn.innerHTML = `
                Continuar
                ${icons.arrow}
            `;

        }

    }


    /*
    ------------------------------------------------------
    DOCUMENTACIÓN
    ------------------------------------------------------
    */

    document
        .getElementById(
            "constructionWelcomeDocuments"
        )
        ?.addEventListener(
            "click",
            () => {

                /*
                 * Punto preparado para futura integración.
                 *
                 * Cuando exista la página correspondiente:
                 *
                 * navigate("documentacion");
                 */

                console.info(
                    "Documentación: página pendiente de implementación."
                );

            }
        );

}
