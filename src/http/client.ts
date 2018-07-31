import * as http from 'https';
import * as url from 'url';
import * as querystring from 'querystring';
import { HttpResponse } from './response';

export class HttpClient {
  static get(uri: string, options?: any) {
    return new Promise<HttpResponse>((resolve, reject) => {
      const urlOptions = HttpClient.getUrlOptions(uri);
      urlOptions.method = 'GET';
      let httpOptions = { ...urlOptions };
      if (options) {
        httpOptions = { ...httpOptions, ...options };
      }
      let data = '';
      http.get(httpOptions, response => {
        response.on('data', chunk => {
          data += chunk;
        });
        response.on('end', () => {
          resolve({ body: data, statusCode: response.statusCode });
        });
        response.on('error', error => {
          reject({ message: 'Error during request', trace: error });
        });
      });
    });
  }

  static post(uri: string, postData: any) {
    return new Promise<HttpResponse>((resolve, reject) => {
      let data = '';
      if (!uri) {
        reject({ message: 'Invalid url' });
        return;
      }
      const options = HttpClient.getUrlOptions(uri);

      const strData = querystring.stringify(postData);
      options.method = 'POST';
      options.headers = {
        'content-type': 'application/x-www-form-urlencoded',
        'content-length': Buffer.byteLength(strData)
      };
      const request = http.request(options, response => {
        response.on('data', chunkData => {
          data += chunkData;
        });
        response.on('end', chunkData => {
          const httpResponse: HttpResponse = {
            body: data,
            statusCode: response.statusCode
          };
          resolve(httpResponse);
        });
        response.on('error', error => {
          reject({ message: 'Error during post', trace: error });
        });
      });

      request.on('error', error => {
        reject({ message: 'Error during request', trace: error });
      });
      request.write(strData);
      request.end();
    });
  }

  private static getPort(uri: string) {
    if (uri.startsWith('https')) {
      return 443;
    }
    return 80;
  }

  private static getUrlOptions(uri): any {
    const urlInfo = url.parse(uri);
    return {
      host: urlInfo.host,
      path: urlInfo.path,
      port: urlInfo.port ? urlInfo.port : HttpClient.getPort(uri)
    };
  }
}
