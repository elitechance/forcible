# forcible

## Installation

```bash
npm install --save forcible
```

## Usage Javascript

```javascript
var forcible = require('forcible');

function main() {
  var clientId = '<SALESFORCE_CLIENT_ID>';
  var clientSecret = '<SALESFORCE_CLIENT_SECRET>';
  forcible.config = {
    useSandbox: true,
    clientId: clientId,
    clientSecret: clientSecret
  };
  var username = '<SALESFORCE_USERNAME>';
  var password = '<SALESFORCE_PASSWORD>' + '<SALESFORCE_TOKEN>';
  try {
    forcible.flow.usernamePassword(username, password).then(function(data) => {
      console.log(data);
      forcible.rest.query( 'SELECT Id FROM Account LIMIT 10').then(function(response) {
        console.log(response);
      });
    });
  } catch (error) {
    console.log('error', error);
  }
}

main();
```
