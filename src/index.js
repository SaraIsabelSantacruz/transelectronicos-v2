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

new p5(sketch);

