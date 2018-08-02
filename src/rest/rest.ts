import * as querystring from 'querystring';

import { Flow } from '../flow/flow';
import { HttpClient } from '../http/client';
import { HttpResponse } from '../http/response';

export class Rest {
  private DEFAULT_SERVICE = '/services/data/v20.0';
  private _flow: Flow;
  private _versions: string[];

  private _servicePath: string;
  set servicePath(path: string) {
    this._servicePath = path;
  }
  get servicePath() {
    return this._servicePath;
  }

  private _accessToken: string;
  set accessToken(token: string) {
    this._accessToken = token;
  }
  get accessToken() {
    return this._accessToken;
  }

  private _tokenType: string;
  set tokenType(type: string) {
    this._tokenType = type;
  }
  get tokenType() {
    return this._tokenType;
  }

  private _instanceUrl: string;
  set instanceUrl(url: string) {
    this._instanceUrl = url;
  }
  get instanceUrl() {
    return this._instanceUrl;
  }

  constructor(flow: Flow) {
    this._flow = flow;
    this._servicePath = this.DEFAULT_SERVICE;
  }

  async createRecord(objectName: string, item: any) {
    const path = this._servicePath + '/sobjects/' + objectName + '/';
    const response = await this.serviceReq(path, 'POST', item);
    return this.serviceResponse(response);
  }

  async updateRecord(objectName: string, id: string, item: any) {
    const path = this._servicePath + '/sobjects/' + objectName + '/' + id + '/';
    const response = await this.serviceReq(path, 'PATCH', item);
    return this.serviceResponse(response);
  }

  async deleteRecord(objectName: string, id: string) {
    const path = this._servicePath + '/sobjects/' + objectName + '/' + id;
    const response = await this.serviceReq(path, 'DELETE');
    return this.serviceResponse(response);
  }

  async versions() {
    try {
      if (this._versions) {
        return this._versions;
      }
      const response = await this.serviceReq('/services/data/');
      if (response.body) {
        return JSON.parse(response.body);
      } else {
        return [];
      }
    } catch (error) {
      return [];
    }
  }

  async resourceByVersion() {
    const response = await this.serviceReq(this._servicePath + '/');
    return this.serviceResponse(response);
  }

  async limits() {
    const response = await this.serviceReq(this._servicePath + '/limits/');
    return this.serviceResponse(response);
  }

  async describeGlobal() {
    const response = await this.serviceReq(this._servicePath + '/sobjects/');
    return this.serviceResponse(response);
  }

  async sObjectBasicInfo(objectName: string) {
    const response = await this.serviceReq(
      this._servicePath + '/sobjects/' + objectName
    );
    return this.serviceResponse(response);
  }

  async sObjectDescribe(objectName: string) {
    const response = await this.serviceReq(
      this._servicePath + '/sobjects/' + objectName + '/describe/'
    );
    return this.serviceResponse(response);
  }

  // TODO
  // sObjectGetDeleted
  // sObjectGetUpdated

  async sObjectNamedLayouts(objectName: string, layoutName: string) {
    const response = await this.serviceReq(
      this._servicePath +
        '/sobjects/' +
        objectName +
        '/describe/namedLayouts/' +
        layoutName
    );
    return this.serviceResponse(response);
  }

  async sObjectRichTextImageRetrieve(
    objectName: string,
    id: string,
    fieldName: string,
    contentReferenceId: string
  ) {
    const response = await this.serviceReq(
      this._servicePath +
        '/sobjects/' +
        objectName +
        '/' +
        id +
        '/richTextImageFields/' +
        fieldName +
        '/' +
        contentReferenceId
    );
    return this.serviceResponse(response);
  }

  async sObjectRows(objectName: string, id: string, fields?: string[]) {
    let query = this._servicePath + '/sobjects/' + objectName + '/' + id;
    if (fields) {
      query += '/?fields=' + fields.join(',');
    }
    const response = await this.serviceReq(query);
    return this.serviceResponse(response);
  }

  async sObjectRowsByExternalId(
    objectName: string,
    fieldName: string,
    fieldValue: string,
    method?: string
  ) {
    const query =
      this._servicePath +
      '/sobjects/' +
      objectName +
      '/' +
      fieldName +
      '/' +
      fieldValue;
    const response = await this.serviceReq(query, method);
    return this.serviceResponse(response);
  }

  async sObjectApprovalLayouts(objectName: string) {
    const response = await this.serviceReq(
      this._servicePath +
        '/sobjects/' +
        objectName +
        '/describe/approvalLayouts/'
    );
    return this.serviceResponse(response);
  }

  async sObjectCompactLayouts(objectName: string) {
    const response = await this.serviceReq(
      this._servicePath +
        '/sobjects/' +
        objectName +
        '/describe/compactLayouts/'
    );
    return this.serviceResponse(response);
  }

  async sObjectDescribeLayouts(objectName?: string) {
    let properObjectName = 'Global';
    if (objectName) {
      properObjectName = objectName;
    }
    const response = await this.serviceReq(
      this._servicePath + '/sobjects/' + properObjectName + '/describe/layouts/'
    );
    return this.serviceResponse(response);
  }

