let Promise = require('bluebird');
let request = require('request');

url = 'https://poloniex.com/public?command=returnTicker';


module.exports = (currency) => {
	return new Promise((resolve, reject) => {
		request.get(url, (err, response) => {
			if (err) return reject(err);

			ticker = JSON.parse(response.body);
			key = Object.keys(ticker).filter(k => k.toLowerCase().indexOf(currency.toLowerCase()) != -1 && k.toLowerCase().indexOf("eth") != -1)[0];
			resolve(ticker[key]);
		});		
	});
}
