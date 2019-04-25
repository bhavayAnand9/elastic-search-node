'use strict';

//Some const values
const index_name_for_session_array = 'test_session_array';
const index_name_for_session_fields = 'test_session_fields';

const elasticsearch = require('elasticsearch');
const mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const util = require('util');

const url = 'mongodb://localhost:27017/';

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

esClient.indices.create({  
    index: index_name_for_session_array
  },function(err,resp,status) {
    if(err) {
      console.log(err);
    }
    else {
      console.log("create",resp);
    }
});

esClient.indices.create({  
    index: index_name_for_session_fields
  },function(err,resp,status) {
    if(err) {
      console.log(err);
    }
    else {
      console.log("create",resp);
    }
});



MongoClient.connect(url, {useNewUrlParser: true},  function(err, db){
    if(err) throw err;
    var dbo = db.db('rxclinic_test');
    var collection = dbo.collection('sessions');
    collection.find().toArray(function(err, result){
        if(err) throw err;

        indexSessionArray(index_name_for_session_array, '_doc', result);
        indexSessionFields(index_name_for_session_fields, '_doc', result);
        // health()
        db.close();
    });
})

function generateRoutingKey(hex){
    return parseInt(hex.toString().slice(-11), 16)%7;
}

function indexSessionFields(index, type, data){
    var errors = 0;
    data.forEach(item => {

        esClient.index({
            index: index,
            type: type,
            routing: generateRoutingKey(item.client_id),
            body: {
                client_id: item.client_id,
                mongoid: item._id,
                archivedSessions: item.archivedSessions,
                progress: item.progress,
                assessments: item.assessments,
                assessment_conclusion: item.assessment_conclusion,
                diagnoses: item.diagnoses
            }
        }).then(response => console.log(`item indexed fields, ${item.client_id}`))
        .catch(e => {
            ++errors;
            console.log(`${errors} an error occured fields ${item.client_id}`);
            // throw e;
        });
    });
}

function indexSessionArray(index, type, data){
    var errors = 0;
    data.forEach(item => {

        esClient.index({
            index: index,
            type: type,
            routing: generateRoutingKey(item.client_id),
            body: {
                client_id: item.client_id,
                mongoid: item._id,
                sessions: item.sessions
            }
        }).then(response => console.log(`item indexed array ${item.client_id}`))
        .catch(e => {
            ++errors;
            console.log(`${errors} an error occured array ${item.client_id}`);
            // throw e;
        });
    });
}