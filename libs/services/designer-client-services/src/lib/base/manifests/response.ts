import { OperationOptions, OutputSecureDataMode, SettingScope } from '@microsoft/utils-logic-apps';
import type { OperationManifest } from '@microsoft/utils-logic-apps';

export default {
  properties: {
    iconUri:
      'data:image/svg+xml;base64,PHN2ZyBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAzMiAzMiIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgMzIgMzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+DQogPHBhdGggZD0ibTAgMGgzMnYzMmgtMzJ6IiBmaWxsPSIjMDA5ZGE1Ii8+DQogPGcgZmlsbD0iI2ZmZiI+DQogIDxwYXRoIGQ9Im0xMy45IDIxLjE2NGg0LjIxOHYxLjg5MWgtNC4yMTh6Ii8+DQogIDxwYXRoIGQ9Im0xOC40MDkgMjEuNjczaDEuNTI3djEuMzgyaC0xLjUyN3oiLz4NCiAgPHBhdGggZD0ibTEyLjAwOSAyMS42NzNoMS41Mjd2MS4zODJoLTEuNTI3eiIvPg0KICA8cGF0aCBkPSJNMTUuMjgyIDIzLjQxOGgxLjM4MnYuNTgyaC0xLjM4MnoiLz4NCiAgPHBhdGggZD0iTTI0Ljg4MiAxOC4xMDlsLTEuNjczLTEuNTI3aC0xLjAxOGwxLjIzNiAxLjE2NGgtMy43MDl2LjhoMy43MDlsLTEuMTY0IDEuMjM2aC45NDV6Ii8+DQogIDxwYXRoIGQ9Ik0xNS4yODIgMjAuODczaDEuMzgydi0xLjAxOGMuOC0uMDczIDEuNTI3LS4zNjQgMi4yNTUtLjcyN3YtMS4zODJjLS40MzYuMzY0LTEuMDE4LjY1NS0xLjYuOC4zNjQtLjU4Mi42NTUtMS40NTUuOC0yLjQuODczLS4xNDUgMS43NDUtLjI5MSAyLjMyNy0uNTgyLS4yMTguNTgyLS41MDkgMS4wMTgtLjg3MyAxLjQ1NWgxLjQ1NWMuNTgyLS44NzMuODczLTEuOTY0Ljg3My0zLjEyNyAwLTEuMDkxLS4yOTEtMi4xMDktLjgtMi45ODItMS4wMTgtMS43NDUtMi45MDktMi45MDktNS4wOTEtMi45MDktMi4xODIgMC00LjA3MyAxLjE2NC01LjA5MSAyLjkwOS0uNTA5Ljg3My0uOCAxLjg5MS0uOCAyLjk4MiAwIDMuMDU1IDIuMzI3IDUuNTI3IDUuMjM2IDUuODkxdjEuMDkxem0yLjQ3My01LjE2NGMtLjUwOS4wNzMtMS4wOTEuMDczLTEuNzQ1LjA3My0uNjU1IDAtMS4yMzYgMC0xLjc0NS0uMDczLS4wNzMtLjU4Mi0uMTQ1LTEuMTY0LS4xNDUtMS43NDUgMC0uNDM2IDAtLjg3My4wNzMtMS4zMDkuNTgyLjA3MyAxLjE2NC4xNDUgMS44MTguMTQ1LjY1NSAwIDEuMjM2LS4wNzMgMS44MTgtLjE0NS4wNzMuNDM2LjA3My44LjA3MyAxLjMwOSAwIC42NTUtLjA3MyAxLjIzNi0uMTQ1IDEuNzQ1em0yLjYxOC0zLjc4MmMuMjkxLjU4Mi40MzYgMS4zMDkuNDM2IDIuMDM2bC0uMDczIDEuMDE4Yy0uNTA5LjI5MS0xLjMwOS41ODItMi40NzMuNzI3LjA3My0uNTA5LjA3My0xLjA5MS4wNzMtMS43NDUgMC0uNDM2IDAtLjk0NS0uMDczLTEuMzgyLjgtLjE0NSAxLjUyNy0uMzY0IDIuMTA5LS42NTV6bS0uMjE4LS4zNjRjLS40MzYuMjE4LTEuMDkxLjQzNi0xLjg5MS41ODItLjE0NS0xLjE2NC0uNDM2LTIuMTA5LS44NzMtMi43NjQgMS4xNjQuMzY0IDIuMTA5IDEuMDkxIDIuNzY0IDIuMTgyem0tNC4xNDUtMi40Yy4yMTggMCAuNDM2IDAgLjY1NS4wNzMuNDM2LjUwOS44NzMgMS42IDEuMDkxIDIuOTgyLS41MDkuMDczLTEuMDkxLjE0NS0xLjc0NS4xNDUtLjY1NSAwLTEuMjM2LS4wNzMtMS43NDUtLjE0NS4yMTgtMS4zODIuNTgyLTIuNDczIDEuMDkxLTIuOTgyLjE0NS0uMDczLjQzNi0uMDczLjY1NS0uMDczem0tMS4zODIuMjE4Yy0uMzY0LjY1NS0uNzI3IDEuNi0uODczIDIuNzY0LS44LS4xNDUtMS40NTUtLjM2NC0xLjg5MS0uNTgyLjU4Mi0xLjA5MSAxLjYtMS44MTggMi43NjQtMi4xODJ6bS0zLjQxOCA0LjU4MmMwLS43MjcuMTQ1LTEuMzgyLjQzNi0yLjAzNi41MDkuMjkxIDEuMjM2LjUwOSAyLjEwOS42NTUtLjA3My40MzYtLjA3My44NzMtLjA3MyAxLjM4MmwuMDczIDEuNzQ1Yy0xLjE2NC0uMTQ1LTEuOTY0LS40MzYtMi40NzMtLjcyN2wtLjA3My0xLjAxOHptLjI5MSAxLjZjLjU4Mi4yOTEgMS40NTUuNDM2IDIuMzI3LjU4Mi4xNDUuOTQ1LjQzNiAxLjgxOC44IDIuNC0xLjQ1NS0uNDM2LTIuNjE4LTEuNTI3LTMuMTI3LTIuOTgyem0yLjgzNi42NTVjLjU4Mi4wNzMgMS4wOTEuMDczIDEuNjczLjA3My41ODIgMCAxLjA5MSAwIDEuNjczLS4wNzMtLjIxOCAxLjE2NC0uNTgyIDIuMDM2LS45NDUgMi40NzNsLS42NTUuMDczYy0uMjE4IDAtLjQzNiAwLS42NTUtLjA3My0uNTA5LS41MDktLjg3My0xLjMwOS0xLjA5MS0yLjQ3M3oiLz4NCiA8L2c+DQo8L3N2Zz4NCg==',
    brandColor: '#007C89',
    description: 'This is an incoming API call that could use the results of an action to trigger this flow.',
    summary: 'Response',

    inputs: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'integer',
          title: 'Status Code',
          description: 'Status Code',
          required: true,
          default: 200,
        },
        headers: {
          type: 'object',
          title: 'Headers',
          description: 'Enter JSON object of response headers',
          'x-ms-visibility': 'important',
          'x-ms-editor': 'dictionary',
          'x-ms-editor-options': {
            valueType: 'string',
          },
        },
        schema: {
          type: 'object',
          title: 'Response Body JSON Schema',
          description:
            'Example:\n{\n    "type": "object",\n    "properties": {\n        "address": {\n            "type": "string"\n        }\n    },\n    "required": ["address"]\n}',
          'x-ms-editor': 'schema',
        },
        body: {
          title: 'Body',
          description: 'Enter response content',
          'x-ms-visibility': 'important',
        },
      },
      required: ['statusCode'],
    },
    inputsLocation: ['inputs'],
    isInputsOptional: false,

    outputs: {},
    isOutputsOptional: false,

    connector: {
      id: 'connectionProviders/request',
      name: 'request',
      properties: {
        description: 'Operations to handle inbound request to workflow and send workflow response',
        displayName: 'Request',
      },
    } as any,

    settings: {
      secureData: {
        options: {
          outputsMode: OutputSecureDataMode.LinkedToInputs,
        },
      },
      trackedProperties: {
        scopes: [SettingScope.Action],
      },
      operationOptions: {
        scopes: [SettingScope.Action],
        options: [OperationOptions.Asynchronous],
      },
    },
  },
} as OperationManifest;
