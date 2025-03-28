import type { DynamicallyAddedParameterProps, DynamicallyAddedParameterTypeType, IDynamicallyAddedParameterProperties } from '.';
import { DynamicallyAddedParameterType } from '.';
import constants from '../constants';
import type { ValueSegment } from '../editor';
import { ValueSegmentType } from '../editor';
import { getIntl } from '@microsoft/intl-logic-apps';
import { generateUniqueName, guid } from '@microsoft/utils-logic-apps';

export type DynamicallyAddedParameterIcon = string;

const DynamicallyAddedParameterTextIcon =
  'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjQ0cHgiIGhlaWdodD0iNDRweCIgdmlld0JveD0iMCAwIDQ0IDQ0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPHRpdGxlPlRleHRfaWNvbjwvdGl0bGU+CiAgICA8ZGVmcz48L2RlZnM+CiAgICA8ZyBpZD0iRmluYWwiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJBZGQtZmlsZS0vLUVudW0tLShtYWtlcikiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMi4wMDAwMDAsIC0zNTMuMDAwMDAwKSI+CiAgICAgICAgICAgIDxnIGlkPSIyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMC4wMDAwMDAsIDI2MC4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSJUZXh0X2ljb24iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEyLjAwMDAwMCwgOTMuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9InRleHQiPgogICAgICAgICAgICAgICAgICAgICAgICA8Y2lyY2xlIGlkPSJPdmFsLTU1NC1Db3B5IiBmaWxsPSIjOUY2Q0Q5IiBjeD0iMjIiIGN5PSIyMiIgcj0iMjIiPjwvY2lyY2xlPgogICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMjUuMjAwNjYxMywxMy43NSBMMjAuMzI1NTA2MywyOC4zNDU2MjkzIEwxNy41ODgyOTMsMjAuMTQ0MjE4OCBMMTYuMjQ5OTQ4MywyMC4xNDQyMTg4IEwxMi44MzMzMzMzLDMwLjM3Mjc1MjYgTDE0LjE4MTkwNzQsMzAuMzcyNzUyNiBMMTUuMDMxNzk4OSwyNy44MTYyNTg1IEwxOC44MDY0NDI0LDI3LjgxNjI1ODUgTDE5LjY1NjMzNCwzMC4zNzI3NTI2IEwyMS4wMDQ5MDgsMzAuMzcyNzUyNiBMMjIuNzAzODM4NiwyNS4yNTgwNTk1IEwyOS4wMzY2ODExLDI1LjI1ODA1OTUgTDMwLjczNDc1OTIsMzAuMzcyNzUyNiBMMzIuMDgzMzMzMywzMC4zNzI3NTI2IEwyNi41Mzk4NTg0LDEzLjc1IEwyNS4yMDA2NjEzLDEzLjc1IFogTTI1Ljg2OTgzMzYsMTUuNzc4ODI4MyBMMjguNjA3MDQ2OSwyMy45ODAyMzg3IEwyMy4xMzI2MjA0LDIzLjk4MDIzODcgTDI1Ljg2OTgzMzYsMTUuNzc4ODI4MyBaIE0xNi45MTkxMjA3LDIyLjE3MTM0MjIgTDE4LjM3NzY2MDcsMjYuNTM2NzMyOCBMMTUuNDYwNTgwNywyNi41MzY3MzI4IEwxNi45MTkxMjA3LDIyLjE3MTM0MjIgWiIgaWQ9IlBhZ2UtMSIgZmlsbD0iI0ZGRkZGRiI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+';
