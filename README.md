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
  forcible.setConfig({
    useSandbox: true,
    clientId: clientId,
    clientSecret: clientSecret
  });
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

## Using Typescript

```typescript
import * as forcible from 'forcible';
...

async function main() {
  try {
    await forcible.flow.usernamePassword(username, password);
    console.log('Authenticated', forcible.flow.isAuthenticated);

    const latestVersion = await forcible.rest.latestVersion();
    forcible.rest.servicePath = latestVersion.url;
    const records = await forcible.rest.query(
      'SELECT Id, Name, BilingCity FROM Account LIMIT 5'
    );
    console.log(records);

  } catch (error) {
    console.log(error);
  }
}

main();
```

## Common REST calls

- forcible.rest.`createRecord`(objectName: string, recordInfo: any);
- forcible.rest.`updateRecord`(objectName: string, id: string, recordInfo: any);
- forcible.rest.`deleteRecord`(objectName: string, id: string);
