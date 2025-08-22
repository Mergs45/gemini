document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA COMÚN PARA TODAS LAS PÁGINAS (MENÚ MÓVIL) ---
    const menuBtn = document.getElementById('menu-btn');
    const menuMovil = document.getElementById('menu-movil');
    if (menuBtn && menuMovil) {
        menuBtn.addEventListener('click', () => {
            menuMovil.classList.toggle('hidden');
        });
    }

    // --- LÓGICA PARA LA PÁGINA DE INICIO (INDEX.HTML) ---
    const boton = document.getElementById('miBoton');
    const parrafo = document.getElementById('miParrafo');
    const botonChuleta = document.getElementById('miBotonChuleta');
    const contenedorChuleta = document.getElementById('contenedorChuleta');
    const botonFormulario = document.getElementById('miBotonFormulario');
    const formChuleta = document.getElementById('form-chuleta');
    const comandoInput = document.getElementById('comando-input');
    const descripcionInput = document.getElementById('descripcion-input');

    if (parrafo) { // Si existe el párrafo, asumimos que estamos en index.html
        
        let comandosGuardados = []; 
        let chuletaCargadaPorPrimeraVez = false;

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

        contenedorChuleta.addEventListener('click', function(evento) {
            if (evento.target.classList.contains('borrar-btn')) {
                const idParaBorrar = evento.target.getAttribute('data-id');
                const idNumerico = parseInt(idParaBorrar, 10);
                comandosGuardados = comandosGuardados.filter((item, i) => i !== idNumerico);
                renderizarChuleta();
            }
        });

        boton.addEventListener('click', function() {
            parrafo.textContent = 'Definitivamente, ¡es un clic!';
        });

        botonChuleta.addEventListener('click', async function() {
            const estaOculta = contenedorChuleta.classList.contains('hidden');
            if (estaOculta) {
                if (!chuletaCargadaPorPrimeraVez) {
                    parrafo.textContent = 'Cargando comandos por primera vez...';
                    const respuesta = await fetch('chuleta.html');
                    const textoHtml = await respuesta.text();
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(textoHtml, "text/html");
                    doc.querySelectorAll('h2').forEach(titulo => {
                        const categoria = titulo.textContent;
                        let siguienteElemento = titulo.nextElementSibling;
                        if (siguienteElemento && siguienteElemento.tagName === 'UL') {
                            siguienteElemento.querySelectorAll('li').forEach(li => {
                                const comando = li.querySelector('code').textContent;
                                const descripcion = li.textContent.split(': ')[1] || '';
                                comandosGuardados.push({ categoria, comando, descripcion });
                            });
                        }
                    });
                    chuletaCargadaPorPrimeraVez = true;
                }
                renderizarChuleta();
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
            comandosGuardados.push({
                categoria: 'Mis Comandos Personalizados',
                comando: nuevoComando,
                descripcion: nuevaDescripcion
            });
            renderizarChuleta();
            contenedorChuleta.classList.remove('hidden');
            botonChuleta.textContent = 'Ocultar comandos de tailwind';
            formChuleta.classList.add('hidden');
            botonFormulario.textContent = 'Agregar tu comando';
            comandoInput.value = '';
            descripcionInput.value = '';
            comandoInput.focus();
        });
    }

    // --- LÓGICA PARA LA GALERÍA (GALLERY.HTML) ---
    const modal = document.getElementById('modal');
    const galleryGrid = document.getElementById('gallery-grid');

    if (modal && galleryGrid) { // Si existe el modal, asumimos que estamos en gallery.html
        const modalImg = document.getElementById('modal-img');
        const modalTitle = document.getElementById('modal-title');
        const modalDescription = document.getElementById('modal-description');
        const modalCloseBtn = document.getElementById('modal-close-btn');

        function openModal(imgSrc, title, description) {
            modalImg.src = imgSrc;
            modalTitle.textContent = title;
            modalDescription.textContent = description;
            modal.classList.remove('opacity-0', 'pointer-events-none');
            modal.querySelector('.modal-content').classList.remove('scale-95');
        }

        function closeModal() {
            modal.classList.add('opacity-0');
            modal.querySelector('.modal-content').classList.add('scale-95');
            // 'pointer-events-none' se añade después de la transición para que se pueda cerrar haciendo clic fuera
            setTimeout(() => {
                modal.classList.add('pointer-events-none');
            }, 300); // 300ms es la duración de la transición
        }
        
        // Abrir modal usando delegación de eventos
        galleryGrid.addEventListener('click', function(event){
            const galleryItem = event.target.closest('.group');
            if (galleryItem) {
                const imgSrc = galleryItem.dataset.imgSrc;
                const title = galleryItem.dataset.title;
                const description = galleryItem.dataset.description;
                openModal(imgSrc, title, description);
            }
        });

        // Cerrar modal con el botón
        modalCloseBtn.addEventListener('click', closeModal);

        // Cerrar modal al hacer clic fuera del contenido
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModal();
            }
        });
    }
});