import p5 from 'p5';
import "./js/p5.sound";
import WebMidi from "webmidi";
import score from './assets/score2.csv';

var notaMidiMin = 36;
var notaMidiMax = 95;

function sketch(s) {
  let table;
  let outputArte, outputCiencia, outputTecnologia, notas;
  let newObject = {};
  let cont = 0;

  s.preload = () => {
    table = s.loadTable(score, 'csv', 'header');
  };

  s.setup = () => {
    s.createCanvas(window.innerWidth, window.innerHeight);
    let tableArray = table.getArray();
    const valoresArte = tableArray[0]; valoresArte.pop(); valoresArte.shift();
    const valoresCiencia = tableArray[1]; valoresCiencia.pop(); valoresCiencia.shift();
    const valoresTecnologia = tableArray[2]; valoresTecnologia.pop(); valoresTecnologia.shift();
    const duracionReal = tableArray[26].map(item => parseInt(item)); duracionReal.pop(); duracionReal.shift();
    const maxNumberInterval = Math.max(...duracionReal);
    const minNumberInterval = Math.min(...duracionReal);
    const intervaloTiempo = duracionReal.map(time => {
      return parseInt(s.map(time, minNumberInterval, maxNumberInterval, 0, 100000));
    });
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


    setValuesMidi(notasMidiMaterias, intervaloTiempo);
  }

  function setValuesMidi(partitura, intervalo) {
    const clases = Object.keys(partitura);
    clases.map(clase => {
      const notasArteNumbers = partitura[clase].notas?.map(item => parseInt(item));
      const maxNumber = Math.max(...notasArteNumbers);
      const minNumber = Math.min(...notasArteNumbers);
      notas = notasArteNumbers.map(item => parseInt(s.map(item, minNumber, maxNumber, notaMidiMin, notaMidiMax)));
      newObject = {...newObject, [clase]: notas }
    })
    setInterval(sendMidiNote, 1000);
  }

  function sendMidiNote() {
    const notasArte = newObject['arte'];
    const notasCiencia = newObject['ciencia'];
    const notasTecnologia = newObject['tecnologia'];
    if(cont >= notas.length - 1) cont = 0;
    if(cont !== 0) {
      outputArte.stopNote(notasArte[cont], 1);
      outputCiencia.stopNote(notasCiencia[cont], 1);
      outputTecnologia.stopNote(notasTecnologia[cont], 1);
    }
    cont++;
    console.log(notasArte[cont], notasCiencia[cont], notasTecnologia[cont]);
    outputArte.playNote(notasArte[cont], 1);
    outputCiencia.playNote(notasCiencia[cont], 1);
    outputTecnologia.playNote(notasTecnologia[cont], 1);
  }

  WebMidi.enable(function(err) {
    if(err) { console.log("WebMidi could not be enabled.", err) }
    outputArte = WebMidi.getOutputByName("IAC Driver Bus 1"); //Sara
    outputCiencia = WebMidi.getOutputByName("IAC Driver Bus 2"); //Sara
    outputTecnologia = WebMidi.getOutputByName("IAC Driver Bus 3"); //Sara
    //outputArte = WebMidi.getOutputByName("Driver IAC Bus 1"); //Rosario
  });

  s.draw = () => {}
}

//frecuencia
//.h con las categorías y su orden en el arreglo
//npm install
//npm run server
//corre en local host 8080
//agregar un h1 o p que indique corriendo con éxito

new p5(sketch);
