document.getElementById("startButton").addEventListener("click", async () => {
    const status = document.getElementById("status");
    status.innerText = "Estado: Reproduciendo patrón...";

    // Necesario para iniciar Tone.js
    await Tone.start();
    console.log("Tone.js iniciado");

    // Crear sintetizadores para el kick, hi-hat y tarola
    const kick = new Tone.MembraneSynth().toDestination();
    const hihat = new Tone.NoiseSynth({
        noise: {
            type: "white",
        },
        envelope: {
            attack: 0.005,
            decay: 0.1,
            sustain: 0.0,
        },
    }).toDestination();
    const snare = new Tone.NoiseSynth({
        noise: {
            type: "white",
        },
        envelope: {
            attack: 0.005,
            decay: 0.2,
            sustain: 0.0,
        },
    }).toDestination();

    // Detener cualquier loop activo previo
    Tone.Transport.stop();
    Tone.Transport.cancel(); // Cancela todos los eventos anteriores

    // Crear un loop donde kick y hi-hat suenen al mismo tiempo
    const beatLoop = new Tone.Loop((time) => {
        // Kick
        kick.triggerAttackRelease("C1", "8n", time);

        // Hi-hat
        hihat.triggerAttackRelease("16n", time);
    }, "4n"); // Se ejecuta en cada negra

    // Crear un loop para la tarola (segundo y cuarto tiempo de cada compás)
    const snarePart = new Tone.Part((time) => {
        snare.triggerAttackRelease("16n", time);
    }, [
        ["0:1:0"], // Segundo tiempo del compás
        ["0:3:0"], // Cuarto tiempo del compás
    ]);

    // Configurar la tarola para que se repita indefinidamente
    snarePart.loop = true; // Activar el loop
    snarePart.loopEnd = "1m"; // Duración del loop: 1 compás (4 tiempos)

    // Configurar loops
    beatLoop.start(0); // Kick y hi-hat suenan al inicio del transporte
    snarePart.start(0); // Tarola suena sincronizada

    // Configurar el transporte
    Tone.Transport.bpm.value = 125;

    // Iniciar el transporte de Tone.js
    Tone.Transport.start();
});
