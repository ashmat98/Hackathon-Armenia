// Load Ethereum
const Eth = require('ethjs');
const privateToAccount = require('ethjs-account').privateToAccount;
const provider = 'https://rinkeby.infura.io';
const eth = new Eth(new Eth.HttpProvider(provider));

//provider account
const privateKeyString = "c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3";
const account = privateToAccount(privateKeyString); 

//create contract wrapper 
const Futures = require('./FuturesExample.js');
const futuresABI = Futures.abi;
const futuresAddress="0x5180FC619220a0be134F98694d25e41B60C06B91";
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

// Create the Event filter for solidity event
let filter = futures.contract.Query().new((err, res) => {
    if ( err ) {
        throw err;
    }
});

// Watch the event filter
filter.watch().then((result) => {
    // Sanity check
    if ( result.length != 2 ) {
        throw; 
    }

    // Make sure it is us
    if ( result[1] != account ) {
        throw; 
    }

   fetchData(result[0],respondToQuery); 
});