const DynamicallyAddedParameterBooleanIcon =
  'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgNDQgNDQiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ0IDQ0OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6IzAwNzhENzt9Cgkuc3Qxe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU+Cjx0aXRsZT5Hcm91cCAyNTwvdGl0bGU+CjxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgo8cGF0aCBpZD0iT3ZhbC01NTQtQ29weS00IiBjbGFzcz0ic3QwIiBkPSJNMjIsNDRjMTIuMiwwLDIyLTkuOCwyMi0yMlMzNC4yLDAsMjIsMFMwLDkuOCwwLDIyUzkuOCw0NCwyMiw0NHoiLz4KPGc+Cgk8Zz4KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMzMuMiwxOS4ydjE0LjFIMTkuMnYtOC42Yy0wLjQsMC4xLTAuOSwwLjEtMS40LDAuMWMtMSwwLTEuOS0wLjItMi43LTAuNWMtMC45LTAuNC0xLjYtMC45LTIuMi0xLjUKCQkJYy0wLjYtMC42LTEuMS0xLjQtMS41LTIuMmMtMC40LTAuOS0wLjUtMS44LTAuNS0yLjdjMC0xLDAuMi0xLjksMC41LTIuN2MwLjQtMC45LDAuOS0xLjYsMS41LTIuMmMwLjYtMC42LDEuNC0xLjEsMi4yLTEuNQoJCQljMC45LTAuNCwxLjgtMC41LDIuNy0wLjVjMSwwLDEuOSwwLjIsMi43LDAuNWMwLjksMC40LDEuNiwwLjksMi4yLDEuNWMwLjYsMC42LDEuMSwxLjQsMS41LDIuMmMwLjQsMC45LDAuNSwxLjgsMC41LDIuNwoJCQljMCwwLjUsMCwxLTAuMSwxLjRIMzMuMnogTTEyLjIsMTcuOGMwLDAuOCwwLjEsMS41LDAuNCwyLjJjMC4zLDAuNywwLjcsMS4zLDEuMiwxLjhjMC41LDAuNSwxLjEsMC45LDEuOCwxLjIKCQkJYzAuNywwLjMsMS40LDAuNCwyLjIsMC40czEuNS0wLjEsMi4yLTAuNGMwLjctMC4zLDEuMy0wLjcsMS44LTEuMmMwLjUtMC41LDAuOS0xLjEsMS4yLTEuOGMwLjMtMC43LDAuNC0xLjQsMC40LTIuMgoJCQlzLTAuMS0xLjUtMC40LTIuMmMtMC4zLTAuNy0wLjctMS4zLTEuMi0xLjhjLTAuNS0wLjUtMS4xLTAuOS0xLjgtMS4ycy0xLjQtMC40LTIuMi0wLjRzLTEuNSwwLjEtMi4yLDAuNAoJCQljLTAuNywwLjMtMS4zLDAuNy0xLjgsMS4yYy0wLjUsMC41LTAuOSwxLjEtMS4yLDEuOFMxMi4yLDE3LDEyLjIsMTcuOHogTTMxLjgsMjAuNmgtNy42Yy0wLjQsMC44LTAuOSwxLjUtMS41LDIuMgoJCQljLTAuNiwwLjYtMS4zLDEuMS0yLjIsMS41djcuNmgxMS4yVjIwLjZ6IE0yNS41LDI3LjNsMy43LTMuN2wxLDFsLTQuNyw0LjdsLTIuNi0yLjZsMS0xTDI1LjUsMjcuM3oiLz4KCTwvZz4KCTxyZWN0IHg9IjE0LjMiIHk9IjE3LjEiIHRyYW5zZm9ybT0ibWF0cml4KDAuNzA3MSAtMC43MDcxIDAuNzA3MSAwLjcwNzEgLTcuMzY1MSAxNy43ODEyKSIgY2xhc3M9InN0MSIgd2lkdGg9IjciIGhlaWdodD0iMS40Ii8+Cgk8cmVjdCB4PSIxNy4xIiB5PSIxNC4zIiB0cmFuc2Zvcm09Im1hdHJpeCgwLjcwNzEgLTAuNzA3MSAwLjcwNzEgMC43MDcxIC03LjM2NTIgMTcuNzgxMykiIGNsYXNzPSJzdDEiIHdpZHRoPSIxLjQiIGhlaWdodD0iNyIvPgo8L2c+Cjwvc3ZnPgo=';
