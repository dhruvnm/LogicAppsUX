import { SettingScope } from '@microsoft/utils-logic-apps';
import type { OperationManifest } from '@microsoft/utils-logic-apps';

const iconUri =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMzIgMzIiPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyIgaWQ9InN0eWxlMiI+LnN0MHtmaWxsOiNGMUYxRjE7fSAuc3Qxe2ZpbGw6I0YzOEUwMDt9IC5zdDJ7ZmlsbDojRkZGRkZGO30gLnN0M3tmaWxsOiM2QzlCMDA7fSAuc3Q0e2ZpbGw6IzRENEY0Rjt9IC5zdDV7ZmlsbDpub25lO30gLnN0NntmaWxsOiNGRkZGRkY7c3Ryb2tlOiNGRkZGRkY7c3Ryb2tlLXdpZHRoOjAuMjU7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fSAuc3Q3e2ZpbGw6IzAwOTlCQzt9IC5zdDh7ZmlsbDojNzQyNzc0O30gLnN0OXtvcGFjaXR5OjA7ZmlsbDp1cmwoI1NWR0lEXzFfKTt9IC5zdDEwe2ZpbGw6IzgwNDk5ODt9IC5zdDExe2ZpbGw6I0U4MTEyMzt9IC5zdDEye29wYWNpdHk6MDtmaWxsOnVybCgjU1ZHSURfMl8pO30gLnN0MTN7ZmlsbDojRkFGQUZBO30gLnN0MTR7ZmlsbDojNDQ0NDQ0O30gLnN0MTV7ZmlsbDojRjlCMjNFO30gLnN0MTZ7ZmlsbDojREQ1OTAwO30gLnN0MTd7ZmlsbDojM0E5OUM2O30gLnN0MTh7ZmlsbDojRkFGQUZBO3N0cm9rZTojRkFGQUZBO3N0cm9rZS1taXRlcmxpbWl0OjEwO308L3N0eWxlPjxwYXRoIGNsYXNzPSJzdDAiIGlkPSJyZWN0NCIgZD0iTTAgMGgzMnYzMmgtMzJ6Ii8+PGcgaWQ9ImcxMiI+PHBhdGggaWQ9InBvbHlnb242IiBjbGFzcz0ic3QxNCIgZmlsbD0iIzQ0NCIgZD0iTTE2LjgxOSA5Ljg1OXYtLjc1MmgtNy4yNjl2MTEuNjk3aC43NTJ2LTEwLjk0NXoiLz48cGF0aCBpZD0icG9seWdvbjEwIiBjbGFzcz0ic3QxNCIgZmlsbD0iIzQ0NCIgZD0iTTE4LjMyMyAxMi4wMzFoLjY2OHYtMS40MmgtNy45Mzd2MTEuNjE0aDcuOTM3di0xLjQyaC0uNjY4di42NjhoLTYuNjAxdi0xMC4xOTNoNi42MDF6Ii8+PC9nPjxnIGlkPSJnMjYiPjxwYXRoIGlkPSJyZWN0MTQiIGNsYXNzPSJzdDE1IiBmaWxsPSIjZjliMjNlIiBkPSJNMTYuNDAxIDE5LjQ2N2gxLjMzN3YxLjMzN2gtMS4zMzd6Ii8+PHBhdGggaWQ9InJlY3QxNiIgY2xhc3M9InN0MTYiIGZpbGw9IiNkZDU5MDAiIGQ9Ik0xNC4zMTIgMTkuNDY3aDEuMzM3djEuMzM3aC0xLjMzN3oiLz48cGF0aCBpZD0icmVjdDE4IiBjbGFzcz0ic3QxNyIgZmlsbD0iIzNhOTljNiIgZD0iTTE0LjMxMiAxNy4zNzloMS4zMzd2MS4zMzdoLTEuMzM3eiIvPjxwYXRoIGlkPSJyZWN0MjAiIGNsYXNzPSJzdDEwIiBmaWxsPSIjODA0OTk4IiBkPSJNMTIuMzA3IDE5LjQ2N2gxLjMzN3YxLjMzN2gtMS4zMzd6Ii8+PHBhdGggaWQ9InJlY3QyMiIgY2xhc3M9InN0MTYiIGZpbGw9IiNkZDU5MDAiIGQ9Ik0xMi4zMDcgMTcuMzc5aDEuMzM3djEuMzM3aC0xLjMzN3oiLz48cGF0aCBpZD0icmVjdDI0IiBjbGFzcz0ic3QxMCIgZmlsbD0iIzgwNDk5OCIgZD0iTTEyLjMwNyAxNS4zNzNoMS4zMzd2MS4zMzdoLTEuMzM3eiIvPjwvZz48ZyBpZD0iZzMyIiB0cmFuc2Zvcm09Im1hdHJpeCguODM2IDAgMCAuODM2IDQuMjAzIDIuNjc0KSI+PGNpcmNsZSBjbGFzcz0ic3QxOCIgY3g9IjE3LjciIGN5PSIxNi40IiByPSIzLjkiIGlkPSJjaXJjbGUyOCIgZmlsbD0iI2ZhZmFmYSIgc3Ryb2tlPSIjZmFmYWZhIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiLz48cGF0aCBjbGFzcz0ic3QxNCIgZD0iTTI1LjQgMjMuNWwtNC4zLTQuM2MuNi0uNyAxLTEuNyAxLTIuNyAwLTIuNC0xLjktNC4zLTQuMy00LjNzLTQuMyAxLjktNC4zIDQuMyAxLjkgNC4zIDQuMyA0LjNjMSAwIDItLjQgMi43LTFsNC4zIDQuM2MuMS4xLjIuMS4zLjEuMSAwIC4yIDAgLjMtLjEuMi0uMS4yLS40IDAtLjZ6bS0xMS4xLTcuMWMwLTEuOSAxLjYtMy41IDMuNS0zLjVzMy41IDEuNiAzLjUgMy41LTEuNiAzLjUtMy41IDMuNWMtMiAwLTMuNS0xLjUtMy41LTMuNXoiIGlkPSJwYXRoMzAiIGZpbGw9IiM0NDQiLz48L2c+PC9zdmc+';

export const integrationAccountArtifactLookupManifest = {
  properties: {
    iconUri,
    brandColor: '#f1f1f1',
    description: `Integration Account Operation Lookup`,
    summary: 'Integration Account Operation Lookup',

    inputs: {
      type: 'object',
      required: ['artifactType', 'artifactName'],
      properties: {
        artifactType: {
          name: 'artifactType',
          summary: 'Artifact Type',
          description: 'Type of the artifact to be fetched',
          required: true,
          type: 'string',
          enum: ['Schema', 'Map', 'Partner', 'Agreement'],
          default: 'Schema',
        },
        artifactName: {
          name: 'artifactName',
          type: 'string',
          summary: 'Artifact Name',
          description: 'Name of the artifact to be fetched',
          required: true,
          'x-ms-visibility': 'important',
        },
      },
    },

    outputs: {
      type: 'object',
      required: [],
      properties: {
        name: {
          title: 'Name',
          type: 'string',
        },
        body: {
          title: 'Body',
          type: 'any',
        },
        properties: {
          title: 'Properties',
          type: 'object',
        },
      },
    },

    connector: {
      id: 'connectionProviders/integrationAccount',
      name: 'integrationAccount',
      properties: {
        description: 'Integration Account',
        displayName: 'Integration Account',
      },
    } as any,

    settings: {
      secureData: {},
      trackedProperties: {
        scopes: [SettingScope.Action],
      },
    },
  },
} as OperationManifest;
