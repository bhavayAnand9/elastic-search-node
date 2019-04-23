'use strict';

const elasticsearch = require('elasticsearch');
const mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017/';

const esClient = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'error'
});

esClient.ping({
    requestTimeout: 10000
}, function(err){
    if(err) console.trace('ES cluster is down.');
    else console.log('All is well');
});

MongoClient.connect(url, {useNewUrlParser: true},  function(err, db){
    if(err) throw err;
    var dbo = db.db('rxclinic_test');
    var collection = dbo.collection('sessions');
    collection.find().toArray(function(err, result){
        if(err) throw err;
        var result2 = JSON.stringify(result);
        mongoToJSON(result2);
        db.close();
    });
})

function bulkIndex(index, type, data){
    let bulkBody = [];
    data.forEach(item => {
        bulkBody.push({
            _index: index,
            _type: type,
            _id: item._id
        })

        bulkBody.push({
            client_id: data.client_id,
            sessions: data.sessions
        })
    });
}

function mongoToJSON(result2){
    console.log(result[0]);
    bulkIndex('sessionArr', '_doc', result2);
}