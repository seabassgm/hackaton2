document.getElementById("startButton").addEventListener("click", async () => {
    const status = document.getElementById("status");
    status.innerText = "Estado: Reproduciendo patrón con arpegiador...";

    // Necesario para iniciar Tone.js
    await Tone.start();
    console.log("Tone.js iniciado");

    // Crear sintetizadores para el kick, hi-hat, tarola y arpegiador
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

    // Crear un sintetizador polifónico para el arpegiador
    const arpeggiator = new Tone.PolySynth(Tone.Synth).toDestination();

    // Configurar un loop para el arpegiador con Sol menor
    const arpeggioLoop = new Tone.Loop((time) => {
        const pjanooNotes = ["Ab4", "Db5", "Gb5", "Eb5"]; // Notas del arpegio de "Pjanoo"
        const duration = "8n"; // Duración de cada nota (octava nota)

        // Toca las notas en secuencia
        pjanooNotes.forEach((note, index) => {
            arpeggiator.triggerAttackRelease(note, duration, time + index * Tone.Time(duration));
        });
    }, "1m"); // Repite cada compás

    // Crear un loop para el beat (kick + hi-hat)
    const beatLoop = new Tone.Loop((time) => {
        // Kick
        kick.triggerAttackRelease("C1", "8n", time);

        // Hi-hat
        hihat.triggerAttackRelease("16n", time);
    }, "4n"); // Se ejecuta en cada negra

    // Crear un loop para la tarola
    const snarePart = new Tone.Part((time) => {
        snare.triggerAttackRelease("16n", time);
    }, [
        ["0:1:0"], // Segundo tiempo del compás
        ["0:3:0"], // Cuarto tiempo del compás
    ]);

    snarePart.loop = true; // Hacer que la tarola se repita
    snarePart.loopEnd = "1m"; // Repetir cada compás (1 medida)

    // Configurar loops
    beatLoop.start(0); // Kick y hi-hat
    snarePart.start(0); // Tarola
    arpeggioLoop.start(0); // Arpegiador

    // Configurar el transporte
    Tone.Transport.bpm.value = 125;

    // Iniciar el transporte
    Tone.Transport.start();
});
