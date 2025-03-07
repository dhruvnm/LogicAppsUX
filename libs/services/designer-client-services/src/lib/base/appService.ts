import type { IAppServiceService } from '../appService';
import type { ListDynamicValue } from '../connector';
import type { IHttpClient } from '../httpClient';
import { ResponseCodes, SwaggerParser } from '@microsoft/parsers-logic-apps';
import { ArgumentException, equals, unmap } from '@microsoft/utils-logic-apps';

export interface BaseAppServiceServiceOptions {
  baseUrl: string;
  apiVersion: string;
  subscriptionId: string;
  httpClient: IHttpClient;
}

export class BaseAppServiceService implements IAppServiceService {
  constructor(public readonly options: BaseAppServiceServiceOptions) {
    const { apiVersion, subscriptionId, httpClient } = options;
    if (!apiVersion) {
      throw new ArgumentException('apiVersion required');
    } else if (!subscriptionId) {
      throw new ArgumentException('subscriptionId required');
    } else if (!httpClient) {
      throw new ArgumentException('httpClient required for workflow app');
    }
  }

  async fetchAppServices(): Promise<any> {
    const functionAppsResponse = await this.options.httpClient.get<any>({
      uri: `/subscriptions/${this.options.subscriptionId}/providers/Microsoft.Web/sites`,
      queryParameters: {
        'api-version': this.options.apiVersion,
        propertiesToInclude: 'SiteConfig',
      },
    });

    const apps = functionAppsResponse.value.filter(connectorIsAppService);
    return apps;
  }

  async getOperationSchema(swaggerUrl: string, operationId: string, isInput: boolean): Promise<any> {
    const swagger = await this.fetchAppServiceApiSwagger(swaggerUrl);
    if (!operationId) return Promise.resolve();
    const operation = swagger.getOperationByOperationId(operationId);
    if (!operation) throw new Error('Operation not found');

    const paths = swagger.api.paths[operation.path];
    const rawOperation = paths[operation.method];
    const schema = { type: 'object', properties: {} as any, required: [] as string[] };

    if (isInput) {
      const baseUrl = swagger.api.host
        ? swagger.api.schemes?.length
          ? `${swagger.api.schemes.at(-1)}://${swagger.api.host}`
          : `http://${swagger.api.host}`
        : 'NotFound';
      schema.properties = {
        method: { type: 'string', default: operation.method, 'x-ms-visibility': 'hideInUI' },
        uri: {
          type: 'string',
          default: `${baseUrl}${operation.path}`,
          'x-ms-visibility': 'hideInUI',
          'x-ms-serialization': { property: { type: 'pathtemplate', parameterReference: 'operationDetails.pathParameters' } },
        },
      };
      schema.required = ['method', 'uri'];
      for (const parameter of rawOperation.parameters ?? []) {
        this._addParameterInSchema(schema, parameter);
      }
    } else {
      const { responses } = rawOperation;
      let response: any = {};

      if (responses[ResponseCodes.$200]) response = responses[ResponseCodes.$200];
      else if (responses[ResponseCodes.$201]) response = responses[ResponseCodes.$201];
      else if (responses[ResponseCodes.$default]) response = responses[ResponseCodes.$default];

      if (response.schema) schema.properties['body'] = response.schema;
      if (response.headers) schema.properties['headers'] = response.headers;
    }

    return schema;
  }

  private _addParameterInSchema(finalSchema: any, parameter: any) {
    const schemaProperties = finalSchema.properties;
    const { in: $in, name, required, schema } = parameter;
    switch ($in) {
      case 'header':
      case 'query': {
        const property = $in === 'header' ? 'headers' : 'queries';
        if (!schemaProperties[property]) schemaProperties[property] = { type: 'object', properties: {}, required: [] };
        schemaProperties[property].properties[name] = parameter;
        if (required) schemaProperties[property].required.push(name);
        break;
      }
      case 'path': {
        const pathProperty = 'pathParameters';
        if (!finalSchema.properties[pathProperty]) {
          // eslint-disable-next-line no-param-reassign
          finalSchema.properties[pathProperty] = { type: 'object', properties: {}, required: [] };
          finalSchema.required.push(pathProperty);
        }

        schemaProperties[pathProperty].properties[name] = {
          ...parameter,
          'x-ms-deserialization': { type: 'pathtemplateproperties', parameterReference: `operationDetails.uri` },
        };
        if (required) schemaProperties[pathProperty].required.push(name);
        break;
      }
      default: {
        // eslint-disable-next-line no-param-reassign
        finalSchema.properties[$in] = schema;
        break;
      }
    }
  }

  async getOperations(swaggerUrl: string): Promise<ListDynamicValue[]> {
    const swagger = await this.fetchAppServiceApiSwagger(swaggerUrl);
    const operations = swagger.getOperations();

    return unmap(operations).map((operation: any) => ({
      value: operation.operationId,
      displayName: operation.summary ?? operation.operationId,
      description: operation.description,
    }));
  }

  private async fetchAppServiceApiSwagger(swaggerUrl: string): Promise<any> {
    const response = await this.options.httpClient.get<any>({
      uri: swaggerUrl,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
    const swaggerDoc = await SwaggerParser.parse(response);
    return new SwaggerParser(swaggerDoc);
  }
}

// tslint:disable-next-line: no-any
function connectorIsAppService(connector: any): boolean {
  if (isFunctionContainer(connector.kind)) return false;

  const url = connector?.properties?.siteConfig?.apiDefinition?.url;
  const allowedOrigins = connector?.properties?.siteConfig?.cors;
  return url && allowedOrigins;
}

export function isFunctionContainer(kind: any): boolean {
  if (typeof kind !== 'string') return false;

  const kinds = kind.split(',');
  return (
    kinds.some(($kind) => equals($kind, 'functionapp')) && !kinds.some(($kind) => equals($kind, 'botapp') || equals($kind, 'workflowapp'))
  );
}
