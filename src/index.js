import p5 from 'p5';
import "./js/p5.sound";
import { WebMidi } from "webmidi";
import scoreMae from './assets/scoreMae.csv';
import score2 from './assets/score2.csv';

let partitura;

function sketch(s) {
  let table1, table2;
  let outputArte, outputCiencia, outputTecnologia, notas;
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

  function setValuesMidi(partitura) {
    const clases = Object.keys(partitura);
    clases.map(clase => {
      const notasNumbers = partitura[clase].notas?.map(item => item ? parseInt(item) : 0);
      const getValue = (value) => {
        for (let index = 0; index < notasNumbers.length; index++) {
          if(value === notasNumbersOrder[index]) return escala[index];
        }
      }
      const notasNumbersOrder = [ ...new Set(notasNumbers)].sort((a, b) => a-b);
      const escala = [0, 41, 43, 44, 46, 48, 50, 51, 53, 55, 56, 58, 60, 62, 63, 65, 67, 68, 70];
      notas = notasNumbers.map(num => getValue(num));
      newObject = {...newObject, [clase]: notas }
      console.log(notas);
    })
  }

  function sendMidiNote() {
    const notasArte = newObject['arte'];
    const notasCiencia = newObject['ciencia'];
    const notasTecnologia = newObject['tecnologia'];
    if(cont >= notas.length - 1) cont = 0;
    if(cont !== 0) {
      outputArte.channels[1].stopNote(notasArte[cont]);
      outputCiencia.channels[2].stopNote(notasCiencia[cont]);
      outputTecnologia.channels[3].stopNote(notasTecnologia[cont]);
    }
    cont++;
    outputArte.channels[1].playNote(notasArte[cont]);
    outputCiencia.channels[2].playNote(notasCiencia[cont]);
    outputTecnologia.channels[3].playNote(notasTecnologia[cont]);
  }

  function playNotes() {
    interval = setInterval(sendMidiNote, 1000);
  }

  function stopNotes() {
    clearInterval(interval);
    cont++;
  }

  s.draw = () => {}
}

//frecuencia
//.h con las categorías y su orden en el arreglo
//npm install
//npm run server
//corre en local host 8080
//agregar un h1 o p que indique corriendo con éxito

new p5(sketch);
