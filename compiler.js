// Compiles .sol files, and saves abi and bytecode in a .js file
const fs = require('fs');
const solc = require('solc');


// Compile the source code
const input = fs.readFileSync(process.argv[2]);
const output = solc.compile(input.toString(), 1);

let contract = Object.keys(output.contracts)[0];

const bytecode = output.contracts[contract].bytecode;
const abi = output.contracts[contract].interface;


let outfile = process.argv[2].replace('sol', 'js');

let data = 'module.exports = {bytecode : "' + bytecode + '",\nabi : ' + abi + '};\n';

fs.writeFileSync(outfile, data);