const DynamicallyAddedParameterFileIcon =
  'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjQ0cHgiIGhlaWdodD0iNDRweCIgdmlld0JveD0iMCAwIDQ0IDQ0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPHRpdGxlPkZpbGVfaWNvbjwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPjwvZGVmcz4KICAgIDxnIGlkPSJGaW5hbCIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IkFkZC1maWxlLS8tRW51bS0tKG1ha2VyKSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTg3LjAwMDAwMCwgLTM1My4wMDAwMDApIj4KICAgICAgICAgICAgPGcgaWQ9IjIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEwLjAwMDAwMCwgMjYwLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9IkZpbGVfaWNvbiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNzcuMDAwMDAwLCA5My4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICA8ZyBpZD0iZmlsZSI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0yMiw0NCBDMzQuMTUwMjY0NSw0NCA0NCwzNC4xNTAyNjQ1IDQ0LDIyIEM0NCw5Ljg0OTczNTUgMzQuMTUwMjY0NSwwIDIyLDAgQzkuODQ5NzM1NSwwIDAsOS44NDk3MzU1IDAsMjIgQzAsMzQuMTUwMjY0NSA5Ljg0OTczNTUsNDQgMjIsNDQgWiIgaWQ9Ik92YWwtNTU0IiBmaWxsPSIjMDFCOEFBIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0yOS4wNDkyMzA4LDE4LjI4OTA2MjUgTDI5LjA0OTIzMDgsMzAgTDE3LjA0OTIzMDgsMzAgTDE3LjA0OTIzMDgsMTQgTDI0Ljc2MDE2ODMsMTQgTDI5LjA0OTIzMDgsMTguMjg5MDYyNSBaIE0yNS4wNDkyMzA4LDE4IEwyNy4zMzgyOTMzLDE4IEwyNS4wNDkyMzA4LDE1LjcxMDkzNzUgTDI1LjA0OTIzMDgsMTggWiBNMjguMDQ5MjMwOCwyOSBMMjguMDQ5MjMwOCwxOSBMMjQuMDQ5MjMwOCwxOSBMMjQuMDQ5MjMwOCwxNSBMMTguMDQ5MjMwOCwxNSBMMTguMDQ5MjMwOCwyOSBMMjguMDQ5MjMwOCwyOSBaIiBpZD0i7qe5IiBmaWxsPSIjRkZGRkZGIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=';
const DynamicallyAddedParameterEmailIcon =
  'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNDRweCIgaGVpZ2h0PSI0NHB4IiB2aWV3Qm94PSIwIDAgNDQgNDQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+R3JvdXAgMjU8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZGVmcz48L2RlZnM+CiAgICA8ZyBpZD0iRGVzaWduZXIiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJHcm91cC0yNSI+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0yMiw0NCBDMzQuMTUwMjY0NSw0NCA0NCwzNC4xNTAyNjQ1IDQ0LDIyIEM0NCw5Ljg0OTczNTUgMzQuMTUwMjY0NSwwIDIyLDAgQzkuODQ5NzM1NSwwIDAsOS44NDk3MzU1IDAsMjIgQzAsMzQuMTUwMjY0NSA5Ljg0OTczNTUsNDQgMjIsNDQgWiIgaWQ9Ik92YWwtNTU0LUNvcHktNCIgZmlsbD0iIzEwN0MxMCI+PC9wYXRoPgogICAgICAgICAgICA8cGF0aCBkPSJNMTIsMTUuOTM3NSBMMzMsMTUuOTM3NSBMMzMsMjkuMDYyNSBMMTIsMjkuMDYyNSBMMTIsMTUuOTM3NSBaIE0zMS41MzM2OTE0LDE3LjI1IEwxMy40NjYzMDg2LDE3LjI1IEwyMi41LDIxLjc3MTk3MjcgTDMxLjUzMzY5MTQsMTcuMjUgWiBNMTMuMzEyNSwyNy43NSBMMzEuNjg3NSwyNy43NSBMMzEuNjg3NSwxOC42NDQ1MzEyIEwyMi41LDIzLjIyODAyNzMgTDEzLjMxMjUsMTguNjQ0NTMxMiBMMTMuMzEyNSwyNy43NSBaIiBpZD0iZW1haWxJY29uIiBmaWxsPSIjRkZGRkZGIj48L3BhdGg+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4K';
