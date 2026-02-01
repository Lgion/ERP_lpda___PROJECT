const fs = require('fs');
const pdf = require('pdf-parse');

const dataBuffer = fs.readFileSync('public/ETAT_IMPRIME_STOCK_PAR_FAMILLE.PDF');

pdf(dataBuffer).then(function (data) {
    console.log(data.text);
}).catch(err => {
    console.error(err);
});
