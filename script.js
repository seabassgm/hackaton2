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
        hihat.triggerAttackRelease("8n", time);
    }, "4n"); // Se ejecuta en cada negra

    // Crear un loop para la tarola (suena cada dos kicks)
    const snareLoop = new Tone.Loop((time) => {
        snare.triggerAttackRelease("8n", time);
    }, "4n"); // Se ejecuta cada dos negras

    // Configurar el transporte
    Tone.Transport.bpm.value = 125;

    // Controlar el patrón (2 compases sonido + 1 compás pausa)
    let measure = 0;
    Tone.Transport.scheduleRepeat((time) => {
        if (measure < 2) {
            beatLoop.start(time); // Suenan kick y hi-hat
            snareLoop.start(time); // Suena la tarola
        } else {
            beatLoop.stop(time); // Pausa
            snareLoop.stop(time); // Pausa
        }
        measure = (measure + 1) % 3; // Reinicia el ciclo después de 3 compases
    }, "1m"); // Cambia cada compás (1 medida)

    // Iniciar el transporte de Tone.js
    Tone.Transport.start();
});
