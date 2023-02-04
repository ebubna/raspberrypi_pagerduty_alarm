const https = require('https');
const fs = require('fs');
const child_process = require('child_process');

const options = {
  hostname: 'api.pagerduty.com',
  port: 443,
  path: '/incidents?sort_by=created_at:desc',
  method: 'GET',
  headers: {
    Accept: 'application/vnd.pagerduty+json;version=2',
    Authorization: 'Token token=YOUR-PAGERDUTY-TOKEN'
  }
};

const checkForIncidents = () => {
  https.get(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      const incidents = JSON.parse(data).incidents;
      if (incidents.length > 0) {
        const mostRecentIncident = incidents[0];
        console.log(mostRecentIncident.summary);

        // Play an MP3 file if there is a current incident
        child_process.exec('mpg123 alarm.mp3', (err, stdout, stderr) => {
          if (err) {
            console.error(err);
          }
        });
      } else {
        console.log('No incidents found.');
      }
    });
  }).on('error', (err) => {
    console.error(err);
  });
  child_process.exit
};


setInterval(checkForIncidents, 60 * 1000); // Check every 60 seconds

checkForIncidents(); // Perform initial check
