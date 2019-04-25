'use strict';

//Some const values
const index_name_for_session_array = 'test_session_array';
const index_name_for_session_fields = 'test_session_fields';

const elasticsearch = require('elasticsearch');
const util = require('util');


const esClient = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'error'
});

// const esClient = new elasticsearch.Client({
//     cloud: {
//         id: 'rxclinic:dXMtZWFzdC0xLmF3cy5mb3VuZC5pbyRlMDljODczZTg2ZjY0N2ZmYmNmZDk3YjVmMTc1MmE4MSRkMDAxNWE0ODg0OTM0ZGYzYWZjZWM1MDE0ZGNjMzAxNA==',
//         username: 'elastic',
//         password: 'qazPLM22@22'
//       }
// });

// client.ping({
//   // ping usually has a 3000ms timeout
//   requestTimeout: 1000
// }, function (error) {
//   if (error) {
//     console.trace('elasticsearch cluster is down!');
//   } else {
//     console.log('All is well');
//   }
// });



querySessionArray(index_name_for_session_array, '_doc', result);
querySessionFields(index_name_for_session_fields, '_doc', result);


function generateRoutingKey(hex){
    return parseInt(hex.toString().slice(-11), 16)%7;
}

function querySessionFields(index, type, data){

}

function querySessionArray(index, type, data){

}