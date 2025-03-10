import { getIntl } from '@microsoft/intl-logic-apps';
import type { Schema } from '@microsoft/parsers-logic-apps';

export type StaticResultRootSchemaType = OpenAPIV2.SchemaObject & {
  properties: {
    status: Schema;
    code: Schema;
    error: Schema;
    outputs?: Schema;
  };
};

const ValidResponseCodes = [
  'NotSpecified',
  'InternalServerError',
  'ServerTimeout',
  'AuthorizationFailed',
  'BadRequest',
  'InvalidRequestContent',
  'UnsupportedContentEncoding',
  'UnsupportedMediaType',
  'MissingSubscription',
  'MismatchingWorkflowName',
  'MismatchingWorkflowAccessKeyName',
  'MismatchingResourceGroupName',
  'MismatchingSubscription',
  'InvalidWorkflow',
  'WorkflowNotFound',
  'WorkflowVersionNotFound',
  'EnabledRegionalWorkflowsQuotaExceeded',
  'EnabledHostingPlanWorkflowsQuotaExceeded',
  'SubscriptionNotFound',
  'SubscriptionMissingTenantId',
  'ReadOnlyDisabledSubscription',
  'InvalidContinuationToken',
  'InvalidTopInQueryString',
  'WorkflowRunNotFound',
  'WorkflowRunOperationNotFound',
  'WorkflowRunActionNotFound',
  'WorkflowRunActionRequestHistoryNotFound',
  'InvalidPatchWorkflowRequest',
  'InvalidWorkflowTriggerName',
  'InvalidWorkflowTriggerRecurrence',
  'InvalidWorkflowTriggerRecurrenceSchedule',
  'InvalidWorkflowRunAction',
  'InvalidWorkflowRunActionName',
  'InvalidVariableName',
  'InvalidStaticResultName',
  'InvalidTemplate',
  'ActionSkipped',
  'ActionAborted',
  'ActionIgnored',
  'ActionDependencyFailed',
  'ActionConditionFailed',
  'ActionUntilConditionFailed',
  'WorkflowRunActionUntilLimitInvalid',
  'InvalidWorkflowAccessKey',
  'WorkflowAccessKeyNotFound',
  'WorkflowAccessKeyQuotaExceeded',
  'WorkflowTriggerNotFound',
  'WorkflowTriggerTypeUnsupported',
  'WorkflowTriggerInputsPropertyMissing',
  'WorkflowTriggerInputsPropertyInvalid',
  'WorkflowTriggerInputsPropertyUnsupported',
  'WorkflowActionInputsPropertyUnsupported',
  'WorkflowRunActionTypeUnsupported',
  'WorkflowRunActionInputsPropertyMissing',
  'UnsupportedWorkflowStateFilterValue',
  'UnsupportedWorkflowStatusFilterValue',
  'WorkflowTriggerHistoryNotFound',
  'PreviewFeaturesNotAllowed',
  'InvalidHostName',
  'MissingApiVersionParameter',
  'InvalidApiVersionParameter',
  'MissingClientIpInformation',
  'IPBlacklisted',
  'WorkflowRequestsThrottled',
  'RequestsThrottled',
  'InvalidActionRepeatExpression',
  'PageSizeLimitExceeded',
  'IntegrationAccountNotEnabled',
  'WorkflowNotEnabled',
  'WorkflowNotDisabled',
  'WorkflowOutputParameterUnsupportedType',
  'PushTriggerNameNotUnique',
  'InvalidSku',
  'ActionCancelled',
  'WorkflowRunCanNotBeCancelled',
  'WorkflowRunCanNotBeDeletedDueToStatus',
  'WorkflowRunCanNotBeDeletedDueToCreationTime',
  'WorkflowTriggerIsNotEnabled',
  'WorkflowTriggerAlreadyRunning',
  'WorkflowAccessKeyCanNotBeDeleted',
  'TooManyConcurrentRequests',
  'ServiceTemporarilyUnavailable',
  'DestinationWorkflowExists',
  'SourceWorkflowDoesNotExist',
  'ResourceMoveLimitExceeded',
  'MultipleErrorsOccurred',
  'NoMicrosoftLogicResourcesToMove',
  'WorkflowLocked',
  'WorkflowAuthenticationTypeNotSupported',
  'WorkflowManagedServiceIdentityNotSpecified',
  'SubscriptionMoveNotSupportedInRenameApi',
  'InvalidOperationId',
  'AsyncOperationNotFound',
  'AsyncOperationCompletedUnexpectedly',
  'OutputParameterEvaluationFailed',
  'ActionFailed',
  'WorkflowTriggerNotReady',
  'WorkflowTriggerCompleted',
  'ApiNotIntroduced',
  'ApiDeprecated',
  'DirectApiAuthorizationRequired',
  'WorkflowRunNotRunning',
  'WorkflowRunActionNotReady',
  'WorkflowRunActionAlreadyRun',
  'ActionTimedOut',
  'ApiNotSupported',
  'WorkflowRunActionResponseStatusCodeNotSupported',
  'InvalidQueryFilter',
  'InvalidQuerySearch',
  'InvalidSwagger',
  'HealthCheckRequestsThrottled',
  'InvalidHealthCheckType',
  'WorkflowTriggerVersionNotFound',
  'InvalidWorkflowTriggerVersionId',
  'WorkflowTriggerVersionNotLatest',
  'WorkflowCannotHaveSkuAtTopLevel',
  'WorkflowConsumptionSkuNotSupportedForApiVersion',
  'WorkflowHostingPlanNotSupportedForApiVersion',
  'CannotUpdateHostingPlanBasedWorkflowWithEmptySkuProperty',
  'CannotUpdateConsumptionBasedWorkflowWithNonemptySkuProperty',
  'PatchWorkflowSkuTierNotSpecified',
  'PatchWorkflowPropertiesNotSupported',
  'PatchSkuForConsumptionWorkflowNotSupported',
  'WorkflowUnsupportedRecurrenceTriggerForResponseAction',
  'WorkflowUnsupportedSplitOnTriggerForResponseAction',
  'WorkflowUnsupportedBatchTriggerForResponseAction',
  'ActionResponseSkipped',
  'ActionResponseAlreadyDefined',
  'ActionResponseTimedOut',
  'ClientClosedRequest',
  'NoResponse',
  'ResponseTimeout',
  'ApiNotFound',
  'ApiConnectionNotFound',
  'MissingApiName',
  'MissingApiConnectionName',
  'InvalidApiDefinition',
  'InvalidApiConnection',
  'InvalidApiConnectionApiReference',
  'MissingQueryFilter',
  'InvalidExportInQueryString',
  'ApiSwaggerNotFound',
  'MissingWorkflowTriggerInputs',
  'InvalidWorkflowTriggerInputs',
  'InvalidApiConnectionName',
  'MissingConsentLinksDefinition',
  'ConnectionsParameterInvalid',
  'RequestBodyNotSupported',
  'GatewayTimeout',
  'InvalidGatewayHost',
  'BadGatewayConnection',
  'BadGateway',
  'InvalidResourceName',
  'MismatchingIntegrationAccountName',
  'EnabledRegionalIntegrationAccountsQuotaExceeded',
  'EnabledIntegrationAccountsInIntegrationServiceEnvironmentQuotaExceeded',
  'InvalidIntegrationAccount',
  'IntegrationAccountNotFound',
  'InvalidPatchIntegrationAccountRequest',
  'WorkflowRunActionInputsMissingProperty',
  'WorkflowActionWorkflowIdMalformed',
  'WorkflowRunActionInvalidHostInput',
  'NestedWorkflowNotFound',
  'SchemaNotFound',
  'NoSchemaResolved',
  'MultipleSchemasResolved',
  'MapNotFound',
  'CertificateNotFound',
  'PartnerNotFound',
  'AgreementNotFound',
  'RosettaNetProcessConfigurationNotFound',
  'AssemblyNotFound',
  'InvalidOperationOnCertificate',
  'OperationNotAllowed',
  'KeyVaultNotFound',
  'KeyVaultOperationFailed',
  'SessionNotFound',
  'SessionIsLatestPreconditionFailed',
  'SessionIsNotLatestPreconditionFailed',
  'SessionAlreadyDeletedOrDoesNotExist',
  'InvalidEtag',
  'UnsupportedHttpHeader',
  'InvalidSchema',
  'UnsupportedSchemaTypeFilter',
  'UnsupportedMapTypeFilter',
  'UnsupportedPartnerTypeFilter',
  'UnsupportedAgreementTypeFilter',
  'UnsupportedSchemaTypeFilterValue',
  'UnsupportedMapTypeFilterValue',
  'UnsupportedPartnerTypeFilterValue',
  'UnsupportedAgreementTypeFilterValue',
  'UnsupportedAssemblyNameFilterValue',
  'SchemaQuotaExceeded',
  'AssemblyQuotaExceeded',
  'AssemblyAlreadyExists',
  'MapQuotaExceeded',
  'CertificateQuotaExceeded',
  'PartnerQuotaExceeded',
  'AgreementQuotaExceeded',
  'RosettaNetProcessConfigurationQuotaExceeded',
  'IntegrationAccountLocked',
  'SourceIntegrationAccountDoesNotExist',
  'DestinationIntegrationAccountExists',
  'InvalidLocation',
  'KeyVaultUnderWrongSubscription',
  'MissingConfirmConsentCodeContent',
  'UnsupportedWorkflowTriggerTypeFilterValue',
  'UnsupportedWorkflowFilter',
  'UnsupportedConnectionFilter',
  'IntegrationAccountRequestsThrottled',
  'ContentNameNotFound',
  'FunctionNotFound',
  'InvalidFunctionType',
  'FunctionInvokeUrlNotFound',
  'FunctionUnderWrongSubscription',
  'WorkflowRunActionInputsInvalidProperty',
  'InvalidXml',
  'ValidationFailed',
  'NestedWorkflowContainsSplitOnTrigger',
  'NestedWorkflowDoesNotContainResponseAction',
  'WorkflowSelfReference',
  'PropertyNotAllowed',
  'PropertyNotSpecified',
  'WorkflowDescriptionTooLong',
  'TriggerDescriptionTooLong',
  'ActionDescriptionTooLong',
  'InputParameterDescriptionTooLong',
  'OutputParameterDescriptionTooLong',
  'ExpressionEvaluationFailed',
  'ActionBranchingConditionNotSatisfied',
  'TrackedPropertiesSizeLimitExceeded',
  'TrackedPropertiesEvaluationFailed',
  'AmbiguousSchema',
  'ValueNotSupported',
  'InvalidMap',
  'InvalidMapRequest',
  'WorkflowRunTimedOut',
  'DuplicateSchemaReference',
  'IdenticalBusinessIdentities',
  'ConnectionGatewayNotFound',
  'InvalidConnectionGateway',
  'CannotUpdateGatewayInstallationReference',
  'ConnectionGatewayFailure',
  'ConnectionGatewaySettingNameMissing',
  'ConnectionGatewayReferenceMissing',
  'ConnectionGatewayReferenceInvalid',
  'ConnectionGatewayAuthTypeMissing',
  'ConnectionGatewayAuthTypeInvalid',
  'ConnectionGatewayInstallationUnavailable',
  'ManagedApiNotRegisteredForOnPremise',
  'CannotResolveClusterUri',
  'MissingConnectionGatewayInstallationId',
  'InvalidConnectionGatewayInstallationId',
  'InvalidClientTrackingId',
  'ClientTrackingIdLengthLimitExceeded',
  'InvalidConsentLinkParameter',
  'Terminated',
  'InvalidArtifactType',
  'IntegrationAccountAssociationRequired',
  'NestedForeachActionNotAllowed',
  'NestedUntilActionNotAllowed',
  'ApiManagementServiceUnderWrongSubscription',
  'ApiManagementServiceNotFound',
  'WorkflowOperationInputsApiOperationNotFound',
  'WorkflowOperationInputsInvalidProperty',
  'WorkflowOperationInputsMissingProperty',
  'WorkflowOperationInputsPropertyInvalidConnectionsReference',
  'WorkflowOperationParametersAmbiguousProperty',
  'WorkflowOperationParametersArrayInvalidLength',
  'WorkflowOperationParametersExtraParameter',
  'WorkflowOperationParametersIncorrectEnum',
  'WorkflowOperationParametersIncorrectParameterType',
  'WorkflowOperationParametersInternalValueProvided',
  'WorkflowOperationParametersMissingRequiredParameter',
  'WorkflowOperationParametersNumberInvalidMultiple',
  'WorkflowOperationParametersInvalidParameterName',
  'WorkflowOperationParametersNumberInvalidRange',
  'WorkflowOperationParametersReadOnlyParameter',
  'InvalidWorkflowOperationParametersRuntimeValue',
  'WorkflowOperationParametersRuntimeMissingValue',
  'WorkflowOperationParametersStringInvalidLength',
  'NotPlatformSubscription',
  'ActionResultsSizeLimitExceeded',
  'WorkflowTriggerHistoryCannotBeResubmitted',
  'DestinationResourceExists',
  'TrackingEventsLimitExceeded',
  'TrackingRecordTypeNotSpecfied',
  'TrackingEventsSourceTypeNotSpecfied',
  'InvalidTrackingEventsSourceType',
  'InvalidSystemId',
  'MissingAccessKeyRegenerateActionContent',
  'InvalidAccessKeyType',
  'PatchApiConnectionPropertiesNotSupported',
  'InvalidPatchApiConnectionRequest',
  'WorkflowRunInProgress',
  'WorkflowMaximumWaitingRunCountExceeded',
  'WorkflowConnectionParameterUnderWrongSubscription',
  'WorkflowUnderWrongSubscription',
  'AllowedSwitchCaseLimitExceeded',
  'MapCompilationFailed',
  'EnabledRegionalFreeSkuIntegrationAccountsQuotaExceeded',
  'IntegrationAccountNotReady',
  'MapNotReady',
  'InvalidContentOperation',
  'UnsupportedComparisonOperator',
  'InvalidJSON',
  'InvalidMultipart',
  'UnsupportedChangedTimeFilter',
  'UnsupportedChangedTimeFilterValue',
  'TriggerRequestMethodNotValid',
  'TriggerRelativePathNotValid',
  'ContentMissing',
  'InvalidFunctionRoute',
  'InvalidFunctionAuthorizationLevel',
  'ActionRepetitionNotFound',
  'IntegrationAccountConfigurationChanged',
  'TagsConfigurationChanged',
  'AccessControlConfigurationChanged',
  'WorkflowNotUnderAllowedResourceGroup',
  'FunctionNotUnderAllowedResourceGroup',
  'ConnectionParameterNotUnderAllowedSubscriptionOrResourceGroup',
  'ApiManagementServiceUnderNotUnderAllowedResourceGroup',
  'WorkflowRunActionTimeoutLimitInvalid',
  'InvalidInputParameter',
  'InvalidTemplateParameter',
  'MissingBatchConfiguration',
  'MissingBatchReleaseCriteria',
  'InvalidBatchConfiguration',
  'InvalidBatchConfigurationName',
  'InvalidVariableInitialization',
  'InvalidVariableOperation',
  'TriggerOperationNotValid',
  'MissingBatchTriggerOperationInputs',
  'InvalidBatchTriggerOperationInputs',
  'InvalidBatchPartitionName',
  'InvalidBatchMessageId',
  'WorkflowVersionTriggerTypeNotRequest',
  'VariableSizeLimitExceeded',
  'ExpressionTraceNotSupported',
  'ExpressionTraceSizeLimitExceeded',
  'WorkflowActionNotFound',
  'InvalidPaginationPolicy',
  'InvalidPageResponse',
  'InvalidFlowLifetime',
  'UnsupportedPatchConnectionGatewayRequest',
  'InvalidSubscriptionNotificationDefinition',
  'InvalidSubscriptionNotificationProperties',
  'SubscriptionNotificationMissingTenantId',
  'ClassicServiceDeploymentSlotNotFound',
  'ClassicServiceRoleNotFound',
  'ClassicServiceRoleInstancesNotFound',
  'UnexpectedAutoscaleSettingsFound',
  'UnexpectedAutoscaleSettingProfilesFound',
  'SchemaNullOrEmpty',
  'UnknownError',
  'InvalidPartialContent',
  'InvalidContentLink',
  'InvalidMapCompilationRequest',
  'InvalidTransformRequest',
  'InvalidXmlContent',
  'InvalidXsltContent',
  'InvalidXsltTransformOptions',
  'InvalidMapCompiledContent',
  'InvalidContentTransferConfiguration',
  'InvalidContentRangeHeader',
  'InvalidProtocolResponse',
  'MaxRequestCountReached',
  'ListFunctionKeysFailed',
  'InvalidExpandInQueryString',
  'ExpandedContentsNotSupported',
  'InvalidMaxExpandedContentSizeInQueryString',
  'ScopeRepetitionNotFound',
  'UnresolvableHostName',
  'InvalidSlidingWindowTriggerInput',
  'InvalidSlidingWindowTriggerRecurrence',
  'InvalidConcurrencyConfiguration',
  'InvalidCollectionsConfiguration',
  'InvalidRangeHeader',
  'InvalidBatchConfigurationRecurrenceSchedule',
  'InvalidBatchConfigurationRecurrence',
  'InvalidPatchCustomApiRequest',
  'RegionalCustomApisQuotaExceeded',
  'InvalidExpressionActionKind',
  'InvalidExpressionActionInputs',
  'MissingSourceTimeZone',
  'InvalidSourceTimeZone',
  'ConflictingSourceTimeZone',
  'FunctionAppUnderWrongSubscription',
  'FunctionAppNotUnderAllowedResourceGroup',
  'FunctionInputsContainConflictingProperties',
  'ListFunctionAppMasterKeyFailed',
  'BatchConfigurationNotFound',
  'BatchConfigurationQuotaExceeded',
  'InvalidBatchGroupName',
  'MissingBatchGroupName',
  'CannotDeleteApi',
  'InvalidAvailabilityMode',
  'InvalidPerformanceProfile',
  'MissingApiOperationName',
  'ApiOperationNotFound',
  'InvalidWsdlDefinition',
  'WsdlParsingFailed',
  'WsdlOperationCountLimitExceeded',
  'MapCompilationNotSupported',
  'ApiConnectionManagementServiceFailure',
  'ApiManagementServiceFailure',
  'ClassicComputeServiceFailure',
  'RedisCacheServiceFailure',
  'StorageServiceFailure',
  'NetworkServiceFailure',
  'FunctionServiceFailure',
  'InsightServiceFailure',
  'ResourceManagerFailure',
  'MissingLiquidActionKind',
  'InvalidLiquidActionKind',
  'ClientKeywordsEmpty',
  'InvalidClientKeywordsCount',
  'InvalidClientKeywordLength',
  'InvalidClientKeywordCharacters',
  'IntegrationAccountXsltFunctionAppContextNotFound',
  'IntegrationAccountXsltFunctionAppSecretsNotFound',
  'TriggerInputSchemaMismatch',
  'TriggerInputSchemaInvalid',
  'TriggerInputSchemaNotSupported',
  'ActionSchemaInvalid',
  'ActionSchemaNotSupported',
  'InvalidRetryPolicy',
  'WorkflowTriggerResetNotSupported',
  'WorkflowTriggerResetBlocked',
  'CannotDisableTriggerConcurrency',
  'WorkflowTriggerSetStateNotSupported',
  'TriggerConcurrencyLimitReached',
  'PairedRegionNotAvailable',
  'InvalidIntegrationServiceEnvironment',
  'IntegrationServiceEnvironmentSubscriptionQuotaExceeded',
  'IntegrationServiceEnvironmentProvisioningInProgress',
  'MismatchingIntegrationServiceEnvironmentName',
  'IntegrationServiceEnvironmentNotFound',
  'IntegrationServiceEnvironmentSubscriptionMismatch',
  'IntegrationServiceEnvironmentNotReady',
  'InvalidIntegrationServiceEnvironmentPatchRequest',
  'InvalidIntegrationServiceEnvironmentNetworkConfiguration',
  'MissingIntegrationServiceEnvironmentNetworkConfiguration',
  'DuplicateIntegrationServiceEnvironmentNetworkConfigurationSubnets',
  'InvalidIntegrationServiceEnvironmentNetworkConfigurationSubnetReference',
  'InvalidIntegrationServiceEnvironmentPutRequest',
  'IntegrationServiceEnvironmentVirtualNetworkNotFound',
  'IntegrationServiceEnvironmentVirtualNetworkSubnetNotFound',
  'InvalidIntegrationServiceEnvironmentVirtualNetworkSubnet',
  'IntegrationServiceEnvironmentNetworkConfigurationMismatch',
  'IntegrationServiceEnvironmentVirtualNetworkReferencesMismatch',
  'InvalidApiManagementAccountId',
  'RuntimeApisNotAllowed',
  'RuntimeApiManagementAccountMappingLoadFailed',
  'RuntimeApiManagementAccountMappingNotFound',
  'ApiManagementAccountNotSupported',
  'OpenApiOperationRuntimeUrlsNotWellFormed',
  'OpenApiOperationTooManyDynamicSchemaRequests',
  'OpenApiOperationRuntimeSwaggerTooLarge',
  'WorkflowIntegrationServiceEnvironmentMismatch',
  'WorkflowMoveNotSupported',
  'WorkflowNotInSameIntegrationServiceEnvironmentAsIntegrationAccount',
  'IntegrationAccountInIntegrationServiceEnvironment',
  'WorkflowInIntegrationServiceEnvironment',
  'WorkflowInIntegrationServiceEnvironmentDirectAccessUpdate',
  'NestedWorkflowIntegrationServiceEnvironmentMismatch',
  'IntegrationAccountIntegrationServiceEnvironmentMismatch',
  'WorkflowManagedServiceIdentityDirectAccessUpdateNotSupported',
  'WorkflowManagedServiceIdentityInvalid',
  'WorkflowManagedServiceIdentityQuotaExceeded',
  'WorkflowManagedServiceIdentityTypeNotSupported',
  'IntegrationAccountMoveNotSupported',
  'WorkflowTriggerTypeSimulateNotSupported',
  'WorkflowTriggerSimulateConcurrencyNotSupported',
  'InvalidTypeConversion',
  'DynamicParameterInputInvalid',
  'DynamicSchemaInvalidConnection',
  'DynamicSchemaRequestServerFailure',
  'DynamicSchemaRequestClientFailure',
  'DynamicSchemaResponseNotSchema',
  'DynamicSchemaResponseContainsRefs',
  'DynamicSchemaResponseTooLarge',
  'DynamicListResponseInvalid',
  'DynamicTreeResponseInvalid',
  'DynamicTreeFilterExpressionInvalid',
  'OpenApiOperationParameterValidationFailed',
  'OpenApiOperationParameterTypeConversionFailed',
  'AppServicePlanServiceFailure',
  'ApiManagementAccountServiceFailure',
  'ManagedServiceIdentityServiceFailure',
  'ConnectorDeploymentEnvironmentFailure',
  'AppServiceEnvironmentServiceFailure',
  'KustoServiceFailure',
  'UnsupportedOperation',
  'MissingRecommendOperationGroupRequestDefinition',
  'RecommendOperationGroupLimitInvalidValue',
  'InvalidOperationGroupId',
  'MissingOperationGroupId',
  'ApiConnectionIsInConflictState',
  'CustomApiIsInConflictState',
  'IntegrationServiceEnvironmentMismatch',
  'IntegrationServiceEnvironmentApiReferenceMismatch',
  'HeaderNotSupported',
  'InvalidOpenApiConnectionOperationType',
  'InvalidOpenApiConnectionWebhookOperationType',
  'UnsupportedApiRunFlowForOpenApiFlow',
  'ReceiveSideSchemaReferenceNamespaceNotAllowed',
  'UnauthorizedOperation',
  'GetFunctionAppFailed',
  'GetFunctionFailed',
  'ResponseSwaggerSchemaValidationFailure',
  'CountLimitReached',
  'TimeLimitReached',
  'ConnectionReferenceInvalid',
  'WorkflowConnectionReferenceUnderWrongSubscription',
  'ConnectionReferenceNotUnderAllowedSubscriptionOrResourceGroup',
  'ConnectionReferenceNotSupported',
  'AsyncOperationFailed',
  'RuntimeConnectionReferencesNotAllowed',
  'HidxContentNotValid',
  'InvalidApiConnectionActionInputAuthentication',
  'InvalidApiConnectionActionInputRuntimeUrl',
  'InvalidOpenApiConnectionActionInputApiId',
  'ConnectionReferencePropertyUnsupported',
  'InvokerConnectionOverrideFailed',
  'InvokerConnectionNotAllowed',
  'MismatchingApiName',
  'WorkflowAuthenticationInvalidExpression',
  'WorkflowInvalidStaticResults',
  'FlowRunActionTerminated',
  'DynamicInvokeAuthenticationInvalid',
];

