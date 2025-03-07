import Constants from '../../common/constants';
import type { ConnectionReference } from '../../common/models/workflow';
import { updateOutputsAndTokens } from '../actions/bjsworkflow/initialize';
import type { Settings } from '../actions/bjsworkflow/settings';
import { getConnectorWithSwagger } from '../queries/connections';
import { getOperationManifest } from '../queries/operation';
import type { DependencyInfo, NodeInputs, NodeOperation, NodeOutputs, OutputInfo } from '../state/operation/operationMetadataSlice';
import { clearDynamicOutputs, addDynamicOutputs } from '../state/operation/operationMetadataSlice';
import { addDynamicTokens } from '../state/tokensSlice';
import { getBrandColorFromConnector, getIconUriFromConnector } from './card';
import { getTokenExpressionValueForManifestBasedOperation } from './loops';
import { getDynamicOutputsFromSchema, getDynamicSchema } from './parameters/dynamicdata';
import { getAllInputParameters, isDynamicDataReadyToLoad } from './parameters/helper';
import { convertOutputsToTokens } from './tokens';
import { OperationManifestService } from '@microsoft/designer-client-services-logic-apps';
import { generateSchemaFromJsonString, ValueSegmentType } from '@microsoft/designer-ui';
import { getIntl } from '@microsoft/intl-logic-apps';
import type { Expression, ExpressionFunction, ExpressionLiteral, OutputParameter, OutputParameters } from '@microsoft/parsers-logic-apps';
import {
  create,
  OutputKeys,
  OutputSource,
  ExpressionParser,
  ExtensionProperties,
  isTemplateExpression,
  isFunction,
  isStringLiteral,
} from '@microsoft/parsers-logic-apps';
import type { OperationManifest } from '@microsoft/utils-logic-apps';
import {
  getObjectPropertyValue,
  safeSetObjectPropertyValue,
  unmap,
  AssertionErrorCode,
  AssertionException,
  clone,
  equals,
} from '@microsoft/utils-logic-apps';
import type { Dispatch } from '@reduxjs/toolkit';

export const toOutputInfo = (output: OutputParameter): OutputInfo => {
  const {
    key,
    format,
    type,
    isDynamic,
    isInsideArray,
    name,
    itemSchema,
    parentArray,
    title,
    summary,
    description,
    source,
    required,
    visibility,
  } = output;

  return {
    key,
    type,
    format,
    isAdvanced: equals(visibility, Constants.VISIBILITY.ADVANCED),
    name,
    isDynamic,
    isInsideArray,
    itemSchema,
    parentArray,
    title: title ?? summary ?? description ?? name,
    source,
    required,
    description,
  };
};

export const getUpdatedManifestForSpiltOn = (manifest: OperationManifest, splitOn: string | undefined): OperationManifest => {
  const intl = getIntl();
  const invalidSplitOn = intl.formatMessage(
    {
      defaultMessage: `Invalid split on format in '{splitOn}'.`,
      description: 'Error message for invalid split on value.',
    },
    { splitOn }
  );

  if (splitOn === undefined) {
    return manifest;
  } else if (typeof splitOn === 'string') {
    const updatedManifest = clone(manifest);
    if (!isTemplateExpression(splitOn)) {
      throw new AssertionException(AssertionErrorCode.INVALID_SPLITON, invalidSplitOn);
    }

    const parsedValue = ExpressionParser.parseTemplateExpression(splitOn);
    const properties: string[] = [];
    let manifestSection = updatedManifest.properties.outputs;
    if (isSupportedSplitOnExpression(parsedValue)) {
      const { dereferences, name } = parsedValue as ExpressionFunction;
      if (equals(name, 'triggerBody')) {
        properties.push('body');
      }

      if (dereferences.length) {
        properties.push(...dereferences.map((dereference) => (dereference.expression as ExpressionLiteral).value));
      }
    } else {
      throw new AssertionException(AssertionErrorCode.INVALID_SPLITON, invalidSplitOn);
    }

    for (const property of properties) {
      manifestSection = manifestSection.properties ? manifestSection.properties[property] : undefined;

      if (!manifestSection) {
        throw new AssertionException(
          AssertionErrorCode.INVALID_SPLITON,
          intl.formatMessage(
            {
              defaultMessage: `Invalid split on value '{splitOn}', cannot find in outputs.`,
              description: 'Error message for when split on value not found in operation outputs.',
            },
            { splitOn }
          )
        );
      }
    }

    if (manifestSection.type !== Constants.SWAGGER.TYPE.ARRAY) {
      throw new AssertionException(
        AssertionErrorCode.INVALID_SPLITON,
        intl.formatMessage(
          {
            defaultMessage: `Invalid type on split on value '{splitOn}', split on not in array.`,
            description: 'Error message for when split on array is invalid.',
          },
          { splitOn }
        )
      );
    }

    const manifestItems: OpenAPIV2.SchemaObject | undefined = manifestSection.items;
    const clonedManifestItems = clone(manifestItems);
    const clonedManifestProperties = clonedManifestItems?.properties;

    if (clonedManifestProperties) {
      for (const itemName of Object.keys(clonedManifestProperties)) {
        const splitOnItem = clonedManifestProperties[itemName];
        convertSchemaAliasesForSplitOn(splitOnItem);
      }
    }

    updatedManifest.properties.outputs = {
      properties: {
        body: clonedManifestItems,
      },
      type: Constants.SWAGGER.TYPE.OBJECT,
    };

    return updatedManifest;
  }

  throw new AssertionException(AssertionErrorCode.INVALID_SPLITON, invalidSplitOn);
};

