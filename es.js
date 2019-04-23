'use strict';

const elasticsearch = require('elasticsearch');
const mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const util = require('util');

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
        console.log(util.isArray(result)? 'yes, its an array': 'no its not an array');
        // var result2 = JSON.stringify(result);
        mongoToJSON(result);
        db.close();
    });
})

function bulkIndex(index, type, data){
    console.log(data[0].client_id, data[0].sessions);
    let bulkBody = [];
    data.forEach(item => {
        bulkBody.push({
            _index: index,
            _type: type,
            _id: item._id
        })

        bulkBody.push({
            client_id: item.client_id,
            sessions: item.sessions
        })
    });

    console.log(...bulkBody);
}

function mongoToJSON(data){
    console.log(typeof data);
    bulkIndex('sessionArr', '_doc', data);
}