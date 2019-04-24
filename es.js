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
    else console.log('Elastic Search Cluster Is Connected');
});

MongoClient.connect(url, {useNewUrlParser: true},  function(err, db){
    if(err) throw err;
    var dbo = db.db('rxclinic_test');
    var collection = dbo.collection('sessions');
    collection.find().toArray(function(err, result){
        if(err) throw err;
        // var result2 = JSON.stringify(result);
        mongoToJSON(result);
        db.close();
    });
})

function generateRoutingKey(hex){
    // console.log(hex);
    return parseInt(hex.toString().slice(-11), 16)%7;
}

function bulkIndex(index, type, data){
    // console.log(data[0].client_id, data[0].sessions);
    // let bulkBody = [];
    data.forEach(item => {
        // bulkBody.push({
        //     _index: index,
        //     _type: type,
        //     _id: item._id
        // })
        esClient.index({
            index: index,
            type: "_doc",
            routing: generateRoutingKey(item.client_id),
            body: {
                client_id: {
                    $oid: item.client_id
                },
                sessions: item.sessions
            }
        }).then(response => console.log(`item indexed, ${item.client_id}`))
        .catch(e => {
            console.log(`an error occured ${item.client_id}`);
            // throw e;
        });

        // bulkBody.push({
        //     client_id: item.client_id,
        //     sessions: item.sessions
        // })
    });

    // esClient.bulk({body: bulkBody, routing: calculateRoutingValue()})
}

function mongoToJSON(data){
    bulkIndex('temp', '_doc', data);
}