const DynamicallyAddedParameterNumberIcon =
  'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgNDQgNDQiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ0IDQ0OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6I0I0MDA5RTt9Cgkuc3Qxe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU+Cjx0aXRsZT5Hcm91cCAyNTwvdGl0bGU+CjxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgo8cGF0aCBpZD0iT3ZhbC01NTQtQ29weS00IiBjbGFzcz0ic3QwIiBkPSJNMjIsNDRjMTIuMiwwLDIyLTkuOCwyMi0yMlMzNC4yLDAsMjIsMFMwLDkuOCwwLDIyUzkuOCw0NCwyMiw0NHoiLz4KPHBhdGggY2xhc3M9InN0MSIgZD0iTTIyLjQsMjYuM2gtMy45YzAtMC4zLDAtMC41LDAtMC44YzAtMC4zLDAtMC41LDAuMS0wLjdjMC4xLTAuMiwwLjItMC40LDAuMy0wLjZzMC4zLTAuNCwwLjUtMC41CgljMC4yLTAuMiwwLjQtMC4zLDAuNi0wLjVzMC40LTAuMywwLjUtMC41YzAuMi0wLjIsMC4zLTAuMywwLjQtMC41YzAuMS0wLjIsMC4xLTAuMywwLjEtMC41YzAtMC4yLTAuMS0wLjMtMC4yLTAuNQoJYy0wLjEtMC4xLTAuMy0wLjItMC41LTAuMmMtMC4yLDAtMC4zLDAtMC40LDAuMWMtMC4xLDAuMS0wLjIsMC4yLTAuMiwwLjRsLTEuMy0wLjNjMC0wLjIsMC4xLTAuNCwwLjItMC42YzAuMS0wLjIsMC4zLTAuNCwwLjQtMC41CglzMC40LTAuMiwwLjYtMC4zczAuNC0wLjEsMC43LTAuMWMwLjMsMCwwLjUsMC4xLDAuOCwwLjJjMC4yLDAuMSwwLjQsMC4yLDAuNiwwLjRzMC4zLDAuNCwwLjQsMC42YzAuMSwwLjIsMC4yLDAuNSwwLjIsMC44CgljMCwwLjMsMCwwLjUtMC4xLDAuN2MtMC4xLDAuMi0wLjIsMC40LTAuMywwLjZjLTAuMSwwLjItMC4zLDAuNC0wLjQsMC41Yy0wLjIsMC4yLTAuMywwLjMtMC41LDAuNXMtMC40LDAuMy0wLjUsMC41CgljLTAuMiwwLjItMC4zLDAuMy0wLjUsMC41aDIuNFYyNi4zeiBNMzIuOCwxNS45djE0LjNIMTJWMTUuOUgzMi44eiBNMzEuNSwxNy4ySDEzLjN2MTEuN2gxOC4yVjE3LjJ6IE0xNiwyMS4zCgljLTAuMiwwLjEtMC40LDAuMi0wLjcsMC4zYy0wLjMsMC4xLTAuNSwwLjEtMC43LDAuMXYtMS4zYzAuMSwwLDAuMiwwLDAuMy0wLjFzMC4zLTAuMSwwLjQtMC4yYzAuMS0wLjEsMC4zLTAuMSwwLjQtMC4yCgljMC4xLTAuMSwwLjItMC4xLDAuMi0wLjJoMS4zdjYuNUgxNlYyMS4zeiBNMjUuNCwyNi4zYy0wLjMsMC0wLjYsMC0wLjgtMC4xYy0wLjMtMC4xLTAuNS0wLjItMC44LTAuNHYtMS4zYzAuMSwwLjEsMC4zLDAuMiwwLjQsMC4zCgljMC4xLDAuMSwwLjIsMC4xLDAuMywwLjJjMC4xLDAsMC4yLDAuMSwwLjQsMC4xczAuMywwLDAuNSwwYzAuMSwwLDAuMywwLDAuNCwwYzAuMSwwLDAuMy0wLjEsMC40LTAuMnMwLjItMC4yLDAuMi0wLjMKCWMwLjEtMC4xLDAuMS0wLjMsMC4xLTAuNGMwLTAuMi0wLjEtMC40LTAuMi0wLjVzLTAuNC0wLjItMC42LTAuMnMtMC40LDAtMC43LDBjLTAuMiwwLTAuNCwwLTAuNSwwdi0xYzAuMiwwLDAuNCwwLDAuNiwwCglzMC40LDAsMC42LTAuMWMwLjItMC4xLDAuMy0wLjEsMC41LTAuM2MwLjEtMC4xLDAuMi0wLjMsMC4yLTAuNmMwLTAuMy0wLjEtMC41LTAuMy0wLjZDMjUuOCwyMSwyNS42LDIxLDI1LjMsMjEKCWMtMC4zLDAtMC41LDAuMS0wLjcsMC4yYy0wLjIsMC4xLTAuNCwwLjMtMC42LDAuNHYtMS4zYzAuMi0wLjIsMC41LTAuMywwLjgtMC4zYzAuMy0wLjEsMC42LTAuMSwwLjgtMC4xYzAuMiwwLDAuNSwwLDAuNywwLjEKCXMwLjQsMC4yLDAuNiwwLjNjMC4yLDAuMSwwLjMsMC4zLDAuNCwwLjVjMC4xLDAuMiwwLjIsMC40LDAuMiwwLjdjMCwwLjMtMC4xLDAuNi0wLjIsMC45Yy0wLjEsMC4zLTAuMywwLjUtMC42LDAuNgoJYzAuMywwLjEsMC41LDAuMywwLjcsMC41YzAuMiwwLjMsMC4zLDAuNSwwLjMsMC45cy0wLjEsMC42LTAuMiwwLjljLTAuMSwwLjMtMC4zLDAuNS0wLjUsMC42cy0wLjUsMC4zLTAuOCwwLjQKCUMyNiwyNi4zLDI1LjcsMjYuMywyNS40LDI2LjN6Ii8+Cjwvc3ZnPgo=';
