// --- VARIABLES GLOBALES ---
const boton = document.getElementById('miBoton');
const parrafo = document.getElementById('miParrafo');
const botonChuleta = document.getElementById('miBotonChuleta');
const contenedorChuleta = document.getElementById('contenedorChuleta');
const botonFormulario = document.getElementById('miBotonFormulario');
const formChuleta = document.getElementById('form-chuleta');
const comandoInput = document.getElementById('comando-input');
const descripcionInput = document.getElementById('descripcion-input');
const menuBtn = document.getElementById('menu-btn');
const menuMovil = document.getElementById('menu-movil');

// --- NUESTRA "MEMORIA" / LISTA MAESTRA ---
let comandosGuardados = []; // Aquí guardaremos todos los comandos.
let chuletaCargadaPorPrimeraVez = false;

// --- FUNCIÓN PARA "DIBUJAR" LA CHULETA ---
// Esta función lee la lista "comandosGuardados" y genera el HTML
// --- FUNCIÓN PARA "DIBUJAR" LA CHULETA ---
function renderizarChuleta() {
    let htmlGenerado = '';
    
    const categorias = {};
    comandosGuardados.forEach((item, i) => {
        if (!categorias[item.categoria]) {
            categorias[item.categoria] = [];
        }
        categorias[item.categoria].push({ ...item, id: i });
    });

    for (const categoria in categorias) {
        htmlGenerado += `<h2 class="font-semibold text-2xl pt-4 pb-2">${categoria}</h2>`;
        htmlGenerado += `<ul class="mt-2 space-y-2">`;
        categorias[categoria].forEach(item => {
            htmlGenerado += `
                <li class="flex items-center justify-between">
                    <div>
                        <code class="code-pill">${item.comando}</code>: ${item.descripcion}
                    </div>
                    <button data-id="${item.id}" class="borrar-btn text-red-500 hover:text-red-700 font-bold p-1">
                        X
                    </button>
                </li>
            `;
        });
        htmlGenerado += `</ul>`;
    }
    
    contenedorChuleta.innerHTML = htmlGenerado;
}
// --- EVENT LISTENER PARA BORRAR COMANDOS ---
contenedorChuleta.addEventListener('click', function(evento) {
    if (evento.target.classList.contains('borrar-btn')) {
        const idParaBorrar = evento.target.getAttribute('data-id');
        const idNumerico = parseInt(idParaBorrar, 10);
        
        comandosGuardados = comandosGuardados.filter((item, i) => i !== idNumerico);
        
        renderizarChuleta();
    }
});


// --- EVENT LISTENERS ---

boton.addEventListener('click', function() {
    parrafo.textContent = 'Definitivamente, ¡es un clic!';
});

botonChuleta.addEventListener('click', async function() {
    const estaOculta = contenedorChuleta.classList.contains('hidden');

    if (estaOculta) {
        // Si es la primera vez que hacemos clic, cargamos los datos del archivo
        if (!chuletaCargadaPorPrimeraVez) {
            parrafo.textContent = 'Cargando comandos por primera vez...';
            const respuesta = await fetch('chuleta.html');
            const textoHtml = await respuesta.text();
            
            // Usamos el parser para leer el HTML y extraer los datos
            const parser = new DOMParser();
            const doc = parser.parseFromString(textoHtml, "text/html");
            
            doc.querySelectorAll('h2').forEach(titulo => {
                const categoria = titulo.textContent;
                let siguienteElemento = titulo.nextElementSibling;
                if (siguienteElemento && siguienteElemento.tagName === 'UL') {
                    siguienteElemento.querySelectorAll('li').forEach(li => {
                        const comando = li.querySelector('code').textContent;
                        const descripcion = li.textContent.split(': ')[1] || '';
                        // Añadimos el comando a nuestra lista maestra
                        comandosGuardados.push({ categoria, comando, descripcion });
                    });
                }
            });
            chuletaCargadaPorPrimeraVez = true; // Marcamos que ya hemos cargado los datos
        }
        
        // Ahora, siempre renderizamos desde nuestra lista en memoria
        renderizarChuleta();

        // Actualizamos la interfaz
        parrafo.textContent = '¡Mostrando comandos de tailwind!';
        botonChuleta.textContent = 'Ocultar comandos de tailwind';
        contenedorChuleta.classList.remove('hidden');
        botonFormulario.textContent = 'Agregar tu comando';
        formChuleta.classList.add('hidden');

    } else {
        parrafo.textContent = '¡Bienvenido, estás conectado!';
        botonChuleta.textContent = 'Comandos de tailwind';
        contenedorChuleta.classList.add('hidden');
    }
});

botonFormulario.addEventListener('click', function() {
    // Esta lógica sigue igual y funciona perfecto
    const estaOculta = formChuleta.classList.contains('hidden');
    if (estaOculta) {
        botonFormulario.textContent = 'Ocultar formulario';
        parrafo.textContent = '¡Mostrando formulario, agrega tu comando!';
        formChuleta.classList.remove('hidden');
        botonChuleta.textContent = 'Comandos de tailwind';
        contenedorChuleta.classList.add('hidden');
    } else {
        botonFormulario.textContent = 'Agregar tu comando';
        parrafo.textContent = '¡Bienvenido, estás conectado!';
        formChuleta.classList.add('hidden');
    }
});

formChuleta.addEventListener('submit', function(evento) {
    evento.preventDefault();
    const nuevoComando = comandoInput.value;
    const nuevaDescripcion = descripcionInput.value;

    if (!nuevoComando || !nuevaDescripcion) {
        alert('Por favor, completa ambos campos.');
        return;
    }

    // AÑADIMOS EL NUEVO COMANDO A NUESTRA LISTA MAESTRA
    comandosGuardados.push({
        categoria: 'Mis Comandos Personalizados',
        comando: nuevoComando,
        descripcion: nuevaDescripcion
    });

    // VOLVEMOS A DIBUJAR TODO con el nuevo comando incluido
    renderizarChuleta();

    // Actualizamos la interfaz para mostrar la chuleta y ocultar el form
    contenedorChuleta.classList.remove('hidden');
    botonChuleta.textContent = 'Ocultar comandos de tailwind';
    formChuleta.classList.add('hidden');
    botonFormulario.textContent = 'Agregar tu comando';
    
    // Limpiamos los campos
    comandoInput.value = '';
    descripcionInput.value = '';
    comandoInput.focus();
});

menuBtn.addEventListener('click', () => {
    menuMovil.classList.toggle('hidden');
});