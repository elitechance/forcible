# forcible

## Installation

```bash
npm install --save forcible
```

## Usage

```javascript
import forcible from 'forcible';

async function main() {
  const clientId = '<SALESFORCE_CLIENT_ID>';
  const clientSecret = '<SALESFORCE_CLIENT_SECRET>';
  forcible.config = {
    useSandbox: true,
    clientId: clientId,
    clientSecret: clientSecret
  };
  const username = '<SALESFORCE_USERNAME>';
  const password = '<SALESFORCE_PASSWORD>' + '<SALESFORCE_TOKEN>';
  try {
    const data = await forcible.flow.usernamePassword(username, password);
    logMe(data);
    const versions = await forcible.rest.getVersions();
    logMe('versions', versions);
    const latestVersion = await forcible.rest.getLatestVersion();
    logMe('latest version', latestVersion);
    const response = await forcible.rest.query(
      'SELECT Id FROM Account LIMIT 10'
    );
    logMe(response);
  } catch (error) {
    logMe('error', error);
  }
}

main();

function logMe(...args) {
  // tslint:disable-next-line:no-console
  console.log.apply(console.log, args);
}
```
