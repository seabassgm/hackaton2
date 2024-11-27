document.getElementById("startButton").addEventListener("click", async () => {
    const status = document.getElementById("status");
    status.innerText = "Estado: Reproduciendo Kick...";

    // Necesario para iniciar Tone.js
    await Tone.start();
    console.log("Tone.js iniciado");

    // Crear un sintetizador de kick
    const kick = new Tone.MembraneSynth().toDestination();

    // Configurar el loop de kick
    const kickLoop = new Tone.Loop((time) => {
        kick.triggerAttackRelease("C1", "8n", time); // Kick básico
    }, "4n"); // Dispara cada negra

    // Configurar el tempo
    Tone.Transport.bpm.value = 125;

    // Iniciar el loop
    kickLoop.start(0);

    // Iniciar el transporte de Tone.js
    Tone.Transport.start();

    // Cambiar el estado después de 10 segundos (o detener manualmente)
    setTimeout(() => {
        status.innerText = "Estado: Kick detenido.";
        kickLoop.stop(); // Detiene el loop después de 10 segundos
    }, 10000); // Cambia este valor para ajustar la duración
});