const DynamicallyAddedParameterDateIcon =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDYiIGhlaWdodD0iNDYiIHZpZXdCb3g9IjAgMCA0NiA0NiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ2IiBoZWlnaHQ9IjQ2IiBmaWxsPSJ3aGl0ZSIvPgo8Y2lyY2xlIGN4PSIyMyIgY3k9IjIzIiByPSIyMyIgZmlsbD0iIzRGNkJFRCIvPgo8cGF0aCBkPSJNMzUgMTIuNVYzMy41SDExVjEyLjVIMTUuNVYxMUgxN1YxMi41SDI5VjExSDMwLjVWMTIuNUgzNVpNMTIuNSAxNFYxN0gzMy41VjE0SDMwLjVWMTUuNUgyOVYxNEgxN1YxNS41SDE1LjVWMTRIMTIuNVpNMzMuNSAzMlYxOC41SDEyLjVWMzJIMzMuNVpNMjcuNSAyMS41VjI5SDI2VjIzLjMwNDdDMjUuNzg5MSAyMy40MTQxIDI1LjU0NjkgMjMuNTE1NiAyNS4yNzM0IDIzLjYwOTRDMjUgMjMuNzAzMSAyNC43NDIyIDIzLjc1IDI0LjUgMjMuNzVWMjIuMjVDMjQuNTkzOCAyMi4yNSAyNC43MTQ4IDIyLjIyNjYgMjQuODYzMyAyMi4xNzk3QzI1LjAxMTcgMjIuMTMyOCAyNS4xNjQxIDIyLjA3NDIgMjUuMzIwMyAyMi4wMDM5QzI1LjQ3NjYgMjEuOTI1OCAyNS42MTcyIDIxLjg0MzggMjUuNzQyMiAyMS43NTc4QzI1Ljg2NzIgMjEuNjcxOSAyNS45NTMxIDIxLjU4OTggMjYgMjEuNTExN1YyMS41SDI3LjVaTTIzIDIzLjc1QzIzIDI0LjA1NDcgMjIuOTUzMSAyNC4zMzIgMjIuODU5NCAyNC41ODJDMjIuNzczNCAyNC44MjQyIDIyLjY1NjIgMjUuMDUwOCAyMi41MDc4IDI1LjI2MTdDMjIuMzU5NCAyNS40NjQ4IDIyLjE4NzUgMjUuNjYwMiAyMS45OTIyIDI1Ljg0NzdDMjEuNzk2OSAyNi4wMzUyIDIxLjU5NzcgMjYuMjE4OCAyMS4zOTQ1IDI2LjM5ODRDMjEuMTkxNCAyNi41NzAzIDIwLjk4ODMgMjYuNzQ2MSAyMC43ODUyIDI2LjkyNThDMjAuNTg5OCAyNy4xMDU1IDIwLjQxMDIgMjcuMjk2OSAyMC4yNDYxIDI3LjVIMjNWMjlIMTguNUMxOC41IDI4Ljg2NzIgMTguNDk2MSAyOC43MjY2IDE4LjQ4ODMgMjguNTc4MUMxOC40ODgzIDI4LjQyOTcgMTguNDg4MyAyOC4yODEyIDE4LjQ4ODMgMjguMTMyOEMxOC40OTYxIDI3Ljk3NjYgMTguNTExNyAyNy44MjgxIDE4LjUzNTIgMjcuNjg3NUMxOC41NTg2IDI3LjUzOTEgMTguNTk3NyAyNy4zOTg0IDE4LjY1MjMgMjcuMjY1NkMxOC43MzgzIDI3LjA1NDcgMTguODY3MiAyNi44NDc3IDE5LjAzOTEgMjYuNjQ0NUMxOS4yMTg4IDI2LjQzMzYgMTkuNDE0MSAyNi4yMjY2IDE5LjYyNSAyNi4wMjM0QzE5LjgzNTkgMjUuODIwMyAyMC4wNTA4IDI1LjYyMTEgMjAuMjY5NSAyNS40MjU4QzIwLjQ4ODMgMjUuMjMwNSAyMC42ODc1IDI1LjAzOTEgMjAuODY3MiAyNC44NTE2QzIxLjA1NDcgMjQuNjY0MSAyMS4yMDcgMjQuNDgwNSAyMS4zMjQyIDI0LjMwMDhDMjEuNDQxNCAyNC4xMTMzIDIxLjUgMjMuOTI5NyAyMS41IDIzLjc1QzIxLjUgMjMuNTM5MSAyMS40MjU4IDIzLjM2MzMgMjEuMjc3MyAyMy4yMjI3QzIxLjEyODkgMjMuMDc0MiAyMC45NTMxIDIzIDIwLjc1IDIzQzIwLjU3MDMgMjMgMjAuNDEwMiAyMy4wNTQ3IDIwLjI2OTUgMjMuMTY0MUMyMC4xMzY3IDIzLjI3MzQgMjAuMDUwOCAyMy40MTggMjAuMDExNyAyMy41OTc3TDE4LjU0NjkgMjMuMjkzQzE4LjU5MzggMjMuMDM1MiAxOC42ODM2IDIyLjc5NjkgMTguODE2NCAyMi41NzgxQzE4Ljk1NyAyMi4zNTk0IDE5LjEyODkgMjIuMTcxOSAxOS4zMzIgMjIuMDE1NkMxOS41MzUyIDIxLjg1MTYgMTkuNzU3OCAyMS43MjY2IDIwIDIxLjY0MDZDMjAuMjQyMiAyMS41NDY5IDIwLjQ5MjIgMjEuNSAyMC43NSAyMS41QzIxLjA2MjUgMjEuNSAyMS4zNTU1IDIxLjU1ODYgMjEuNjI4OSAyMS42NzU4QzIxLjkwMjMgMjEuNzkzIDIyLjE0MDYgMjEuOTUzMSAyMi4zNDM4IDIyLjE1NjJDMjIuNTQ2OSAyMi4zNTk0IDIyLjcwNyAyMi41OTc3IDIyLjgyNDIgMjIuODcxMUMyMi45NDE0IDIzLjE0NDUgMjMgMjMuNDM3NSAyMyAyMy43NVoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=';

