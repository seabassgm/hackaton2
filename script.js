document.getElementById("startButton").addEventListener("click", async () => {
    const status = document.getElementById("status");
    status.innerText = "Estado: Reproduciendo patrón de piano y batería...";

    // Necesario para iniciar Tone.js
    await Tone.start();
    console.log("Tone.js iniciado");

    // Crear sintetizadores para el kick, hi-hat, tarola y piano
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

    const piano = new Tone.PolySynth(Tone.Synth).toDestination();

    // Configurar un loop para el patrón de piano
    const pianoLoop = new Tone.Loop((time) => {
        const pianoNotes = [
            { note: "Bb4", duration: "8n", time: 0 }, // Bb dos veces en octavos
            { note: "Bb4", duration: "8n", time: "0:0:2" },
            { note: "A4", duration: "8n", time: "0:1:0" }, // A dos veces en octavos
            { note: "A4", duration: "8n", time: "0:1:2" },
            { note: "G4", duration: "8n.", time: "0:2:0" }, // G dos veces en octavos con puntillo
            { note: "G4", duration: "8n.", time: "0:2:3" },
            { note: "G4", duration: "8n", time: "0:3:2" }, // G una vez en octavo
        ];

        pianoNotes.forEach(({ note, duration, time: noteTime }) => {
            piano.triggerAttackRelease(note, duration, time + Tone.Time(noteTime));
        });
    }, "1m"); // Repite cada compás

    // Crear un loop para el beat (kick + hi-hat)
    const beatLoop = new Tone.Loop((time) => {
        kick.triggerAttackRelease("C1", "8n", time); // Kick en cada negra
        hihat.triggerAttackRelease("16n", time); // Hi-hat en cada negra
    }, "4n");

    // Crear un loop para la tarola
    const snarePart = new Tone.Part((time) => {
        snare.triggerAttackRelease("16n", time);
    }, [
        ["0:1:0"], // Segundo tiempo del compás
        ["0:3:0"], // Cuarto tiempo del compás
    ]);

    snarePart.loop = true; // Hacer que la tarola se repita
    snarePart.loopEnd = "1m"; // Repetir cada compás

    // Configurar loops
    beatLoop.start(0); // Kick y hi-hat
    snarePart.start(0); // Tarola
    pianoLoop.start(0); // Piano

    // Configurar el transporte
    Tone.Transport.bpm.value = 125;

    // Iniciar el transporte
    Tone.Transport.start();
});