const intl = getIntl();
const STATIC_RESULT_OPERATION_STATUS_TITLE = intl.formatMessage({
  defaultMessage: 'Status',
  description: 'The title of the status property in the static result schema',
});
const STATIC_RESULT_OPERATION_CODE_TITLE = intl.formatMessage({
  defaultMessage: 'Code',
  description: 'The title of the code property in the static result schema',
});
const STATIC_RESULT_OPERATION_ERROR_TITLE = intl.formatMessage({
  defaultMessage: 'Error',
  description: 'The title of the error property in the static result schema',
});
const STATIC_RESULT_ERROR_OBJECT_CODE_TITLE = intl.formatMessage({
  defaultMessage: 'Error Code',
  description: 'The title of the error code property within Error in the static result schema',
});

const STATIC_RESULT_ERROR_OBJECT_MESSAGE_TITLE = intl.formatMessage({
  defaultMessage: 'Error Message',
  description: 'The title of the error message property within Error in the static result schema',
});

/**
 * The common Action Outputs expected from every action supporting Static output
 */
export const StaticResultRootSchema: StaticResultRootSchemaType = {
  properties: {
    status: {
      title: STATIC_RESULT_OPERATION_STATUS_TITLE,
      type: 'string',
      minLength: 1,
      enum: ['Succeeded', 'Failed'],
      default: 'Succeeded',
    },
    code: {
      title: STATIC_RESULT_OPERATION_CODE_TITLE,
      type: 'string',
    },
    error: {
      title: STATIC_RESULT_OPERATION_ERROR_TITLE,
      type: 'object',
      properties: {
        message: {
          title: STATIC_RESULT_ERROR_OBJECT_MESSAGE_TITLE,
          type: 'string',
          default: 'Unknown error',
        },
        code: {
          title: STATIC_RESULT_ERROR_OBJECT_CODE_TITLE,
          type: 'string',
          enum: ValidResponseCodes,
        },
      },
      required: ['message'],
    },
  },
  required: ['status'],
  type: 'object',
  additionalProperties: false,
};