export function getIconForDynamicallyAddedParameterType(type: DynamicallyAddedParameterTypeType): DynamicallyAddedParameterIcon {
  switch (type) {
    case DynamicallyAddedParameterType.Text:
      return DynamicallyAddedParameterTextIcon;
    case DynamicallyAddedParameterType.Boolean:
      return DynamicallyAddedParameterBooleanIcon;
    case DynamicallyAddedParameterType.File:
      return DynamicallyAddedParameterFileIcon;
    case DynamicallyAddedParameterType.Email:
      return DynamicallyAddedParameterEmailIcon;
    case DynamicallyAddedParameterType.Number:
      return DynamicallyAddedParameterNumberIcon;
    case DynamicallyAddedParameterType.Date:
      return DynamicallyAddedParameterDateIcon;
  }
}

export function getDefaultTitleForDynamicallyAddedParameterType(type: DynamicallyAddedParameterTypeType): string {
  const intl = getIntl();
  switch (type) {
    case DynamicallyAddedParameterType.Text:
      return intl.formatMessage({
        defaultMessage: 'Input',
        description: 'Placeholder title for a newly inserted Text parameter',
      });
    case DynamicallyAddedParameterType.Boolean:
      return intl.formatMessage({
        defaultMessage: 'Yes/No',
        description: 'Placeholder title for a newly inserted Boolean parameter',
      });
    case DynamicallyAddedParameterType.File:
      return intl.formatMessage({
        defaultMessage: 'File Content',
        description: 'Placeholder title for a newly inserted File parameter',
      });
    case DynamicallyAddedParameterType.Email:
      return intl.formatMessage({
        defaultMessage: 'Email',
        description: 'Placeholder title for a newly inserted Email parameter',
      });
    case DynamicallyAddedParameterType.Number:
      return intl.formatMessage({
        defaultMessage: 'Number',
        description: 'Placeholder title for a newly inserted Number parameter',
      });
    case DynamicallyAddedParameterType.Date:
      return intl.formatMessage({
        defaultMessage: 'Trigger date',
        description: 'Placeholder title for a newly inserted Date parameter',
      });
  }
}

