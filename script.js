document.getElementById("startButton").addEventListener("click", async () => {
    const status = document.getElementById("status");
    status.innerText = "Estado: Reproduciendo Kick...";

    // Necesario para iniciar Tone.js
    await Tone.start();
    console.log("Tone.js iniciado");

    // Crear un sintetizador de kick
    const kick = new Tone.MembraneSynth().toDestination();

    // Detener cualquier loop activo previo
    Tone.Transport.stop();
    Tone.Transport.cancel(); // Cancela todos los eventos anteriores

    // Configurar el loop de kick
    const kickLoop = new Tone.Loop((time) => {
        kick.triggerAttackRelease("C1", "8n", time); // Kick básico
    }, "4n"); // Dispara cada negra

    // Configurar el tempo
    Tone.Transport.bpm.value = 125;

    // Iniciar el loop
    kickLoop.start(0);

    // Iniciar el
