
const fs = require('fs')
const join = require('path');
// import { join } from 'path';
function parseCsv(data, fieldSep, newLine) {
    fieldSep = fieldSep || ',';
    newLine = newLine || '\n';
    var nSep = '\x1D';
    var qSep = '\x1E';
    var cSep = '\x1F';
    var nSepRe = new RegExp(nSep, 'g');
    var qSepRe = new RegExp(qSep, 'g');
    var cSepRe = new RegExp(cSep, 'g');
    var fieldRe = new RegExp('(?<=(^|[' + fieldSep + '\\n]))"(|[\\s\\S]+?(?<![^"]"))"(?=($|[' + fieldSep + '\\n]))', 'g');
    var grid = [];
    data.replace(/\r/g, '').replace(/\n+$/, '').replace(fieldRe, function(match, p1, p2) {
        return p2.replace(/\n/g, nSep).replace(/""/g, qSep).replace(/,/g, cSep);
    }).split(/\n/).forEach(function(line) {
        console.log('line:-',line);

        var row = line.split(fieldSep).map(function(cell) {
            return cell.replace(nSepRe, newLine).replace(qSepRe, '"').replace(cSepRe, ',');
        });
        // console.log(row);
        grid.push(row);
    });
    return grid;
}

    
var grid;
fs.readFile('./data.csv', 'utf-8',(err, data) => {
    grid = parseCsv(data);
    // console.log('==> grid: ' + JSON.stringify(grid));
    
var xml = grid.map(function(row, index, arr) {
    // console.log('index: ', arr);
    // console.log('row: ', row[0]);

    return '<doc>\n'
      + '<field name="'+arr[0][0]+'">' + row[0] + '</field>\n'
      + '<field name="'+arr[0][1]+'">' + row[1] + '</field>\n'
      + '<field name="'+arr[0][2]+'">' + row[2] + '</field>\n'
      + '<field name="'+arr[0][3]+'">' + row[3] + '</field>\n'
      + '</doc>\n'
  }).join('');
  let xmlheader = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
  xml  = xmlheader + '<add>' +xml + '</add>';
//   console.log('==> xml:\n' + xmlheader + '<add>' +xml + '</add>');
  fs.writeFile('./data.xml', xml, (err,data) =>{
    //   console.log(data);
  })
  
});

