import p5 from 'p5';
import score from './assets/score.csv';

function sketch(s) {
  let table;
  s.preload = () => {
    table = s.loadTable(score, 'csv', 'header');
  };

  s.setup = () => {
    s.createCanvas(window.innerWidth, window.innerHeight);
    let tableArray = table.getArray();
    const newObject = { ...tableArray }
    //let newObject = { clase: tableArray.map(item => item[0]) }
    console.log(newObject);
    //console.log(tableArray[0][0], tableArray[1][0], tableArray[2][0], tableArray[3][0]);
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

