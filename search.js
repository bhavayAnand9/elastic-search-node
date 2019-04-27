'use strict';

//Some const values
const index_name_for_session_array = 'test_session_array';
const index_name_for_session_fields = 'test_session_fields';
const elasticsearch = require('elasticsearch');
const util = require('util');


//DEFINE SEARCH QUERY HERE
const que2 = 'glass ' + '~';
const que= 'glass OR jesus' + '~';
const que3 = '5cb7bca0c6726e001f3f5d92';


const esClient = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'error'
});


// SEARCH QUERY FUNCTION CALL
//UNCOMMENT FUNCTIONS THAT YOU NEED TO RUN
// querySessionArray(index_name_for_session_array, '_doc', que);
// querySessionFields(index_name_for_session_fields, '_doc', que);
// querySessionArrayWithClientID(index_name_for_session_array, '_doc', que3);

//HELPER FUNCTIONS

function generateRoutingKey(hex){
    return parseInt(hex.toString().slice(-11), 16)%7;
}


//DIFFERENT SEARCH QUERY FUNCTIONS DEFINITIONS

//SEARCHES SESSIONS FIELD INDEX FOR A QUERY STRING
async function querySessionFields(index, type, data){
    // const { hits } = await esClient.search({
      const body = await esClient.search({
        index: index_name_for_session_fields,
        body: {
          query: {
            bool: {
              must: [
                {
                  match: {
                    active: true
                  }
                },
                {
                  query_string: {
                    fields: ["diagnoses", "assessment_conclusion", "assessments", "progress", "client_id", "archivedSessions"],
                    query: que
                  }
                }
              ]
            }

          }
        }
    });
    console.log(body);
}

//SEARCHES SESSIONS ARRAY INDEX FOR A QUERY STRING
async function querySessionArray(index, type, data){
  // const { hits } = await esClient.search({
    const body = await esClient.search({  
      index: index_name_for_session_array,
      type: type,
      body: {
        query: {
          bool: {
            must: [
              {
                match: {
                  active: true
                }
              },
              {
                query_string: {
                  query: data
                }
              }
            ]
          }
        }
      }
  });
  console.log(body);
}

//FOR THIS FUNCTION DATA SHOULD BE A CLIENTID STRING
async function querySessionArrayWithClientID(index, type, data){
  // const { hits } = await esClient.search({
    const body  = await esClient.search({
      index: index_name_for_session_array,
      type: type,
      routing: generateRoutingKey(data),
      body: {
        query: {
          bool: {
            must: [
              {
                match: {
                  active: true
                }
              },
              {
                query_string: {
                  query: data
                }
              }
            ]
          }
        }
      }
    });
  console.log(body);
}