function getDescriptionForDynamicallyAddedParameterType(type: DynamicallyAddedParameterTypeType): string {
  const intl = getIntl();
  switch (type) {
    case DynamicallyAddedParameterType.Text:
      return intl.formatMessage({
        defaultMessage: 'Please enter your input',
        description: 'Placeholder description for a newly inserted Text parameter',
      });
    case DynamicallyAddedParameterType.Boolean:
      return intl.formatMessage({
        defaultMessage: 'Please select yes or no',
        description: 'Placeholder description for a newly inserted Boolean parameter',
      });
    case DynamicallyAddedParameterType.File:
      return intl.formatMessage({
        defaultMessage: 'Please select file or image',
        description: 'Placeholder description for a newly inserted File parameter',
      });
    case DynamicallyAddedParameterType.Email:
      return intl.formatMessage({
        defaultMessage: 'Please enter an e-mail address',
        description: 'Placeholder description for a newly inserted Email parameter',
      });
    case DynamicallyAddedParameterType.Number:
      return intl.formatMessage({
        defaultMessage: 'Please enter a number',
        description: 'Placeholder description for a newly inserted Number parameter',
      });
    case DynamicallyAddedParameterType.Date:
      return intl.formatMessage({
        defaultMessage: 'Please enter or select a date (YYYY-MM-DD)',
        description: 'Placeholder description for a newly inserted Date parameter',
      });
  }
}

/**
 * Sample shape of schema object JSON expected by FlowRP that we are serializing/deserializing:
 *      object: {
 *          schema: {
 *              type: 'object',
 *              properties: {
 *                  'text' : ...,
 *                  'text_1': ...,
 *                  'number': ...,
 *              },
 *              required: ['text', 'text_1'],
 *          }
 *      }
 *
 * @param value - valueSegment provided to us by rest of designer parent components
 * @param onChange - handler to update value when the user changes their input in one of the dynamic parameters
 * @returns - array of props to render DynamicallyAddedParameter editors with
 */
