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
        ["0:0:1"], // primera subdidvision del compás 1
        ["3:0:0"], // Segunda subdivision del compás 1
        //["1:1:0"], // Segundo tiempo del compás 2
        //["1:3:0"], // Cuarto tiempo del compás 2
    ]);

    // Configurar el transporte
    Tone.Transport.bpm.value = 125;

    // Controlar el patrón (2 compases sonido + 1 compás pausa)
    let measure = 0;
    Tone.Transport.scheduleRepeat((time) => {
        if (measure < 8) {
            beatLoop.start(time); // Suenan kick y hi-hat
            snarePart.start(time); // Suena la tarola en tiempos 2 y 4
        } else {
            beatLoop.stop(time); // Pausa
            snarePart.stop(time); // Pausa
        }
        measure = (measure + 1) % 9; // Reinicia el ciclo después de 3 compases
    }, "1m"); // Cambia cada compás (1 medida)

    // Iniciar el transporte de Tone.js
    Tone.Transport.start();
});
