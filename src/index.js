import p5 from 'p5';
import "./js/p5.sound";
import WebMidi from "webmidi";
import scoreMae from './assets/scoreMae.csv';
import score2 from './assets/score2.csv';

let partitura;

function sketch(s) {
  let table1, table2;
  let outputArte, outputCiencia, outputTecnologia, notas;
  let newObject = {};
  let tableArray = [];
  let indice = -1;
  let interval;
  let notasArte ;
  let notasCiencia ;
  let notasTecnologia ;
  let notasHumanas ;
  let tiempos;


  s.preload = () => {
    table1 = s.loadTable(scoreMae, 'csv', 'header');
    table2 = s.loadTable(score2, 'csv', 'header');
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
    const valoresTiempo = tableArray[26]; valoresTiempo.pop(); valoresTiempo.shift();
    const notasMidiMaterias = {
      arte: {
        notas: valoresArte
      }, 
      ciencia: {
        notas: valoresCiencia
      }, 
      tecnologia: {
        notas: valoresTecnologia
      },
      duracionReal: {
        notas: valoresTiempo
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
    //cargo los vectores
    notasArte = newObject['arte'];
    notasCiencia = newObject['ciencia'];
    notasTecnologia = newObject['tecnologia'];
    notasHumanas = newObject['CienciasHumanas'];
    tiempos = newObject['duracionReal'];
    console.log(newObject);
  }

  function enviarNotaReaper(salida,notaAnterior,notaPorClase){
    salida.stopNote(notaAnterior,1);
    salida.playNote(notaPorClase, 1);
    console.log("dispositivo "+salida+" nota "+notaPorClase);
  }
  function sendMidiNote() {
    let indiceAnterior=indice-1;
    indiceAnterior =(indiceAnterior < 0)? notas.length - 1: indiceAnterior;
    
    enviarNotaReaper(outputArte,notasArte[indiceAnterior],notasArte[indice]);
    enviarNotaReaper(outputCiencia,notasCiencia[indiceAnterior],notasCiencia[indice]);
    enviarNotaReaper(outputTecnologia,notasTecnologia[indiceAnterior],notasTecnologia[indice]);
  }

  function playNotes() {
    indice++;
    if(indice >= notas.length - 1) indice = 0;
    sendMidiNote();
    console.log("indice "+indice);
    console.log("entro al proceso de ...");
    interval = setTimeout(playNotes, tiempos[indice]*100);
  }

  function stopNotes() {
    clearInterval(interval);
    indice++;
  }

  WebMidi.enable(function(err) {
    if(err) { console.log("WebMidi could not be enabled.", err) }
    //outputArte = WebMidi.getOutputByName("IAC Driver Bus 1"); //Sara
    //outputCiencia = WebMidi.getOutputByName("IAC Driver Bus 2"); //Sara
    //outputTecnologia = WebMidi.getOutputByName("IAC Driver Bus 3"); //Sara
    outputArte = WebMidi.getOutputByName("Driver IAC Bus 1"); //Rosario
    outputCiencia = WebMidi.getOutputByName("Driver IAC Bus 2"); //Rosario
    outputTecnologia = WebMidi.getOutputByName("Driver IAC Bus 3"); //Rosario
    console.log(outputArte);
  });

  s.draw = () => {}
}


new p5(sketch);
