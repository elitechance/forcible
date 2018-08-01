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
      http.get(httpOptions, response => {
        HttpClient.manageResponse(response, resolve, reject);
      });
    });
  }

  static form(uri: string, postData: any) {
    return new Promise<HttpResponse>((resolve, reject) => {
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
        HttpClient.manageResponse(response, resolve, reject);
      });
      request.on('error', error => {
        reject({ message: 'Error during request', trace: error });
      });
      request.write(strData);
      request.end();
    });
  }

  static post(uri: string, options: any, postData: any) {
    return HttpClient.manageWrite('POST', uri, options, postData);
  }

  static patch(uri: string, options: any, postData: any) {
    return HttpClient.manageWrite('PATCH', uri, options, postData);
  }

  static delete(uri: string, options: any) {
    return HttpClient.manageWrite('DELETE', uri, options);
  }

  private static manageWrite(
    method: string,
    uri: string,
    options: any,
    postData?: any
  ) {
    return new Promise<HttpResponse>((resolve, reject) => {
      if (!uri) {
        reject({ message: 'Invalid url' });
        return;
      }
      let urlOptions = HttpClient.getUrlOptions(uri);
      const strData = postData ? JSON.stringify(postData) : '';
      urlOptions.method = method;
      urlOptions = { ...urlOptions, ...options };
      if (method !== 'DELETE') {
        urlOptions.headers['content-type'] = 'application/json';
        urlOptions.headers['content-length'] = Buffer.byteLength(strData);
      }
      const request = http.request(urlOptions, response => {
        HttpClient.manageResponse(response, resolve, reject);
      });
      request.on('error', error => {
        reject({ message: 'Error during request', trace: error });
      });
      request.write(strData);
      request.end();
    });
  }

  private static manageResponse(response, resolve, reject) {
    let data = '';
    response.on('data', chunkData => {
      data += chunkData;
    });
    response.on('end', chunkData => {
      const httpResponse: HttpResponse = {
        body: data,
        statusCode: response.statusCode,
        message: response.statusMessage
      };
      resolve(httpResponse);
    });
    response.on('error', error => {
      reject({ message: 'Error during post', trace: error });
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
