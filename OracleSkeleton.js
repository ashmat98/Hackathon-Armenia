// Load Ethereum
const Eth = require('ethjs');
const privateToAccount = require('ethjs-account').privateToAccount;
const provider = 'http://127.0.0.1:7545'; //'https://rinkeby.infura.io';
const eth = new Eth(new Eth.HttpProvider(provider));

//provider account
const privateKeyString = "c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3";
const account = privateToAccount(privateKeyString); 

//create contract wrapper 
const Futures = require('./FuturesExample.js');
const futuresABI = Futures.abi;
const futuresAddress="0xf328c11c4df88d18fcbd30ad38d8b4714f4b33bf";
const futures = eth.contract(futuresABI).at(futuresAddress);

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


/*
Handle Query events from futures contract
event Query(string queryString, address queryAddress);
*/

console.log('asdasdasd'
    , futures.contract)

var filter = futures.Query().new((err, res) => {
    if (err) throw err;
    
})

console.log(filter)
filter.then(console.log)

// filter.watch().then(console.log)
// Create the Event filter for solidity event
// let filter = futures.contract.Query().new((err, res) => {
//     if ( err ) {
//         throw err;
//     }

// console.log(err, res,'ehjwifjsk')
// // Watch the event filter
// quer_event.watch().then((result) => {
//     // Sanity check
//     console.log(result)
//     if ( result.length != 2 ) {
//         throw Error(); 
//     }

//     // Make sure it is us
//     if ( result[1] != account ) {
//         throw Error(); 
//     }

//    fetchData(result[0],respondToQuery)})
//     // });
// // });