export function deserialize(value: ValueSegment[]): DynamicallyAddedParameterProps[] {
  if (!value || value.length === 0 || !value[0].value) {
    return [];
  }
  // ASSUMPTION: for manual trigger, we assume there is *only one* ValueSegment which contains the required data
  const rootObject = JSON.parse(value[0].value);

  const retval: DynamicallyAddedParameterProps[] = [];
  for (const [schemaKey, propertiesUnknown] of Object.entries(rootObject?.schema?.properties)) {
    const properties = propertiesUnknown as IDynamicallyAddedParameterProperties;
    if (properties) {
      const icon = getIconForDynamicallyAddedParameterType(properties['x-ms-content-hint'] as DynamicallyAddedParameterTypeType);
      const required = rootObject?.schema?.required?.includes(schemaKey);
      retval.push({
        icon,
        schemaKey,
        properties,
        required,
      });
    }
  }

  return retval;
}

/**
 * See deserialize function above for sample.
 * @param props - array of props of all DynamicallyAddedParameter editors currently rendered
 * @returns - ValueSegment array with one literal -- value for which is a JSON representation of the dynamically added parameters in the shape expected by FlowRP
 */
export function serialize(props: DynamicallyAddedParameterProps[]): ValueSegment[] {
  const requiredArray: string[] = [];
  props.forEach((prop) => {
    if (prop.required) requiredArray.push(prop.schemaKey);
  });

  const properties = props
    .map((prop) => {
      // Reshape array objects so schemaKey is the key
      return { [prop.schemaKey]: prop.properties };
    })
    .reduce((resultPropertiesObj, nextProperty) => {
      // Convert array to object; replace array index key with schemaKey
      const [schemaKey, propertyValue] = Object.entries(nextProperty)[0];
      return { ...resultPropertiesObj, [schemaKey]: propertyValue };
    }, {});

  const rootObject = {
    schema: {
      type: 'object',
      properties,
      required: requiredArray,
    },
  };

  return [
    {
      id: guid(),
      type: ValueSegmentType.LITERAL,
      value: JSON.stringify(rootObject),
    },
  ];
}

export function createDynamicallyAddedParameterProperties(
  itemType: DynamicallyAddedParameterTypeType,
  schemaKey: string
): IDynamicallyAddedParameterProperties {
  let format, fileProperties;
  let type = '';
  switch (itemType) {
    case DynamicallyAddedParameterType.Date:
    case DynamicallyAddedParameterType.Email:
      type = constants.SWAGGER.TYPE.STRING;
      format = itemType.toLowerCase();
      break;
    case DynamicallyAddedParameterType.Text:
      type = constants.SWAGGER.TYPE.STRING;
      break;
    case DynamicallyAddedParameterType.File:
      type = constants.SWAGGER.TYPE.OBJECT;
      fileProperties = {
        contentBytes: { type: constants.SWAGGER.TYPE.STRING, format: constants.SWAGGER.FORMAT.BYTE },
        name: { type: constants.SWAGGER.TYPE.STRING },
      };
      break;
    case DynamicallyAddedParameterType.Boolean:
      type = constants.SWAGGER.TYPE.BOOLEAN;
      break;
    case DynamicallyAddedParameterType.Number:
      type = constants.SWAGGER.TYPE.NUMBER;
      break;
  }

  return {
    description: getDescriptionForDynamicallyAddedParameterType(itemType),
    format,
    title: convertDynamicallyAddedSchemaKeyToTitle(schemaKey, itemType),
    type,
    properties: fileProperties,
    'x-ms-content-hint': itemType,
    'x-ms-dynamically-added': true,
  };
}

export function generateDynamicParameterKey(
  parameters: DynamicallyAddedParameterProps[],
  typeHint: DynamicallyAddedParameterTypeType
): string {
  const currentKeys = parameters.map((parameter) => parameter.schemaKey);

  const processedTypeHint = typeHint.toLowerCase().replace(/\s+/g, '');
  const newTitle = generateUniqueName(processedTypeHint, currentKeys, 1);

  return newTitle.replace(/\s+/g, '_');
}

function convertDynamicallyAddedSchemaKeyToTitle(name: string, itemType: DynamicallyAddedParameterTypeType): string {
  const title = getDefaultTitleForDynamicallyAddedParameterType(itemType);
  let result = title;

  if (name && name.indexOf('_') > -1) {
    const split = name.split('_');
    result = `${title} ${split[1]}`;
  }

  return result;
}
