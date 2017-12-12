var request = require('request');
const { Client } = require('pg');

// PARTICLE PHOTON
var device_id = '32002b001347353136383631';
var access_token = 'e8ba164bb777f60ae0e9529a3bf809e7ebdf53c2';
var particle_variable = 'workData';
var device_url = 'https://api.particle.io/v1/devices/' + device_id + '/' + particle_variable + '?access_token=' + access_token;

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'zeynoustun';
db_credentials.host = 'labordata.cp4pyp6nced4.us-east-1.rds.amazonaws.com';
db_credentials.database = 'laborhours';
db_credentials.password = 'zyler2016';
db_credentials.port = 5432;

var getAndWriteData = function() {
    // Make request to the Particle API to get sensor values
    request(device_url, function(error, response, body) {
        // Store sensor values in variables
        var device_json_string = JSON.parse(body).result;
        var Light = JSON.parse(device_json_string).Light;
        var Tilt = JSON.parse(device_json_string).Tilt;

        // Connect to the AWS RDS Postgres database
        const client = new Client(db_credentials);
        client.connect();

        // Construct a SQL statement to insert sensor values into a table
        var thisQuery = "INSERT INTO zeynoLabor VALUES (" + Light + "," + Tilt + ", DEFAULT);";
        console.log(thisQuery); // for debugging

        // Connect to the AWS RDS Postgres database and insert a new row of sensor values
        client.query(thisQuery, (err, res) => {
            console.log(err, res);
            client.end();
        });
    });
};

// write a new row of sensor data every five minutes
setInterval(getAndWriteData, 60000);