  async sObjectPlatformAction() {
    const response = await this.serviceReq(
      this._servicePath + '/sobjects/PlatformAction/'
    );
    return this.serviceResponse(response);
  }

  // TODO
  // sObjectRelationship
  // sObjectBlobRetrieve

  async sObjectQuickActions(
    objectName: string,
    actionName?: string,
    option?: string,
    parentId?: string,
    postData?: any,
    method?: string
  ) {
    let query = this._servicePath + '/sobjects/' + objectName + '/quickActions';
    if (actionName) {
      query += '/' + actionName;
    }
    if (option) {
      query += '/' + option;
    }
    if (parentId) {
      query += '/' + parentId;
    }
    const response = await this.serviceReq(query, method, postData);
    return this.serviceResponse(response);
  }

  // TODO
  // sObjectSuggestedArticles
  // sObjectUserPassword
  // platformEventSchemaByEventName
  // platformEventSchemaById
  // appMenu
  // compactLayouts
  // invocableActions
  // parameterizedSearch
  // processApprovals
  // processRules

  async query(soql: string) {
    const strQuery = querystring.stringify({ q: soql });
    const response = await this.serviceReq(
      this._servicePath + '/query/?' + strQuery
    );
    return this.serviceResponse(response);
  }

  async queryAll(soql: string) {
    const strQuery = querystring.stringify({ q: soql });
    const response = await this.serviceReq(
      this._servicePath + '/queryAll/?' + strQuery
    );
    return this.serviceResponse(response);
  }

  async quickActions() {
    const query = this._servicePath + '/quickActions/';
    const response = await this.serviceReq(query);
    return this.serviceResponse(response);
  }

  async recentViewedItems() {
    const response = await this.serviceReq(this._servicePath + '/recent');
    return this.serviceResponse(response);
  }

  async recordCount() {
    const response = await this.serviceReq(
      this._servicePath + '/limit/recordCount'
    );
    return this.serviceResponse(response);
  }

  async relevantItems() {
    const response = await this.serviceReq(
      this._servicePath + '/sobjects/relevantItems'
    );
    return this.serviceResponse(response);
  }

  async search(sosl: string) {
    const strQuery = querystring.stringify({ q: sosl });
    const response = await this.serviceReq(
      this._servicePath + '/search/?' + strQuery
    );
    return this.serviceResponse(response);
  }

  async searchScopeAndOrder() {
    const response = await this.serviceReq(
      this._servicePath + '/search/scopeOrder'
    );
    return this.serviceResponse(response);
  }

  // TODO
  // searchSuggestedArticleTitleMatches
  // searchSuggestedQueries

  async tabs() {
    const response = await this.serviceReq(this._servicePath + '/tabs');
    return this.serviceResponse(response);
  }

  async themes() {
    const response = await this.serviceReq(this._servicePath + '/theme');
    return this.serviceResponse(response);
  }

  async latestVersion() {
    const versions = await this.versions();
    let currentVersion = 0;
    let parseVersion = 0;
    let currentObject: any = { version: '0.0', url: '', label: '' };
    for (const version of versions) {
      parseVersion = parseFloat(version.version);
      if (currentVersion < parseVersion) {
        currentVersion = parseVersion;
        currentObject = version;
      }
    }
    return currentObject;
  }

  private serviceReq(servicePath: string, method?: string, postData?: any) {
    let tokenType = 'Bearer';
    let token;
    let instanceUrl;
    if (this._flow.lastResponse) {
      if (this._flow.lastResponse.token_type) {
        tokenType = this._flow.lastResponse.token_type;
      }
      token = this._flow.lastResponse.access_token;
      instanceUrl = this._flow.lastResponse.instance_url;
    }

    if (this._tokenType) {
      tokenType = this._tokenType;
    }
    if (this._accessToken) {
      token = this._accessToken;
    }
    if (this._instanceUrl) {
      instanceUrl = this._instanceUrl;
    }
    const options = { headers: { authorization: tokenType + ' ' + token } };
    const url = instanceUrl + servicePath;
    let properMethod = 'GET';
    if (method) {
      properMethod = method;
    }

    switch (properMethod) {
      case 'GET':
        return HttpClient.get(url, options);
      case 'POST':
        return HttpClient.post(url, options, postData);
      case 'PATCH':
        return HttpClient.patch(url, options, postData);
      case 'DELETE':
        return HttpClient.delete(url, options);
      default:
        return HttpClient.get(url, options);
    }
  }

  private serviceResponse(response: HttpResponse) {
    if (response.statusCode === 200 && response.body) {
      return JSON.parse(response.body);
    } else if (response.statusCode === 204) {
      return JSON.parse('');
    }
    return {
      error: true,
      body: response.body ? JSON.parse(response.body) : '',
      statusMessage: response.message,
      statusCode: response.statusCode
    };
  }
}
