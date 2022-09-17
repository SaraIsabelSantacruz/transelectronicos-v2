import p5 from 'p5';
import "./js/p5.sound";
import { WebMidi } from "webmidi";
import scoreMae from './assets/scoreMae.csv';
import score2 from './assets/score2.csv';

let partitura;
console.log('Se inicia el programa');
function sketch(s) {
  let table1, table2;
  let outputArte, outputCiencia, outputTecnologia, notas, tiempos;
  let newObject = {};
  let tableArray = [];
  let cont = 0;
  let interval;

  s.preload = () => {
    table1 = s.loadTable(scoreMae, 'csv', 'header');
    table2 = s.loadTable(score2, 'csv', 'header');
    WebMidi.enable()
    .then(onWebMidiEnabled)
    .catch(err => alert(err));
  };

  s.setup = () => {
    s.createCanvas(window.innerWidth, window.innerHeight);
    const button = s.createButton('PLAY');
    const button2 = s.createButton('STOP');
    const button3 = s.createButton('MAE');
    const button4 = s.createButton('MALA PRAXIS');

    button.position(0, 30);
    button2.position(120, 30);
    button3.position(0, 0);
    button4.position(120, 0);
    tableArray = table2.getArray();
    const valoresArte = tableArray[0]; valoresArte.pop(); valoresArte.shift();
    const valoresCiencia = tableArray[1]; valoresCiencia.pop(); valoresCiencia.shift();
    const valoresTecnologia = tableArray[2]; valoresTecnologia.pop(); valoresTecnologia.shift();
    const notasMidiMaterias = {
      arte: {
        notas: valoresArte
      }, 
      ciencia: {
        notas: valoresCiencia
      }, 
      tecnologia: {
        notas: valoresTecnologia
      }
    }

    setValuesMidi(notasMidiMaterias)
    button.mousePressed(playNotes);
    button2.mousePressed(stopNotes);
    button3.mousePressed(() => {
      tableArray = table1.getArray();
      console.log(tableArray, 'MAE');
    });
    button4.mousePressed(() => {
      tableArray = table2.getArray();
      console.log(tableArray, 'MALA PRAXIS');
    });
  }

  function onWebMidiEnabled() {
    console.log(WebMidi);
    // Check if at least one MIDI input is detected. If not, display warning and quit.
    if (WebMidi.inputs.length < 1) {
      alert("No MIDI inputs detected.");
      return;
    }

    outputArte = WebMidi.getOutputByName("IAC Driver Bus 1"); //Sara
    outputCiencia = WebMidi.getOutputByName("IAC Driver Bus 2"); //Sara
    outputTecnologia = WebMidi.getOutputByName("IAC Driver Bus 3"); //Sara
    //outputArte = WebMidi.getOutputByName("Driver IAC Bus 1"); //Rosario
  };

  const functionToCreateNotes = (start, stop, step) => {
    return Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step))
  };

  function setValuesMidi(partitura) {
    const clases = Object.keys(partitura);
    clases.map(clase => {
      const notasNumbers = partitura[clase].notas?.map(item => item ? parseInt(item) : 0);
      const notasNumbersOrder = [ ...new Set(notasNumbers)].sort((a, b) => a-b);
      if(clase === 'arte') { 
        partitura['arte'].tiempo = functionToCreateNotes(0, 4, 2);
        partitura['arte'].tiempo.reverse();
        partitura['arte'].tiempo[partitura['arte'].tiempo.length-1] = 1;
        partitura['arte'].tiempo.splice(0,0,0);
        partitura['arte'].notasMidi = functionToCreateNotes(12, 48, 12);
      }
      if(clase === 'ciencia') {
        partitura['ciencia'].tiempo = functionToCreateNotes(0, 4, 2);
        partitura['ciencia'].tiempo.reverse();
        partitura['ciencia'].tiempo[partitura['ciencia'].tiempo.length-1] = 1;
        partitura['ciencia'].tiempo.splice(0,0,0);
        partitura['ciencia'].notasMidi = functionToCreateNotes(19, 55, 12);
      }
      if(clase === 'ciencia') {
        partitura['tecnologia'].tiempo = functionToCreateNotes(0, 4, 2);
        partitura['tecnologia'].tiempo.reverse();
        partitura['tecnologia'].tiempo[partitura['tecnologia'].tiempo.length-1] = 1;
        partitura['tecnologia'].tiempo.splice(0,0,0);
        partitura['tecnologia'].notasMidi = functionToCreateNotes(16, 52, 12);
      }
      const escala = partitura[clase].notasMidi;
      const formasDeNota = partitura[clase].tiempo;
      const getValueNotes = (value) => {
        for (let i=0; i<notasNumbersOrder.length; i++) {
          if (value === 0) return 0;
          if(value === notasNumbersOrder[i]) {
            let indexEscala = i;
            if(i >= escala.length) {
              const restaIndexEscala = escala.length - (notasNumbersOrder.length-1 - i);
              indexEscala = restaIndexEscala-1;
            }
            return escala[indexEscala];
          };
        }
      }
      const getValueTimes = (value) => {
        for (let i=0; i<notasNumbersOrder.length; i++) {
          if (value === 0) return 0;
          if(value === notasNumbersOrder[i]) {
            let indexFormasNotas = i;
            if(i >= formasDeNota.length) {
              const restaIndexFormasNotas = formasDeNota.length - (notasNumbersOrder.length-1 - i);
              indexFormasNotas = restaIndexFormasNotas-1;
            }
            return formasDeNota[indexFormasNotas];
          };
        }
      }
      notas = notasNumbers.map(num => getValueNotes(num));
      tiempos = notasNumbers.map(num => getValueTimes(num));
      newObject = {...newObject, [clase]: { notas, tiempos }};
    })
  }

  function envioNotasArte() {
    const notasArte = newObject['arte'].notas;
    const tiempoArte = newObject['arte'].tiempos;
    if(cont >= notas.length - 1) cont = 0;
    if(cont !== 0) {
      outputArte.channels[1].stopNote(notasArte[cont]);
    }
    if(notasArte[cont] !== 0) {
      outputArte.channels[1].playNote(notasArte[cont], { duration: tiempoArte[cont]*1000 });
      console.log(cont, notasArte[cont], 'arte');
    }
    cont++;
  }

  function envioNotasCiencia() {
    const notasCiencia = newObject['ciencia'].notas;
    const tiempoCiencia = newObject['ciencia'].tiempos;
    if(cont >= notas.length - 1) cont = 0;
    if(cont !== 0) {
      outputCiencia.channels[2].stopNote(notasCiencia[cont]);
    }
    if(notasCiencia[cont] !== 0) {
      outputCiencia.channels[2].playNote(notasCiencia[cont], { duration: tiempoCiencia[cont]*1000 });
      console.log(cont, notasCiencia[cont], 'ciencia');
    }
    cont++;
  }

  function envioNotasTec() {
    const notasTecnologia = newObject['tecnologia'].notas;
    const tiempoTecnologia = newObject['tecnologia'].tiempos;
    if(cont >= notas.length - 1) cont = 0;
    if(cont !== 0) {
      outputTecnologia.channels[3].stopNote(notasTecnologia[cont]);
    }
    if(notasTecnologia[cont] !== 0 ) {
      outputTecnologia.channels[3].playNote(notasTecnologia[cont], { duration: tiempoTecnologia[cont]*1000 });
      console.log(cont, notasTecnologia[cont], 'Tecnologia');
    }
    cont++;
  }

  let delayArte = 0; let delayCiencia=0; let delayTec = 0;
  let timerArte, timerCiencia, timerTec;
  let timeArte, timeCiencia, timeTec = 0;
  
  function playNotes() {
    timerArte = setTimeout(function request() {
      if(delayArte <= 24) {
        timeArte = newObject['arte'].tiempos[delayArte]*1000;
        envioNotasArte();
        delayArte++;
        timerArte = setTimeout(request, timeArte);
        if(delayArte > 24) delayArte = 0;
      }
    }, timeArte);

    timerCiencia = setTimeout(function request() {
      if(delayCiencia <= 24) {
        timeCiencia = newObject['ciencia'].tiempos[delayCiencia]*1000;
        envioNotasCiencia();
        delayCiencia++;
        timerCiencia = setTimeout(request, timeCiencia);
        if(delayCiencia > 24) delayCiencia = 0;
      }
    }, timeCiencia);

    timerTec = setTimeout(function request() {
      if(delayTec <= 24) {
        timeTec = newObject['tecnologia'].tiempos[delayTec]*1000;
        envioNotasTec();
        delayTec++;
        timerTec = setTimeout(request, timeTec);
        if(delayTec > 24) delayTec = 0;
      }
    }, timeTec);
  }

  function stopNotes() {
    clearTimeout(timerArte);
    clearTimeout(timerCiencia);
    clearTimeout(timerTec);
    cont++;
  }

  s.draw = () => {}
}
new p5(sketch);
