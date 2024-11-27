document.getElementById("startButton").addEventListener("click", async () => {
    const status = document.getElementById("status");
    status.innerText = "Estado: Reproduciendo bajo, piano y batería...";

    // Start Tone.js
    await Tone.start();
    console.log("Tone.js iniciado");

    // Create syntetizers for kick, hi-hat, snare, piano and bass
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
    const bass = new Tone.MonoSynth({
        oscillator: { type: "sawtooth" },
        envelope: { attack: 0.05, decay: 0.2, sustain: 0.3, release: 0.8 },
    }).toDestination();

    // Bass loop
    const bassLoop = new Tone.Loop((time) => {
        const bassNotes = [
            // Compás 1
            { note: "G2", duration: "8n", time: "0:0:0" },
            { note: "G2", duration: "8n", time: "0:0:2" },
            { note: "F2", duration: "8n", time: "0:1:0" },
            { note: "F2", duration: "8n", time: "0:1:2" },
            { note: "Eb2", duration: "8n.", time: "0:2:0" },
            { note: "Eb2", duration: "8n.", time: "0:2:3" },
            { note: "Eb2", duration: "8n", time: "0:3:2" },

            // Compás 2
            { note: "Eb2", duration: "8n", time: "1:0:0" },
            { note: "Eb2", duration: "8n", time: "1:0:2" },
            { note: "F2", duration: "8n", time: "1:1:0" },
            { note: "F2", duration: "8n", time: "1:1:2" },
            { note: "C2", duration: "8n.", time: "1:2:0" },
            { note: "C2", duration: "8n.", time: "1:2:3" },
            { note: "C2", duration: "8n", time: "1:3:2" },

            // Compás 3
            { note: "C2", duration: "8n", time: "2:0:0" },
            { note: "C2", duration: "8n", time: "2:0:2" },
            { note: "D2", duration: "8n", time: "2:1:0" },
            { note: "D2", duration: "8n", time: "2:1:2" },
            { note: "Eb2", duration: "8n.", time: "2:2:0" },
            { note: "Eb2", duration: "8n.", time: "2:2:3" },
            { note: "Eb2", duration: "8n", time: "2:3:2" },

            // Compás 4
            { note: "Eb2", duration: "8n", time: "3:0:0" },
            { note: "Eb2", duration: "8n", time: "3:0:2" },
            { note: "F2", duration: "8n", time: "3:1:0" },
            { note: "F2", duration: "8n", time: "3:1:2" },
            { note: "G2", duration: "8n.", time: "3:2:0" },
            { note: "G2", duration: "8n.", time: "3:2:3" },
            { note: "G2", duration: "8n", time: "3:3:2" },
        ];

        // Reproduce bass
        bassNotes.forEach(({ note, duration, time: noteTime }) => {
            bass.triggerAttackRelease(note, duration, time + Tone.Time(noteTime));
        });
    }, "4m"); // Repeat every 4 bars

    // Piano loop
    const pianoLoop = new Tone.Loop((time) => {
        const melodyNotes = [
            { note: "Bb4", duration: "8n", time: "0:0:0" },
            { note: "Bb4", duration: "8n", time: "0:0:2" },
            { note: "A4", duration: "8n", time: "0:1:0" },
            { note: "A4", duration: "8n", time: "0:1:2" },
            { note: "G4", duration: "8n.", time: "0:2:0" },
            { note: "G4", duration: "8n.", time: "0:2:3" },
            { note: "G4", duration: "8n", time: "0:3:2" },
        ];

        const harmonyNotes = [
            { note: "G4", duration: "8n", time: "0:0:0" },
            { note: "G4", duration: "8n", time: "0:0:2" },
            { note: "F4", duration: "8n", time: "0:1:0" },
            { note: "F4", duration: "8n", time: "0:1:2" },
            { note: "D4", duration: "8n.", time: "0:2:0" },
            { note: "D4", duration: "8n.", time: "0:2:3" },
            { note: "D4", duration: "8n", time: "0:3:2" },
        ];

        melodyNotes.forEach(({ note, duration, time: noteTime }) => {
            piano.triggerAttackRelease(note, duration, time + Tone.Time(noteTime));
        });

        harmonyNotes.forEach(({ note, duration, time: noteTime }) => {
            piano.triggerAttackRelease(note, duration, time + Tone.Time(noteTime));
        });
    }, "1m"); // Repeat each bar

    // Drums loop
    const beatLoop = new Tone.Loop((time) => {
        kick.triggerAttackRelease("C1", "8n", time);
        hihat.triggerAttackRelease("16n", time);
    }, "4n");

    const snarePart = new Tone.Part((time) => {
        snare.triggerAttackRelease("16n", time);
    }, [
        ["0:1:0"], // Time 2
        ["0:3:0"], // Time 4
    ]);

    snarePart.loop = true;
    snarePart.loopEnd = "1m";

    // Start loops
    beatLoop.start(0);
    snarePart.start(0);
    pianoLoop.start(0);
    bassLoop.start(0);

    // Transporte
    Tone.Transport.bpm.value = 125;

    // Start transport
    Tone.Transport.start();
});

// Stop song
document.getElementById("stopButton").addEventListener("click", () => {
    Tone.Transport.stop(); // Stop transport and loops
    document.getElementById("status").innerText = "State: Stopped song";
    console.log("Transport stopped");
});