const convertSchemaAliasesForSplitOn = (schema: OpenAPIV2.SchemaObject): void => {
  // Copy to local scope since we intentionally want to modify it in-place.
  const schemaLocal = schema;

  const aliasExtension = ExtensionProperties.Alias;
  const originalSchemaAlias = schemaLocal[aliasExtension];
  schemaLocal[aliasExtension] = `body/${originalSchemaAlias}`;

  const schemaProperties = schemaLocal.properties;
  if (schemaProperties) {
    for (const property of Object.values(schemaProperties)) {
      convertSchemaAliasesForSplitOn(property);
    }
  }
};

export const isSupportedSplitOnExpression = (expression: Expression): boolean => {
  if (!isFunction(expression)) {
    return false;
  }

  if (!equals(expression.name, 'triggerBody') && !equals(expression.name, 'triggerOutputs')) {
    return false;
  }

  if (expression.arguments.length > 0) {
    return false;
  }

  if (expression.dereferences.some((dereference) => !isStringLiteral(dereference.expression))) {
    return false;
  }

  return true;
};

export const getSplitOnOptions = (outputs: NodeOutputs): string[] => {
  const arrayOutputs = unmap(outputs.originalOutputs ?? outputs.outputs).filter((output) =>
    equals(output.type, Constants.SWAGGER.TYPE.ARRAY)
  );

  // NOTE: The isInsideArray flag is unreliable, as this is reset when calculating
  // if an output is inside a splitOn array. If the entire body is an array, all other array
  // outputs are nested and should not be included. An array with a parent array is nested and
  // should not be included.
  const bodyLevelArrayMatches = arrayOutputs.filter((output) => output.key === 'body.$');
  if (bodyLevelArrayMatches.length === 1) {
    return bodyLevelArrayMatches.map(getExpressionValue);
  }

  return arrayOutputs.filter((output) => !output.isInsideArray && !output.parentArray).map(getExpressionValue);
};

export const getUpdatedManifestForSchemaDependency = (manifest: OperationManifest, inputs: NodeInputs): OperationManifest => {
  const outputPaths = manifest.properties.outputsSchema?.outputPaths ?? [];
  if (!outputPaths.length) {
    return manifest;
  }

  const updatedManifest = clone(manifest);
  const allInputs = getAllInputParameters(inputs);

  for (const outputPath of outputPaths) {
    const { outputLocation, name, schema } = outputPath;
    const inputParameter = allInputs.find((input) => input.parameterName === name);
    // Parameter value should be of single segment, else its value or schema cannot be identified
    // skipping for all other cases.
    if (inputParameter && inputParameter.value.length === 1) {
      const segment = inputParameter.value[0];
      let schemaToReplace: OpenAPIV2.SchemaObject | undefined;
      switch (schema) {
        case 'Value':
          if (segment.type === ValueSegmentType.LITERAL) {
            try {
              schemaToReplace = JSON.parse(segment.value);
            } catch {} // eslint-disable-line no-empty
          }
          break;

        case 'ValueSchema':
          if (segment.type === ValueSegmentType.TOKEN) {
            // We only support getting schema from array tokens for now.
            if (segment.token?.type === Constants.SWAGGER.TYPE.ARRAY) {
              schemaToReplace = segment.token.arrayDetails?.itemSchema ?? undefined;
            }
          } else {
            // TODO - Add code to generate schema from value input
            schemaToReplace = generateSchemaFromJsonString(segment.value);
          }
          break;

        case 'UriTemplate':
          if (segment.type === ValueSegmentType.LITERAL) {
            const parameterSegments = segment.value ? segment.value.match(/{(.*?)}/g) : undefined;
            if (parameterSegments) {
              const parameters = parameterSegments.map((parameter) => parameter.slice(1, -1));
              schemaToReplace = {
                properties: parameters.reduce((properties: Record<string, any>, parameter: string) => {
                  return {
                    [parameter]: {
                      type: Constants.SWAGGER.TYPE.STRING,
                      title: parameter,
                    },
                  };
                }, {}),
                required: parameters,
              };
            }
          }

          break;

        default:
          break;
      }

      const currentSchemaValue = getObjectPropertyValue(updatedManifest.properties.outputs, outputLocation);
      safeSetObjectPropertyValue(updatedManifest.properties.outputs, outputLocation, { ...currentSchemaValue, ...schemaToReplace });
    }
  }

  return updatedManifest;
};

