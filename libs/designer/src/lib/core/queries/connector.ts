import { getReactQueryClient } from '../ReactQueryProvider';
import type { ListDynamicValue, ManagedIdentityRequestProperties, TreeDynamicValue } from '@microsoft/designer-client-services-logic-apps';
import { ConnectorService } from '@microsoft/designer-client-services-logic-apps';
import type { FilePickerInfo, LegacyDynamicSchemaExtension, LegacyDynamicValuesExtension } from '@microsoft/parsers-logic-apps';

export const getLegacyDynamicValues = async (
  connectionId: string,
  connectorId: string,
  parameters: Record<string, any>,
  extension: LegacyDynamicValuesExtension,
  parameterArrayType: string,
  managedIdentityProperties?: ManagedIdentityRequestProperties
): Promise<ListDynamicValue[]> => {
  const queryClient = getReactQueryClient();
  const service = ConnectorService();

  return queryClient.fetchQuery(
    [
      'legacydynamicValues',
      connectionId.toLowerCase(),
      connectorId.toLowerCase(),
      extension.operationId?.toLowerCase(),
      getParametersKey(parameters).toLowerCase(),
    ],
    () => service.getLegacyDynamicValues(connectionId, connectorId, parameters, extension, parameterArrayType, managedIdentityProperties)
  );
};

export const getListDynamicValues = async (
  connectionId: string | undefined,
  connectorId: string,
  operationId: string,
  parameterAlias: string | undefined,
  parameters: Record<string, any>,
  dynamicState: any,
  nodeMetadata: any
): Promise<ListDynamicValue[]> => {
  const queryClient = getReactQueryClient();
  const service = ConnectorService();

  return queryClient.fetchQuery(
    [
      'listdynamicvalues',
      (connectionId ?? '').toLowerCase(),
      connectorId.toLowerCase(),
      operationId.toLowerCase(),
      getParametersKey({ ...dynamicState.parameters, ...parameters }),
    ],
    () => service.getListDynamicValues(connectionId, connectorId, operationId, parameterAlias, parameters, dynamicState, nodeMetadata)
  );
};

export const getLegacyDynamicSchema = async (
  connectionId: string,
  connectorId: string,
  parameters: Record<string, any>,
  extension: LegacyDynamicSchemaExtension,
  managedIdentityProperties?: ManagedIdentityRequestProperties
): Promise<OpenAPIV2.SchemaObject | null> => {
  const queryClient = getReactQueryClient();
  const service = ConnectorService();

  return queryClient.fetchQuery(
    [
      'legacydynamicschema',
      connectionId.toLowerCase(),
      connectorId.toLowerCase(),
      extension.operationId?.toLowerCase(),
      getParametersKey(parameters).toLowerCase(),
    ],
    () => service.getLegacyDynamicSchema(connectionId, connectorId, parameters, extension, managedIdentityProperties)
  );
};

export const getDynamicSchemaProperties = async (
  connectionId: string | undefined,
  connectorId: string,
  operationId: string,
  parameterAlias: string | undefined,
  parameters: Record<string, any>,
  dynamicState: any,
  nodeMetadata: any
): Promise<OpenAPIV2.SchemaObject> => {
  const queryClient = getReactQueryClient();
  const service = ConnectorService();

  return queryClient.fetchQuery(
    [
      'dynamicschemaproperties',
      (connectionId ?? '').toLowerCase(),
      connectorId.toLowerCase(),
      operationId.toLowerCase(),
      getParametersKey({ ...dynamicState.parameters, ...parameters }),
      `isInput:${!!dynamicState?.isInput}`,
    ],
    () => service.getDynamicSchema(connectionId, connectorId, operationId, parameterAlias, parameters, dynamicState, nodeMetadata)
  );
};

export const getLegacyDynamicTreeItems = async (
  connectionId: string,
  connectorId: string,
  operationId: string,
  parameters: Record<string, any>,
  extension: LegacyDynamicValuesExtension,
  pickerInfo: FilePickerInfo,
  managedIdentityProperties?: ManagedIdentityRequestProperties
): Promise<TreeDynamicValue[]> => {
  const queryClient = getReactQueryClient();
  const service = ConnectorService();

  return queryClient.fetchQuery(
    [
      'legacydynamictreeitems',
      connectionId.toLowerCase(),
      connectorId.toLowerCase(),
      operationId?.toLowerCase(),
      getParametersKey(parameters).toLowerCase(),
    ],
    () => service.getLegacyDynamicTreeItems(connectionId, connectorId, parameters, extension, pickerInfo, managedIdentityProperties)
  );
};

const getParametersKey = (parameters: Record<string, any>): string => {
  return Object.keys(parameters).reduce(
    (result: string, parameterKey: string) => `${result}, ${parameterKey}-${JSON.stringify(parameters[parameterKey])}`,
    ''
  );
};
