// Función para iniciar la canción
document.getElementById("startButton").addEventListener("click", async () => {
    const status = document.getElementById("status");
    status.innerText = "Estado: Reproduciendo...";

    // Necesario para iniciar Tone.js
    await Tone.start();
    console.log("Tone.js iniciado");

    // Crear un sintetizador
    const synth = new Tone.Synth().toDestination();

    // Secuencia de notas (canción simple)
    const notes = [
        { time: "0:0:0", note: "C4", duration: "8n" },
        { time: "0:0:2", note: "E4", duration: "8n" },
        { time: "0:1:0", note: "G4", duration: "8n" },
        { time: "0:1:2", note: "C5", duration: "8n" },
        { time: "0:2:0", note: "E5", duration: "8n" },
        { time: "0:3:0", note: "G5", duration: "8n" },
    ];

    // Crear un patrón de secuencia
    const part = new Tone.Part((time, value) => {
        synth.triggerAttackRelease(value.note, value.duration, time);
    }, notes);

    // Configurar loop y tempo
    part.loop = false; // Cambia a `true` si quieres que se repita
    part.start(0);

    // Configurar tempo
    Tone.Transport.bpm.value = 120;
    Tone.Transport.start();

    // Detener después de unos segundos
    setTimeout(() => {
        status.innerText = "Estado: Canción terminada.";
    }, 4000); // Ajusta el tiempo según la duración de la canción
});
