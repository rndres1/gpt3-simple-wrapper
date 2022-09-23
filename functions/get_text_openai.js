// get text and also save the data to airtable immediately

const { Configuration, OpenAIApi } = require("openai");
const axios = require("axios");
var Airtable = require('airtable');
const fs = require('fs');
const {parse, stringify, toJSON, fromJSON} = require('flatted'); // for "circular" JSON structure apparently being returned by content moderation API endpoint (??)


const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

var AIRTABLE_TOKEN = process.env.AIRTABLE_AUTH_TOKEN
const p_modelname = "text-davinci-002";
const p_temperature = 0.7;
const p_maxtokens = 500;


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

exports.handler = async event => {
    // https://stackoverflow.com/a/72026511
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 501,
            body: 'GET NOT ALLOWED HERE',
            headers: {'content-type': 'application/json', 'Allow': 'POST'}
        }
    }
    if (event.body) {
        s1 = event.body;
        var ext_body = JSON.parse(s1);
        var user_query = ext_body.query; // the "query" field is defined in frontend
        //var user_temperature = parseFloat(ext_body.temperature);
        var user_temperature = p_temperature; // removed the slider, constant temperature value
        var user_authtoken = ext_body.authToken;
    }
   

    // moderation endpoint
   /*  mod_url = "https://api.openai.com/v1/moderations"
    const mod_headers = {
        'Content-Type': `application/json`,
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    }
    mod_data = `{"input": ${JSON.stringify(user_query)}}`;
    axios.post(mod_url, mod_data, {
        headers: mod_headers
      })
      .then((res) => {
        //console.log("RESPONSE RECEIVED: ", res);
        fs.writeFileSync('moderation_API_response.json', stringify(res));
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      }) */



    const openai = new OpenAIApi(configuration);

    var api_response = await openai.createCompletion({
        model: p_modelname,
        prompt: user_query,
        max_tokens: p_maxtokens,
        temperature: user_temperature
    });
    //console.log(api_response.data.choices[0].text);    

    // =========== save the text to Airtable base "" =======

    var base = new Airtable({apiKey: AIRTABLE_TOKEN}).base('app4q2AV24FrpSm2g'); 
    var table = base('GPT3_davinci_');

    var newData = [
        {
            "fields": {
                "prompt": user_query,
                "response": api_response.data.choices[0].text,
                "temperature": user_temperature,
                "token": user_authtoken
            }
        }
    ]
    console.log(newData);

    await table.create(newData, {typecast: true}, function(err, records) {
        if (err) {
          console.error(err);
          return;
        }
        records.forEach(function (record) {
          console.log(record.getId());
        });
      });

    await sleep(100); // workaround for the Airtable nowrite problem -- DO NOT DELETE
 
    return {
        statusCode: 200,
        body: api_response.data.choices[0].text
        //body: "UNCOMMENT THE CODE"
    }
}