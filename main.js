document.getElementById('prompt').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Evita el salto de línea en el textarea
        document.getElementById('generarBtn').click(); // Simula un clic en el botón
    }
});

function generarTexto() {
    const btn = document.getElementById('generarBtn');
    const respuestaDiv = document.getElementById('respuesta');
    const prompt = document.getElementById('prompt').value;
    const model = document.getElementById('modelSelector').value; // Obtiene el modelo seleccionado
    const controller = new AbortController(); //crea una instancia de abortcontroller
    const timeoutId = setTimeout(() => controller.abort(), 120000); //cancela la petición después de 120 segundos

     // Mostrar animación de carga
     btn.classList.add('loading');
     respuestaDiv.textContent = 'Cargando...';

    fetch('https://be45-45-171-182-157.ngrok-free.app/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt: prompt,
            model: model
        }),     
        signal: controller.signal, // Agrega el signal del AbortController
    })
        .then((response) => response.json())
        .then((data) => {
            clearTimeout(timeoutId); // Limpia el timeout si la solicitud se completa a tiempo
            document.getElementById('respuesta').textContent = data.response;
            // Formatear la respuesta en el frontend.
            const formattedResponse = data.response.replace(/\n/g, '<br>').replace(/ /g,'&nbsp;');
            respuestaDiv.innerHTML = formattedResponse;
             // Ocultar animación de carga
             btn.classList.remove('loading');
        })
        .catch((error) => {
            clearTimeout(timeoutId); // Limpia el timeout en caso de error
            if (error.name === 'AbortError') {
                document.getElementById('respuesta').textContent = 'La solicitud tardó demasiado en responder.';
            } else {
                console.error('Error:', error);
                document.getElementById('respuesta').textContent = 'Ocurrió un error al procesar la solicitud.';
            }
        });
}