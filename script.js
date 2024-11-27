document.getElementById("startButton").addEventListener("click", async () => {
    const status = document.getElementById("status");
    status.innerText = "Estado: Reproduciendo patrón...";

    // Necesario para iniciar Tone.js
    await Tone.start();
    console.log("Tone.js iniciado");

    // Crear sintetizadores para el kick y el hi-hat
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

    // Detener cualquier loop activo previo
    Tone.Transport.stop();
    Tone.Transport.cancel(); // Cancela todos los eventos anteriores

    // Configurar el transporte
    Tone.Transport.bpm.value = 125;

    // Crear el patrón de kick y hi-hat
    const kickPart = new Tone.Part((time) => {
        kick.triggerAttackRelease("C1", "8n", time);
    }, [
        ["0:0:0"], ["0:1:0"], ["0:2:0"], ["0:3:0"], // Primer compás
        ["1:0:0"], ["1:1:0"], ["1:2:0"], ["1:3:0"], // Segundo compás
    ]);

    const hihatPart = new Tone.Part((time) => {
        hihat.triggerAttackRelease("16n", time);
    }, [
        ["0:0:0"], ["0:0:2"], ["0:1:0"], ["0:1:2"], ["0:2:0"], ["0:2:2"], ["0:3:0"], ["0:3:2"], // Primer compás
        ["1:0:0"], ["1:0:2"], ["1:1:0"], ["1:1:2"], ["1:2:0"], ["1:2:2"], ["1:3:0"], ["1:3:2"], // Segundo compás
    ]);

    // Configurar inicio y pausa
    kickPart.loop = true; // Se repite automáticamente
    kickPart.loopStart = "0:0:0"; // Comienza desde el principio
    kickPart.loopEnd = "3:0:0"; // Incluye dos compases de sonido + un compás de pausa

    hihatPart.loop = true; // Igual que el kick
    hihatPart.loopStart = "0:0:0";
    hihatPart.loopEnd = "3:0:0";

    // Iniciar los patrones
    kickPart.start(0);
    hihatPart.start(0);

    // Iniciar el transporte de Tone.js
    Tone.Transport.start();
});
