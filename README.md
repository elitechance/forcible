# forcible

NodeJS client for Salesforce REST API

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

async function main() {
...
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

- forcible.rest.`createRecord`(objectName: string, recordInfo: any)
- forcible.rest.`updateRecord`(objectName: string, id: string, recordInfo: any)
- forcible.rest.`deleteRecord`(objectName: string, id: string)

```typescript
...
try {
  const id = '001W000000fMa9fIAC'
  const response = await forcible.rest.updateRecord('Account', id, {BillingCity: 'New City'})
  if (!response.error) {
    console.log('Update success', id)
  }
} catch (error) {
  console.log(error)
}
...
```

## Other methods found in [Salesforce reference](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/resources_list.htm)

- forcible.rest.`versions`()
- forcible.rest.`resourceByVersion`()
- forcible.rest.`limits`()
- ...
- forcible.rest.`sobjectRows`(objectName: string, id: string, fields?: string[])
- ...

## TODO

- sObjectGetDeleted
- sObjectGetUpdated
- sObjectRelationship
- sObjectBlobRetrieve
- sObjectSuggestedArticles
- sObjectUserPassword
- platformEventSchemaByEventName
- platformEventSchemaById
- appMenu
- compactLayouts
- invocableActions
- parameterizedSearch
- processApprovals
- processRules
- searchSuggestedArticleTitleMatches
- searchSuggestedQueries
