// Load Ethereum
const Eth = require('ethjs');
const privateToAccount = require('ethjs-account').privateToAccount;
const provider = 'http://127.0.0.1:7545'; //'https://rinkeby.infura.io';
const eth = new Eth(new Eth.HttpProvider(provider));

//provider account
const privateKeyString = "c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3";
const account = privateToAccount(privateKeyString); 

//create contract wrapper 
const Futures = require('./FuturesExample.js');  // Compiled version of FuturesSol.js
const futuresABI = Futures.abi;
const futuresAddress="0x2467636bea0f3c2441227eedbffac59f11d54a80";  // contract address
const futures = eth.contract(futuresABI, Futures.bytecode).at(futuresAddress);

const exchange = require('./exchange.js');

/*  
Handle Oracle Data
*/

//respond to queryString from futures.Query event
let respondToQuery = function(response){

    futures.oracleCallback(response).then((totalSupply) => {
        if ( err ) throw err;

    });
}

function fetchData(queryString, callback){
    exchange(queryString).then(data => {
        let price = (parseFloat(data['highestBid']) + parseFloat(data['lowestAsk'])) / 2;
        return callback(price);
    }).catch(null);
}


let queryEvent = futures.Query();

queryEvent.watch((err, res) => {
    console.log(err, res)
    fetchData(res[0], respondToQuery)
})