const getSplitOnArrayName = (splitOnValue: string): string | undefined => {
  if (isTemplateExpression(splitOnValue)) {
    try {
      const parsedValue = ExpressionParser.parseTemplateExpression(splitOnValue);
      if (isSupportedSplitOnExpression(parsedValue)) {
        const { dereferences } = parsedValue as ExpressionFunction;
        return !dereferences.length
          ? undefined
          : dereferences.map((dereference) => (dereference.expression as ExpressionLiteral).value).join('.');
      } else {
        return undefined;
      }
    } catch {
      // If parsing fails, the splitOn expression is not supported.
      return undefined;
    }
  } else {
    // If the value is not an expression, there is no array name.
    return undefined;
  }
};

export const updateOutputsForBatchingTrigger = (outputs: OutputParameters, splitOn: string | undefined): OutputParameters => {
  if (splitOn === undefined) {
    return outputs;
  }

  const splitOnArray = getSplitOnArrayName(splitOn);
  // If splitOn is enabled the output info is not present in the store, hence generate the outputKey from the name.
  const outputKeyForSplitOnArray = splitOnArray ? create([OutputSource.Body, Constants.DEFAULT_KEY_PREFIX, splitOnArray]) : undefined;

  const updatedOutputs: OutputParameters = {};
  for (const outputKey of Object.keys(outputs)) {
    const outputParameter = outputs[outputKey];

    const isParentArrayResponseBody = splitOnArray === undefined && outputParameter.parentArray === OutputKeys.Body;

    const isOutputInSplitOnArray =
      (outputParameter.isInsideArray && isParentArrayResponseBody) || equals(outputParameter.parentArray, splitOnArray);
    // Resetting the InsideArray property for parameters in batching trigger,
    // as for the actions in flow they are body parameters not inside an array.
    if (isOutputInSplitOnArray) {
      outputParameter.isInsideArray = false;
    }

    // Filtering the outputs if it is not equal to the top level array in a batching trigger.
    if (outputParameter.key !== outputKeyForSplitOnArray) {
      updatedOutputs[outputKey] = outputParameter;
    }
  }

  return updatedOutputs;
};

export const loadDynamicOutputsInNode = async (
  nodeId: string,
  isTrigger: boolean,
  operationInfo: NodeOperation,
  connectionReference: ConnectionReference | undefined,
  outputDependencies: Record<string, DependencyInfo>,
  nodeInputs: NodeInputs,
  nodeMetadata: any,
  settings: Settings,
  dispatch: Dispatch
): Promise<void> => {
  for (const outputKey of Object.keys(outputDependencies)) {
    const info = outputDependencies[outputKey];
    dispatch(clearDynamicOutputs(nodeId));

    if (isDynamicDataReadyToLoad(info)) {
      if (info.dependencyType === 'StaticSchema') {
        updateOutputsAndTokens(nodeId, operationInfo, dispatch, isTrigger, nodeInputs, settings, /* shouldProcessSettings */ true);
      } else {
        const outputSchema = await getDynamicSchema(info, nodeInputs, nodeMetadata, operationInfo, connectionReference);
        let schemaOutputs = outputSchema ? getDynamicOutputsFromSchema(outputSchema, info.parameter as OutputParameter) : {};

        if (settings.splitOn?.value?.enabled) {
          schemaOutputs = updateOutputsForBatchingTrigger(schemaOutputs, settings.splitOn?.value?.value);
        }

        const dynamicOutputs = Object.keys(schemaOutputs).reduce((result: Record<string, OutputInfo>, outputKey: string) => {
          const outputInfo = toOutputInfo(schemaOutputs[outputKey]);
          return { ...result, [outputInfo.key]: outputInfo };
        }, {});

        dispatch(addDynamicOutputs({ nodeId, outputs: dynamicOutputs }));

        let iconUri: string, brandColor: string;
        if (OperationManifestService().isSupported(operationInfo.type, operationInfo.kind)) {
          const manifest = await getOperationManifest(operationInfo);
          iconUri = manifest.properties.iconUri;
          brandColor = manifest.properties.brandColor;
        } else {
          const { connector } = await getConnectorWithSwagger(operationInfo.connectorId);
          iconUri = getIconUriFromConnector(connector);
          brandColor = getBrandColorFromConnector(connector);
        }

        dispatch(
          addDynamicTokens({
            nodeId,
            tokens: convertOutputsToTokens(nodeId, operationInfo.type, dynamicOutputs, { iconUri, brandColor }, settings),
          })
        );
      }
    }
  }
};

const getExpressionValue = ({ key, required }: OutputInfo): string => {
  return `@${getTokenExpressionValueForManifestBasedOperation(key, false, undefined, undefined, !!required)}`;
};
