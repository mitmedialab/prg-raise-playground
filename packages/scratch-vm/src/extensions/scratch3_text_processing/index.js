require("regenerator-runtime/runtime");
const Runtime = require("../../engine/runtime");

const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const Variable = require("../../engine/variable");
const formatMessage = require("format-message");
const pos = require("pos");

/**
 * Icon svg to be displayed in the blocks category menu, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const menuIconURI =
    "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiCiAgIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIgogICB3aWR0aD0iODBtbSIKICAgaGVpZ2h0PSI4MG1tIgogICB2aWV3Qm94PSIwIDAgODAuMDAwMDAxIDgwIgogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmc4IgogICBpbmtzY2FwZTp2ZXJzaW9uPSIwLjkyLjQgKDVkYTY4OWMzMTMsIDIwMTktMDEtMTQpIgogICBzb2RpcG9kaTpkb2NuYW1lPSJubHBfaWNvbl9tZW51LnN2ZyI+CiAgPGRlZnMKICAgICBpZD0iZGVmczIiIC8+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIGlkPSJiYXNlIgogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiIKICAgICBib3JkZXJvcGFjaXR5PSIxLjAiCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAuMCIKICAgICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOnpvb209IjEuNCIKICAgICBpbmtzY2FwZTpjeD0iMjQzLjA2OTE2IgogICAgIGlua3NjYXBlOmN5PSIxODEuMTgyOCIKICAgICBpbmtzY2FwZTpkb2N1bWVudC11bml0cz0ibW0iCiAgICAgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0ibGF5ZXIxIgogICAgIHNob3dncmlkPSJmYWxzZSIKICAgICBmaXQtbWFyZ2luLXRvcD0iMCIKICAgICBmaXQtbWFyZ2luLWxlZnQ9IjAiCiAgICAgZml0LW1hcmdpbi1yaWdodD0iMCIKICAgICBmaXQtbWFyZ2luLWJvdHRvbT0iMCIKICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjE1NzMiCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iMTE0NSIKICAgICBpbmtzY2FwZTp3aW5kb3cteD0iMzc0NyIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iMjA3IgogICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjAiIC8+CiAgPG1ldGFkYXRhCiAgICAgaWQ9Im1ldGFkYXRhNSI+CiAgICA8cmRmOlJERj4KICAgICAgPGNjOldvcmsKICAgICAgICAgcmRmOmFib3V0PSIiPgogICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PgogICAgICAgIDxkYzp0eXBlCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz4KICAgICAgICA8ZGM6dGl0bGU+PC9kYzp0aXRsZT4KICAgICAgPC9jYzpXb3JrPgogICAgPC9yZGY6UkRGPgogIDwvbWV0YWRhdGE+CiAgPGcKICAgICBpbmtzY2FwZTpsYWJlbD0iTGF5ZXIgMSIKICAgICBpbmtzY2FwZTpncm91cG1vZGU9ImxheWVyIgogICAgIGlkPSJsYXllcjEiCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoODkuMjc3OTczLC0xNTUuNzM3MzUpIj4KICAgIDxjaXJjbGUKICAgICAgIHN0eWxlPSJmaWxsOiNmOWNmY2Y7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjAuMDYzNjM2MzY7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmUiCiAgICAgICBpZD0icGF0aDM4NzQiCiAgICAgICBjeD0iLTQ5LjI3Nzk3MyIKICAgICAgIGN5PSIxOTUuNzM3MzUiCiAgICAgICByPSI0MCIgLz4KICAgIDxwYXRoCiAgICAgICBzdHlsZT0iZmlsbDojZjlhN2E3O2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDowLjI2NDU4MzMycHg7c3Ryb2tlLWxpbmVjYXA6YnV0dDtzdHJva2UtbGluZWpvaW46bWl0ZXI7c3Ryb2tlLW9wYWNpdHk6MSIKICAgICAgIGQ9Im0gLTU2LjE4MzM0MSwxODAuMjgwOTYgLTAuMTE2MjExLC0xLjY4ODg5IC0yLjI2Nzg1NywtMi40NTY4NSAxLjcwMDg5MywtMi41OTg1OSAyLjg1ODQ0NiwtMi4xMjYxMSAyLjg1ODQ0NCwyLjQwOTYgMi4wMDc5OTcsLTAuOTQ0OTQgMC41MzM4OTgsLTMuNDQyMTMgNi4wNTcwNjQsLTAuMTQ4NjUgMC42MTQyMTEsMy44NzQyNiAxLjc3MDUzMSwxLjE3NTc1IDEuNjU0ODc2LC0yLjA0OTgyIDEuODQyNjM1LC0wLjYxNDIxIDMuOTY4NzUsNC4wODY4NiAtMC44MjY4MjMsMS42MzAwMyAtMS42MDYzOTksMS41MzU1MiAwLjc1NTk1MiwxLjg4OTg5IDMuNzMyNTE3LDAuMzMwNzIgMC42Mzc4MzMsMi45NTI5NCAtMC40NzI0NjksMy40OTYyOCAtNC4xNjYxNjEsLTAuMDM1NiAtMC45MTc3MTIsMi40MDI5OSAyLjc2ODc2OSwyLjU0NjMyIC0wLjIzNjIzNiwxLjU1OTE2IC0xMi41MzQ2MzIsMC4zNzExNyAyZS02LC0yLjMyMjgyIDIuMTg3NTMzLC0wLjA1NjMgMi41MDQwOTEsLTEuMjc1NjcgMi45MjkzMTUsLTQuMDM5NjcgLTAuMTY1MzY0LC01LjIyMDggLTMuMTQxOTMzLC0zLjk2ODcgLTQuMzQ2NzIsLTEuMjUyMSAtMy42ODUyNywxLjA2MzExIC0zLjQ5NjI3OCwyLjg4MjAyIC0yLjgzNDgyMSwwLjUxOTcyIHoiCiAgICAgICBpZD0icGF0aDM4NzIiCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPgogICAgPHBhdGgKICAgICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjAuMjY0NTgzMzJweDtzdHJva2UtbGluZWNhcDpidXR0O3N0cm9rZS1saW5lam9pbjptaXRlcjtzdHJva2Utb3BhY2l0eToxIgogICAgICAgZD0ibSAtNTIuMzUzMTk0LDE4MC43MTQ4OCAzLjM0MDg2NywwLjUzNDU0IDEuODA0MDcsLTEuMzM2MzQgMi4xMzgxNTYsLTAuMDY2OCAyLjA3MTM0MSwwLjczNDk5IDEuNDAzMTY0LDEuNzM3MjUgMC43MzQ5OTIsMS45Mzc3MSAtMC41MzQ1NDEsMS43MzcyNSAtMC43NTM5MjQsMS4zMzkzIC0xLjg0MjYzMywxLjM5Mzc5IC0xLjgxOTAxLDAuMjU5ODYgMC4yNDU2ODksMy4xMjczOSAyLjE4NzUzMywtMC4wNTYzIDIuNTA0MDkxLC0xLjI3NTY3IDEuNzAwODkyLC0xLjkzNzEzIDAuOTQ0OTQxLC0xLjY3NzI3IDAuNTE5NzE4LC0yLjA1NTI1IC0wLjA0NzI1LC0yLjMxNTEgLTAuNjYxNDU5LC0xLjc3MTc2IC0xLjI1MjA0OCwtMS45MzcxMyAtMS41ODI3NzQsLTEuNTM1NTMgLTIuMDU1MjQ3LC0wLjgyNjgyIC0zLjczMjUxNCwtMC4xODg5OSAtMi4yNDQyMzIsMC44MjY4MiAtMy4wOTQ2ODEsMi42MjIyMSB6IgogICAgICAgaWQ9InBhdGgzODcwIgogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIgLz4KICAgIDxwYXRoCiAgICAgICBzdHlsZT0iZmlsbDojYTRjOWZmO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDowLjI2NDU4MzMycHg7c3Ryb2tlLWxpbmVjYXA6YnV0dDtzdHJva2UtbGluZWpvaW46bWl0ZXI7c3Ryb2tlLW9wYWNpdHk6MSIKICAgICAgIGQ9Im0gLTQ1LjU2NTAyNSwxOTQuNDM2NjQgMTcuODk3MTcsLTAuMjI5NDMgMy4yNjAwNDUsMS44ODk4OCAxLjIwMDA3NiwyLjM1MjA0IDAuNDA2MzIxLDEzLjg1MzY5IC0xLjI3NTY2OCwzLjA3MTA1IC0yLjk3NjU2MiwxLjc0ODE0IC05LjU2MzU3NCwwLjYzMTQyIC0wLjM1ODMwMSwzLjc2MjU1IC0zLjk1OTI5NywtMS42MjU1NiAtMi44MjY2OTQsLTIuNjk5NjIgLTcuMDU3Mzg3LDAuMjE0NjkgLTMuNjg1MjY4LC0wLjgwMzE5IC0yLjc0MDMyOCwtMi45NzY1NyAtMC40NzI0NywtNC40ODg0NiAtMC4zMjgwODUsLTQuOTExNTIgNy40NjIzODQsLTAuNzEwODggMy40MTk2MzksLTEuNDgzNjMgMC45MzY1NDMsLTIuOTY0ODcgeiIKICAgICAgIGlkPSJwYXRoMzg2OCIKICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiIC8+CiAgICA8cGF0aAogICAgICAgc3R5bGU9ImZpbGw6I2UwZWJmYztmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MC4yNDgzMTQyO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lIgogICAgICAgZD0ibSAyNy4xNTYyNSw0Ni4yNDIxODggYyAtMTQuMjUzNDM0LDAgLTI1LjcyODUxNTYsOS45NDUwNjQgLTI1LjcyODUxNTYsMjIuMjk4ODI4IHYgNDIuNTQ0OTI0IGMgMCwxMi4zNTM3NiAxMS40NzUwODE2LDIyLjI5ODgzIDI1LjcyODUxNTYsMjIuMjk4ODMgaCAyOC41MjE0ODQgbCAtMC45NDUzMTIsMTUuMDg5ODQgMS45NjQ4NDQsMS4wNzIyNyBMIDY5Ljg3Njk1MywxNDAgbCA5Ljk4MjQyMiwtNi42MTUyMyBoIDI2LjkxMjEwNSBjIDE0LjI1MzQ0LDAgMjUuNzI4NTIsLTkuOTQ1MDcgMjUuNzI4NTIsLTIyLjI5ODgzIFYgNjguNTQxMDE2IGMgMCwtMTIuMzUzNzY0IC0xMS40NzUwOCwtMjIuMjk4ODI4IC0yNS43Mjg1MiwtMjIuMjk4ODI4IHoiCiAgICAgICB0cmFuc2Zvcm09Im1hdHJpeCgwLjI2NDU4MzMzLDAsMCwwLjI2NDU4MzMzLC04MS4xNTE0ODYsMTY4LjUwNzA0KSIKICAgICAgIGlkPSJyZWN0Mzc3MCIKICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiIC8+CiAgICA8cGF0aAogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIKICAgICAgIGlkPSJwYXRoMzczOCIKICAgICAgIGQ9Im0gLTUyLjc1NzY1NiwyMTAuMzA1NzggYyAtMC40MzIyMDcsLTAuNDkzMiAtMC40MTc4OTksLTAuODc5NTMgMC4wNDk5LC0xLjM0NzMzIDAuMzIyMTg4LC0wLjMyMjE5IDIuMjYxOTMzLC0wLjM3MDA2IDEyLjYzMzg1NCwtMC4zMTE4MyBsIDEyLjI1MzIyNCwwLjA2ODggdiAwLjkyNjA0IDAuOTI2MDQgbCAtMTIuMzAzMTI1LDAuMDU3OCBjIC0xMC4zNzQ4NDEsMC4wNDg4IC0xMi4zNTQ5NTksLTAuMDAxIC0xMi42MzM4NTQsLTAuMzE5NTYgeiBtIDE0LjY3NTc0NCwtNy4yNzg5IC05Ljk5NjY1NCwtMC4xMzIyOSAwLjkxNTU0MywtMC44NjMzNSAwLjE1OTU4OSwtMC45NTc4MyA5Ljk2OTM1NCwwLjE2NDA5IDkuMjEzNDAzLDAuMDY5NiAwLjA4NjgzLDAuNzU5ODMgYyAwLjA0Nzc2LDAuNDE3OTEgLTAuMDExNzcsMC44MzQ2MyAtMC4xMzIyOTEsMC45MjYwNSAtMC4xMjA1MTgsMC4wOTE0IC00LjcxNzYxNiwwLjEwNjY3IC0xMC4yMTU3NzUsMC4wMzM5IHogbSAtMzcuNjc4NDY1LC02LjMxNjc0IGMgLTAuMTcwMzM0LC0wLjI3Mjc1IC0wLjI3NjkzOSwtMC43MTkyMyAtMC4yMzY5MDEsLTAuOTkyMTkgMC4wNjk4MiwtMC40NzU5NiAwLjU3MzM3OCwtMC40OTkwOSAxMi4zMDA4NDEsLTAuNTY1MDggMTAuMzUwMDE3LC0wLjA1ODIgMTIuMjg2NTAzLC0wLjAxMDMgMTIuNjA4NjcyLDAuMzExODMgMC40OTMyODQsMC40OTMyOSAwLjQ4MjUyMSwwLjU4MTEyIC0wLjE0ODUzNywxLjIxMjE4IC0wLjUxMzQwMiwwLjUxMzQgLTAuODgxOTQzLDAuNTI5MTcgLTEyLjM3MTc3MiwwLjUyOTE3IC0xMS4yOTEyOTUsMCAtMTEuODU3MDIyLC0wLjAyMzEgLTEyLjE1MjMwMywtMC40OTU5MSB6IG0gMCwtNy40MDgzMyBjIC0wLjE3MDMzNCwtMC4yNzI3NSAtMC4yNzY5NCwtMC43MTkyNCAtMC4yMzY5MDIsLTAuOTkyMTkgMC4wNjk3OCwtMC40NzU3NSAwLjU2OTg1MywtMC40OTkyNSAxMi4wODYxNTcsLTAuNTY4MDQgMTMuNDgyMDkxLC0wLjA4MDUgMTQuMTk2MjgsMC4wMDYgMTIuNjc0ODIsMS41MjY5NyAtMC41MTM0MDIsMC41MTM0IC0wLjg4MTk0MywwLjUyOTE2IC0xMi4zNzE3NzIsMC41MjkxNiAtMTEuMjkxMjk1LDAgLTExLjg1NzAyMiwtMC4wMjMxIC0xMi4xNTIzMDMsLTAuNDk1OSB6IgogICAgICAgc3R5bGU9ImZpbGw6IzQ3NzBjNztzdHJva2Utd2lkdGg6MC4yNjQ1ODMzMiIKICAgICAgIHNvZGlwb2RpOm5vZGV0eXBlcz0iY2NzY2NjY2NjY2NjY2NjY2NjY2NjY2Njc2NjY2Njc2MiIC8+CiAgICA8cGF0aAogICAgICAgc3R5bGU9ImZpbGw6I2ZmNjYwMDtmaWxsLW9wYWNpdHk6MTtzdHJva2U6IzFhMWExYTtzdHJva2Utd2lkdGg6MC4wNDQ2NDI4NjtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZSIKICAgICAgIGQ9IiIKICAgICAgIGlkPSJwYXRoMzgyMyIKICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiCiAgICAgICB0cmFuc2Zvcm09Im1hdHJpeCgwLjI2NDU4MzMzLDAsMCwwLjI2NDU4MzMzLC04MS4xNTE0ODYsMTY4LjUwNzA0KSIgLz4KICAgIDxwYXRoCiAgICAgICBzdHlsZT0iZmlsbDojZmY2NjAwO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTojMWExYTFhO3N0cm9rZS13aWR0aDowLjA0NDY0Mjg2O3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lIgogICAgICAgZD0iIgogICAgICAgaWQ9InBhdGgzODI5IgogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIKICAgICAgIHRyYW5zZm9ybT0ibWF0cml4KDAuMjY0NTgzMzMsMCwwLDAuMjY0NTgzMzMsLTgxLjE1MTQ4NiwxNjguNTA3MDQpIiAvPgogICAgPHBhdGgKICAgICAgIHN0eWxlPSJmaWxsOiNmZjY2MDA7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOiMxYTFhMWE7c3Ryb2tlLXdpZHRoOjAuMDQ0NjQyODY7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmUiCiAgICAgICBkPSIiCiAgICAgICBpZD0icGF0aDM4MzEiCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIgogICAgICAgdHJhbnNmb3JtPSJtYXRyaXgoMC4yNjQ1ODMzMywwLDAsMC4yNjQ1ODMzMywtODEuMTUxNDg2LDE2OC41MDcwNCkiIC8+CiAgICA8cGF0aAogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIKICAgICAgIGlkPSJwYXRoMzczNiIKICAgICAgIGQ9Im0gLTQwLjkzNDgxNCwyMTkuODkwNDIgLTIuOTEwNDE3LC0yLjAzODYzIC00Ljc2MjUsLTAuMTM4MTcgYyAtNS4yMTI5MjEsLTAuMTUxMjQgLTYuMDQ5NzE5LC0wLjM3NDM5IC03LjU3NjU2NSwtMi4wMjA0MSAtMS41MTg3MTIsLTEuNjM3MjYgLTEuNjczNzM3LC0yLjI1MzIgLTEuNzcwODAxLC03LjAzNTY5IGwgLTAuMDg5OTUsLTQuNDMxNzcgaCAtMC43NjU1OTEgYyAtMC41MjE5ODUsMCAtMS43NTMwNTUsMC42NzM1IC0zLjg2ODk1MywyLjExNjY2IC0xLjcwNjg0OSwxLjE2NDE3IC0zLjIzODg0NCwyLjExNjY3IC0zLjQwNDQzNCwyLjExNjY3IC0wLjE2NTU4OSwwIC0wLjUxMzgzOSwtMC4yMzUxMSAtMC43NzM4ODgsLTAuNTIyNDYgLTAuMzkxODQzLC0wLjQzMjk4IC0wLjQ0MjQzOSwtMC43OTA5NiAtMC4yOTU0MzYsLTIuMDkwMjkgbCAwLjE3NzM4MSwtMS41Njc4NCAtNC41NzQyMTcsLTAuMDk5NyBjIC01LjI0MjU4NCwtMC4xMTQzMSAtNi4yNDIzNjcsLTAuMzk5NDEgLTcuOTE1NzIzLC0yLjI1NzI4IC0xLjU4ODQ0OCwtMS43NjM2IC0xLjY4NTU3OCwtMi4zMzIxNSAtMS42ODU1NzgsLTkuODY2NTYgdiAtNi43NDY4NyBsIDAuNzIzNzQ3LC0xLjM3MjY2IGMgMC43MjQ4ODIsLTEuMzc0OCAxLjY0NDU1OCwtMi4yMzUzNiAzLjM3NzI5NSwtMy4xNjAxNyAwLjg0MTAwMiwtMC40NDg4NyAxLjgxMjg4MSwtMC41MDY0IDEwLjU4MzMzMywtMC42MjY1NSBsIDkuNjU3MjkyLC0wLjEzMjI5IDAuMDgzNzQsLTAuNTg5MTcgYyAwLjA1ODE5LC0wLjQwOTM4IC0wLjI0NDU4NSwtMC45MDE1IC0wLjk5MjE4OCwtMS42MTI2OCAtMS41MzAzOTUsLTEuNDU1ODMgLTEuNDc4NzU3LC0yLjI2MDM3IDAuMjYwMjczLC00LjA1NTE3IDEuNTQ3NDksLTEuNTk3MTIgMi44NDc0MjMsLTIuNjA2NTIgMy4zNTY3NDMsLTIuNjA2NTIgMC4xOTYyNDQsMCAwLjk0NTY1LDAuNTUwNzkgMS42NjUzNDYsMS4yMjM5OCAxLjIzNjc0NCwxLjE1Njg0IDEuMzUwNjM0LDEuMjA2NTUgMi4wNzU3NzIsMC45MDYxOSAwLjcxNjk5NywtMC4yOTY5OSAwLjc3NDQ3LC0wLjQzMTQyIDAuODc3NzI5LC0yLjA1MzA5IDAuMTU2NzIzLC0yLjQ2MTI4IDAuNTM0MTA0LC0yLjcyMjkxIDMuOTI3NDgsLTIuNzIyOTEgMi40OTA3ODgsMCAyLjYxOTgxMiwwLjAyODYgMy4xNDU2OSwwLjY5NzE0IDAuNDEwMjEsMC41MjE0OSAwLjU0ODM3LDEuMDgwMDMgMC41NDgzNywyLjIxNjg2IDAsMS40NDI2OSAwLjA0MDY2LDEuNTM2NTYgMC44MDIyMzMsMS44NTIwMSAwLjc2MTE5MywwLjMxNTMgMC44NTI1NjEsMC4yODE2NiAxLjc4NTkzNywtMC42NTc1NCAxLjg5NDUyLC0xLjkwNjM0IDIuNjE4MjI0LC0xLjc4Mzg3IDUuMTUwODkzLDAuODcxNjcgMS45MjMyNCwyLjAxNjU0IDEuOTkzNDc0LDIuNzAzMzYgMC40NDMxMDMsNC4zMzMxNCAtMC45NjM3OCwxLjAxMzE0IC0xLjA1NDExOSwxLjIxNzk3IC0wLjg1MDkyNCwxLjkyOTM3IDAuMjIwMjgxLDAuNzcxMjIgMC4yODIxMDQsMC43OTgzMSAxLjk5NDQyMSwwLjg3MzkgMi40Njc5MTksMC4xMDg5NSAyLjg0NjYxMiwwLjYwNTgyIDIuODQxMjcsMy43Mjc5OCAtMC4wMDIxLDEuMjk4MzggLTAuMTQ3MzQxLDIuNTY0MTEgLTAuMzM3MTc3LDIuOTQwODggLTAuMjk4NzMzLDAuNTkyOTEgLTAuNTMzODk3LDAuNjc1MTcgLTIuMjY4OTQ3LDAuNzkzNzUgLTEuODcwNzAyLDAuMTI3ODUgLTEuOTQ3MzM5LDAuMTYwMTUgLTIuMjgzMjIsMC45NjIwNyAtMC4zMzc5ODQsMC44MDY5NCAtMC4zMTU0ODksMC44NjEyMyAwLjgxNzY0LDEuOTczMzIgMC44OTYzMjMsMC44Nzk2NyAxLjE2NTE4OCwxLjMzODk1IDEuMTY1MTg4LDEuOTkwNDEgdiAwLjg0Njg3IGwgMi43MTE5NzksMC4wOTAyIGMgMi4yNTYzNDUsMC4wNzUxIDIuOTMwNTk0LDAuMjAxMzYgNC4wMTMyMDUsMC43NTE2OSAxLjUyNDg4MSwwLjc3NTE1IDIuNjQ2NDc0LDIuMTk4NSAzLjE5OTI5OSw0LjA2MDA3IDAuNTYxNDk0LDEuODkwNzUgMC41NjE0OTQsMTIuMjE0MSAwLDE0LjEwNDg2IC0wLjU1OTA2NCwxLjg4MjU3IC0xLjcxMzY1OCwzLjM0OTUzIC0zLjIxOTk3OSw0LjA5MTEgLTEuMTc4ODQ1LDAuNTgwMzYgLTEuNjU1NDM3LDAuNjM3MDMgLTYuMDAwOTA4LDAuNzEzNTQgbCAtNC43MjAzNjYsMC4wODMxIDAuMTc5MzExLDEuNTQ0OTQgYyAwLjIwNzk1MiwxLjc5MTczIC0wLjEyMDk0MSwyLjY2MDQyIC0xLjAwMDQ5NSwyLjY0MjU3IC0wLjMyMjMwMiwtMC4wMDcgLTEuODk1NjkyLC0wLjkyOTI3IC0zLjQ5NjQyMSwtMi4wNTA1MiB6IG0gMy44OTc2NjQsLTAuODUwOTEgLTAuMTMyMzA3LC0xLjg0OTE4IGggNC4xMjM1NjggYyA1LjE3ODczNCwwIDYuNDAxMTc2LC0wLjI0NzY5IDcuOTQ5NzI2LC0xLjYxMDc4IDEuOTYzMzI1LC0xLjcyODE5IDIuMDU4NzEzLC0yLjIyMzM1IDEuOTY3NDUsLTEwLjIxMjk0IGwgLTAuMDc5MDIsLTYuOTE3NDggLTAuODAzNTgyLC0xLjE0MjY3IGMgLTAuOTIyMjA4LC0xLjMxMTM2IC0yLjE1NDIwNiwtMi4yMTkwNiAtMy41MzA5MiwtMi42MDE0NyAtMC41NDk2MjcsLTAuMTUyNjcgLTQuNTkwMjMyLC0wLjI2NjUgLTkuNDg5OTc3LC0wLjI2NzM1IGwgLTguNTMyODEzLC0xMGUtNCB2IDIuMTIzMjggYyAwLDIuNTQ2NDUgLTAuNjcxMDQ5LDQuNzA0MjUgLTEuNzYzNjI3LDUuNjcxMDcgbCAtMC43NDk5MTQsMC42NjM2IC0xLjM1Njc1MiwwLjcxNzE4IGMgLTAuNzI2MDY3LDAuMzE0NTggLTIuMDQ1NzAzLDAuNDc3NjUgLTQuNTMwMjI3LDAuNTU5ODEgbCAtMy41MDU3MywwLjExNTkzIHYgMy42MjU1IGMgMCw0LjQ0NDcyIDAuMzc1MTI5LDUuOTQ4NzUgMS44NTIwODQsNy40MjU3MSAxLjUxMjA0MSwxLjUxMjA0IDIuOTQ5NDMyLDEuODUyMDggNy44Mjg5NDYsMS44NTIwOCBoIDQuMDI4NzM3IGwgMy4xMTQxMTksMi4xMDk5NSBjIDIuMTg2ODY2LDEuNDgxNyAzLjIwNzY3NiwyLjAzMjMxIDMuNDI4MzMxLDEuODQ5MTggMC4yMTI1OSwtMC4xNzY0NCAwLjI3MTQyMywtMC44NTg4NCAwLjE4MTkwNiwtMi4xMDk5NSB6IG0gLTI1LjYyNjI1MiwtMTMuNDkwODUgMy4xMjQwMjksLTIuMTE2NjYgaCA0LjMwMTg2IGMgNS43MTk4MTksMCA2LjgxMTUzNSwtMC4zOTc2MiA4LjI1ODM4LC0zLjAwNzgxIGwgMC43NTI2NTIsLTEuMzU3ODIgdiAtNi44NzkxNyBjIDAsLTYuNTg3MyAtMC4wMjQ3NiwtNi45MjU0NiAtMC41ODM3MTEsLTcuOTcwMzYgLTAuNjYwMjIyLC0xLjIzNDIzIC0xLjkxOTM0MywtMi4zOTAxNiAtMy4xNzgxMDMsLTIuOTE3NjUgLTAuNjczNzQsLTAuMjgyMzMgLTMuNDY5MzMxLC0wLjM1Njc4IC0xMy4zOTczOTEsLTAuMzU2NzggSCAtNzUuOTMxNjggbCAtMS40MTUxOSwwLjczOTMxIGMgLTEuMDI5NzA3LDAuNTM3OTIgLTEuNjMyNTE0LDEuMDkwNiAtMi4yMTMwMjYsMi4wMjg5NyBsIC0wLjc5NzgzNSwxLjI4OTY3IC0wLjA3ODYzLDYuOTk0MTYgYyAtMC4wNzU0Myw2LjcwOTczIC0wLjA1NTYxLDcuMDM4NzggMC40ODc1MjIsOC4wOTEzNCAxLjUzNTQ1NywyLjk3NTY1IDIuNDY0NjExLDMuMzMyODkgOC42ODc4ODIsMy4zNDAzMyBsIDQuODYzNDQsMC4wMDYgLTAuMTI3MDg2LDEuOTgwMjcgYyAtMC4wNjk5LDEuMDg5MTYgLTAuMDY1NzEsMi4wNDE2NiAwLjAwOTMsMi4xMTY2NyAwLjMxOTU2NCwwLjMxOTU3IDAuODkxNDUsMC4wMjU2IDMuODUxODk4LC0xLjk4MDI4IHogbSAyOS4yMTYyOTYsLTExLjk1OTE2IGMgMC41MzU3MTgsLTAuNTM1NzIgMC4zNjUzNjgsLTAuOTc2OTEgLTAuODk5MTYsLTIuMzI4OCBsIC0xLjIxNjY2LC0xLjMwMDcxIDAuNDU4ODU2LC0xLjIwMTUgMC40NTg4NTcsLTEuMjAxNDkgaCAxLjc2MzIyIGMgMS4wMTg2MTcsMCAxLjg5NzMwMSwtMC4xMzQwOCAyLjA4MDcyLC0wLjMxNzUgMC40MzI0NTQsLTAuNDMyNDYgMC40MzI0NTQsLTUuMjgyNTUgMCwtNS43MTUgLTAuMTgyOTQ2LC0wLjE4Mjk1IC0xLjA1OTIwMywtMC4zMTc1IC0yLjA2NzY2MywtMC4zMTc1IC0xLjc0Mjg4MiwwIC0xLjc1MjAxNSwtMC4wMDQgLTIuMTk2MDQyLC0wLjkzNTAyIC0wLjYyNzY3MywtMS4zMTYyNSAtMC41ODg5NTEsLTEuNDYwMjIgMC43NDQ3NDcsLTIuNzY5MTUgMC42NTQ4NDQsLTAuNjQyNjggMS4xOTA2MjUsLTEuMzQ5MDkgMS4xOTA2MjUsLTEuNTY5OCAwLC0wLjU5OTgzIC0zLjQ3MDIyNSwtMy45ODY0NSAtNC4wODQ4NTcsLTMuOTg2NDUgLTAuMjg5OTQ2LDAgLTEuMDcyNjM5LDAuNTM3MjYgLTEuNzM5MzE4LDEuMTkzOTIgbCAtMS4yMTIxNDQsMS4xOTM5MSAtMS4xMDkzNTgsLTAuNDY2MzEgLTEuMTA5MzU4LC0wLjQ2NjMxIC0wLjAwMjcsLTEuNjAzMDggYyAtMC4wMDQxLC0yLjQyODA2IC0wLjE1MDk1NSwtMi41MzIxMyAtMy40NDU5OTcsLTIuNDQxNzYgbCAtMi43NzQzOTQsMC4wNzYxIC0wLjA3NzU5LDEuOTEwOTEgLTAuMDc3NTksMS45MTA5MSAtMS4yMjg5NzksMC41NDM2MyAtMS4yMjg5ODIsMC41NDM2NCAtMS4yMTYwNTksLTEuMTk3NzcgYyAtMC42Njg4MzUsLTAuNjU4NzggLTEuNDQ3MTEsLTEuMTk3NzggLTEuNzI5NDk5LC0xLjE5Nzc4IC0wLjYxMzE3LDAgLTQuMDk4NTk1LDMuMzc4MzcgLTQuMDk4NTk1LDMuOTcyNzEgMCwwLjIyODI3IDAuNTM2NDEsMC45NDE0OCAxLjE5MjAyMywxLjU4NDkxIDEuMDMwNzc5LDEuMDExNjMgMS4xNzE1NzIsMS4yNzg1NiAxLjA0MDg0MiwxLjk3MzMyIGwgLTAuMTUxMTgsMC44MDM0MyAxLjYxMTU2OCwtMC4wOSBjIDEuNTQ2NTM3LC0wLjA4NjMgMS42Njc2ODUsLTAuMTQ2MSAzLjAwMjI1MywtMS40ODA2NyA0LjEyNzcyOCwtNC4xMjc3MyAxMC43ODkxLC0zLjAzMzc5IDEzLjMzMjEyMiwyLjE4OTQxIDEuMDQyMzg3LDIuMTQwOTkgMS4wNDY3OTcsNC44NDYzMyAwLjAxMTM1LDYuOTU0ODEgLTEuMzI0NzEsMi42OTc0NiAtNC4yMTQzOTEsNC43Mjk1NSAtNi43MjU1NDEsNC43Mjk1NSAtMC40Nzc5NDQsMCAtMC42MTM0MzcsMC4xNDYxIC0wLjYxMzQzNywwLjY2MTQ2IHYgMC42NjE0NiBoIDUuOTAwMjA5IGMgNC4yMzYyNzMsMCA1Ljk4OTc0OCwtMC4wODk1IDYuMjE3NzA4LC0wLjMxNzUgeiBtIC05LjA2MTc2NSwtMi4zMTEwNSBjIDEuNTk4NDcyLC0wLjcwMTA3IDIuODM4Mjk5LC0xLjkxOTMxIDMuNjU4ODkxLC0zLjU5NTE4IDIuMTM3OTE4LC00LjM2NjE5IC0wLjUyMDE2OCwtOS43MjU2NiAtNS4zMTc0ODQsLTEwLjcyMTU3IC0yLjU2MDkxLC0wLjUzMTY1IC00LjczODgzOSwwLjEzNzY3IC02Ljc1NTM3MSwyLjA3NjA0IC0xLjE2MDcxMSwxLjExNTczIC0xLjIyNjQyOSwxLjM3NTUxIC0wLjM0Nzk1NCwxLjM3NTUxIDAuMzU0MzMsMCAwLjk1NTQ1OCwwLjExODMyIDEuMzM1ODQyLDAuMjYyOTUgMC41NTg0NDMsMC4yMTIzMiAwLjgzNjY0NywwLjE1NTcxIDEuNDQ0ODkyLC0wLjI5Mzk4IDEuNTY0NDIzLC0xLjE1NjYzIDQuNDc3ODY3LC0wLjk3NzAyIDYuMDEyODEsMC4zNzA2NyAxLjczMDU1MiwxLjUxOTQ1IDIuMTU4NTU1LDMuNzg1NDkgMS4xMjAxNDIsNS45MzA1NiAtMC41NjcxNzEsMS4xNzE2MiAtMS45OTE5MzYsMi4yMzc2MSAtMy40ODAzMTUsMi42MDM5MiAtMC42NzI5MjksMC4xNjU2MiAtMC43Mjc2MDUsMC4yNzg1NCAtMC43Mjc2MDUsMS41MDI3NiB2IDEuMzIzNjcgbCAwLjk5MjE4OCwtMC4xODI2NCBjIDAuNTQ1NzAzLC0wLjEwMDQ2IDEuNDc0NDg2LC0wLjM5NDE4IDIuMDYzOTY0LC0wLjY1MjcxIHogbSAtMC42OTQyNDUsLTMuNDczMjcgYyA0LjIwNjY4OSwtMy4wNDczMSAwLjMyODE5NywtOS40NjAwOSAtNC4zNzI0NDEsLTcuMjI5NDkgLTEuMDgyOTU1LDAuNTEzODkgLTEuMTE3MDg5LDAuNzQxMzcgLTAuMjAxMjkyLDEuMzQxNDMgMS4wODM4NTcsMC43MTAxNyAyLjIxMTM2NiwzLjM0OTM5IDIuMjExNjE3LDUuMTc2ODYgMS45NmUtNCwxLjQyMDQyIDAuMDQxNDYsMS41MjEzNSAwLjYyMTk3LDEuNTIxMzUgMC4zNDE5NjgsMCAxLjEyNTAzNCwtMC4zNjQ1NyAxLjc0MDE0NiwtMC44MTAxNSB6IgogICAgICAgc3R5bGU9ImZpbGw6IzMzNjBjYTtzdHJva2Utd2lkdGg6MC4yNjQ1ODMzMiIKICAgICAgIHNvZGlwb2RpOm5vZGV0eXBlcz0iY2NzY3Njc2Nzc3NjY3NzY2Njc2NjY3NzY2Nzc2NzY3NjY3NjY2Nzc2NzY2NzY2NjY2NjY2NjY2Nzc3NjY3NjY3NjY2NzY3Njc2NjY2NjY2NzY2NzY2NzY2NjY3NjY2NjY2NjY2NjY2NzY2NzY2Nzc2NjY2NjY2NjY2NjY3NzY2NjY3NzY3NzY3NjY2NjY2NzY2NjY2NzY2NjY2Njc3NjIiAvPgogIDwvZz4KPC9zdmc+Cg==";

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI =
    "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiCiAgIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIgogICB3aWR0aD0iNTIuMTcxMzg3bW0iCiAgIGhlaWdodD0iMzkuODY1NjA4bW0iCiAgIHZpZXdCb3g9IjAgMCA1Mi4xNzEzODcgMzkuODY1NjA4IgogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmc4IgogICBpbmtzY2FwZTp2ZXJzaW9uPSIwLjkyLjQgKDVkYTY4OWMzMTMsIDIwMTktMDEtMTQpIgogICBzb2RpcG9kaTpkb2NuYW1lPSJubHBfaWNvbi5zdmciPgogIDxkZWZzCiAgICAgaWQ9ImRlZnMyIiAvPgogIDxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBpZD0iYmFzZSIKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiCiAgICAgYm9yZGVyb3BhY2l0eT0iMS4wIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwLjAiCiAgICAgaW5rc2NhcGU6cGFnZXNoYWRvdz0iMiIKICAgICBpbmtzY2FwZTp6b29tPSI1LjYiCiAgICAgaW5rc2NhcGU6Y3g9IjE2Mi43NjA1MSIKICAgICBpbmtzY2FwZTpjeT0iNzAuOTU0NDE1IgogICAgIGlua3NjYXBlOmRvY3VtZW50LXVuaXRzPSJtbSIKICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJsYXllcjEiCiAgICAgc2hvd2dyaWQ9ImZhbHNlIgogICAgIGZpdC1tYXJnaW4tdG9wPSIwIgogICAgIGZpdC1tYXJnaW4tbGVmdD0iLTAuMSIKICAgICBmaXQtbWFyZ2luLXJpZ2h0PSIwIgogICAgIGZpdC1tYXJnaW4tYm90dG9tPSIwIgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTU3MyIKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSIxMDgwIgogICAgIGlua3NjYXBlOndpbmRvdy14PSIzNTIxIgogICAgIGlua3NjYXBlOndpbmRvdy15PSIyMjYiCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMCIgLz4KICA8bWV0YWRhdGEKICAgICBpZD0ibWV0YWRhdGE1Ij4KICAgIDxyZGY6UkRGPgogICAgICA8Y2M6V29yawogICAgICAgICByZGY6YWJvdXQ9IiI+CiAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+CiAgICAgICAgPGRjOnR5cGUKICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIiAvPgogICAgICAgIDxkYzp0aXRsZT48L2RjOnRpdGxlPgogICAgICA8L2NjOldvcms+CiAgICA8L3JkZjpSREY+CiAgPC9tZXRhZGF0YT4KICA8ZwogICAgIGlua3NjYXBlOmxhYmVsPSJMYXllciAxIgogICAgIGlua3NjYXBlOmdyb3VwbW9kZT0ibGF5ZXIiCiAgICAgaWQ9ImxheWVyMSIKICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSg4MS4xNzM3MzEsLTE2OC43OTkxOCkiPgogICAgPHBhdGgKICAgICAgIHN0eWxlPSJmaWxsOiNmOWNmY2Y7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOiM0NzcwYzc7c3Ryb2tlLXdpZHRoOjAuOTQ5OTk5OTk7c3Ryb2tlLWxpbmVjYXA6YnV0dDtzdHJva2UtbGluZWpvaW46bWl0ZXI7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIKICAgICAgIGQ9Im0gLTUyLjM1MzE5NCwxODAuNzE0ODggMy4zNDA4NjcsMC41MzQ1NCAxLjgwNDA3LC0xLjMzNjM0IDIuMTM4MTU2LC0wLjA2NjggMi4wNzEzNDEsMC43MzQ5OSAxLjQwMzE2NCwxLjczNzI1IDAuNzM0OTkyLDEuOTM3NzEgLTAuNTM0NTQxLDEuNzM3MjUgLTAuNzUzOTI0LDEuMzM5MyAtMS44NDI2MzMsMS4zOTM3OSAtMS44MTkwMSwwLjI1OTg2IDAuMjQ1Njg5LDMuMTI3MzkgMi4xODc1MzMsLTAuMDU2MyAyLjUwNDA5MSwtMS4yNzU2NyAxLjcwMDg5MiwtMS45MzcxMyAwLjk0NDk0MSwtMS42NzcyNyAwLjUxOTcxOCwtMi4wNTUyNSAtMC4wNDcyNSwtMi4zMTUxIC0wLjY2MTQ1OSwtMS43NzE3NiAtMS4yNTIwNDgsLTEuOTM3MTMgLTEuNTgyNzc0LC0xLjUzNTUzIC0yLjA1NTI0NywtMC44MjY4MiAtMy43MzI1MTQsLTAuMTg4OTkgLTIuMjQ0MjMyLDAuODI2ODIgLTMuMDk0NjgxLDIuNjIyMjEgeiIKICAgICAgIGlkPSJwYXRoMzg3MCIKICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiIC8+CiAgICA8cGF0aAogICAgICAgc3R5bGU9ImZpbGw6I2Y5YTdhNztmaWxsLW9wYWNpdHk6MTtzdHJva2U6IzQ3NzBjNztzdHJva2Utd2lkdGg6My41OTA1NTExNDtzdHJva2UtbGluZWNhcDpidXR0O3N0cm9rZS1saW5lam9pbjptaXRlcjtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIgogICAgICAgZD0iTSAxNDUuODkyNTgsMi45Mzc1IDEyMywzLjUgbCAtMi4wMTc1OCwxMy4wMDk3NjYgLTcuNTg5ODQsMy41NzAzMTIgLTEwLjgwMjc0LC05LjEwNTQ2OSAtMTAuODA0Njg0LDguMDM1MTU3IC02LjQyNzczNCw5LjgyMDMxMiA4LjU3MDMxMiw5LjI4NzExIDAuNDM5NDU0LDYuMzgyODEyIDIuMTUwMzksMS44MzAwNzggMTAuNzE0ODQyLC0xLjk2Mjg5IDEzLjIxNDg1LC0xMC44OTI1NzkgMTMuOTI3NzMsLTQuMDE5NTMxIDE0LjYyMzA1LDQuMjEyODkxIDAuMDM3MSwwLjE4NTU0NyAxMS4xNDg0MywxMyAyLjY5NTMyLDguNzAzMTI1IDAuMzE0NDUsOS45MzE2NCAtMS41MTE3Miw1LjY2Nzk2OSAtOC41MTU2MiwxMS43NDQxNDEgLTIuNTgyMDQsMi4xMjY5NTMgLTcuODE2NCwzLjk4MjQyMiAtOC4yNjc1OCwwLjIxMjg5IHYgMC43MTI4OTEgbCAtOC45MTk5MiwwLjQ1NzAzMSAtMTUuNDgwNDcsLTEwLjc2OTUzMSAtNS4wMDU4NiwtOS4zNjkxNDEgLTAuMzczMDUsLTguMjYxNzE4IC04Ljc3OTI5NCwwLjE2OTkyMSAyLjMyODEyNSw0Ny4zMzk4NDEgNS45MTAxNTksMC43NzczNSA5LjQxNjAxLC0xMC42NTAzOTQgOS4xNDg0NCwzLjI5MTAxNCAwLjE3MzgzLDE1Ljc0NDE0IDEzLjI0NjA5LDEuNTI5MyAxMS4xMTEzMywtMi42Mjg5MSAwLjk3NDYxLC0xNC4xMjg5IDcuMDg1OTQsLTIuOTk2MSA1LjkyMTg3LDUuOTU3MDMgNi40ODY2MSw0Ljk2ODIgMTIuMzU5MSwtMTQuNzEyMzM2IGMgMCwwIDMuOTEyNjgsLTMuNzUyOTc4IDMuNTIzMTUsLTYuMzU0NjMyIGwgLTMuNDU0NzksLTMuMTE0MTE4IC03Ljg2OTE1LC02LjEwMTU2MyA1LjM4MzkzLC0xMC4zNDg3NzIgOS43NzM0NCwwLjMwNjY0IDYuMzc4OTEsLTAuNzgwMTMzIDEuMTYwMTUsLTEwLjgwNDEzIEwgMTkyLjU4OSw0OC4yOTU0OCAxNzcuNTEzNjYsNDkuMDE5NTMxIDE3Ni4zNjkxMyw0NS40NjY3OTcgMTczLjkyNzcyLDM5LjM2NzE4OCAxODAsMzMuNTYyNSBsIDQuNDY0MjksLTMuNzQ5NDQyIC05LjY5MDg1LC0xMS4wMTIyNzcgLTAuNjg3NSwtMC44ODY3MTkgLTAuNDQ1MzIsLTAuMjc5Mjk2IC01LjUxNTYyLC01LjY3OTY4OCAtMi4xMzU4OCwtMC44MzU2NTkgLTEuODQ4NSwwLjU2MDI2OSAtMi41NjA1NCwyLjQ1NzAzMSAtMC40MTk5MiwwLjE0MDYyNSAtMC45NDE0MSwxLjE2NjAxNSAtNS4xOTUzMSw0Ljk4NjMyOSAtMi4yMjI2NiwwLjE5NzI2NSAtNC41ODU5NCwtMy4wNDY4NzUgeiIKICAgICAgIHRyYW5zZm9ybT0ibWF0cml4KDAuMjY0NTgzMzMsMCwwLDAuMjY0NTgzMzMsLTgxLjE1MTQ4NiwxNjguNTA3MDQpIgogICAgICAgaWQ9InBhdGgzODcyIgogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIKICAgICAgIHNvZGlwb2RpOm5vZGV0eXBlcz0iY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjYyIgLz4KICAgIDxwYXRoCiAgICAgICBzdHlsZT0iZmlsbDojZTBlYmZjO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTojNDc3MGM3O3N0cm9rZS13aWR0aDozLjc3OTUyNzY2O3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjEiCiAgICAgICBkPSJtIDI3LjE1NjI1LDQ2LjI0MjE4OCBjIC0xNC4yNTM0MzQsMCAtMjUuNzI4NTE1Niw5Ljk0NTA2NCAtMjUuNzI4NTE1NiwyMi4yOTg4MjggdiA0Mi41NDQ5MjQgYyAwLDEyLjM1Mzc2IDExLjQ3NTA4MTYsMjIuMjk4ODMgMjUuNzI4NTE1NiwyMi4yOTg4MyBoIDI4LjUyMTQ4NCBsIC0wLjk0NTMxMiwxNS4wODk4NCAxLjk2NDg0NCwxLjA3MjI3IEwgNjkuODc2OTUzLDE0MCBsIDkuOTgyNDIyLC02LjYxNTIzIGggMjYuOTEyMTA1IGMgMTQuMjUzNDQsMCAyNS43Mjg1MiwtOS45NDUwNyAyNS43Mjg1MiwtMjIuMjk4ODMgViA2OC41NDEwMTYgYyAwLC0xMi4zNTM3NjQgLTExLjQ3NTA4LC0yMi4yOTg4MjggLTI1LjcyODUyLC0yMi4yOTg4MjggeiIKICAgICAgIHRyYW5zZm9ybT0ibWF0cml4KDAuMjY0NTgzMzMsMCwwLDAuMjY0NTgzMzMsLTgxLjE1MTQ4NiwxNjguNTA3MDQpIgogICAgICAgaWQ9InJlY3QzNzcwIgogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIgLz4KICAgIDxwYXRoCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIgogICAgICAgaWQ9InBhdGgzNzM4IgogICAgICAgZD0ibSAtNzUuNzYwMzc3LDE5Ni43MTAxNCBjIC0wLjE3MDMzNCwtMC4yNzI3NSAtMC4yNzY5MzksLTAuNzE5MjMgLTAuMjM2OTAxLC0wLjk5MjE5IDAuMDY5ODIsLTAuNDc1OTYgMC41NzMzNzgsLTAuNDk5MDkgMTIuMzAwODQxLC0wLjU2NTA4IDEwLjM1MDAxNywtMC4wNTgyIDEyLjI4NjUwMywtMC4wMTAzIDEyLjYwODY3MiwwLjMxMTgzIDAuNDkzMjg0LDAuNDkzMjkgMC40ODI1MjEsMC41ODExMiAtMC4xNDg1MzcsMS4yMTIxOCAtMC41MTM0MDIsMC41MTM0IC0wLjg4MTk0MywwLjUyOTE3IC0xMi4zNzE3NzIsMC41MjkxNyAtMTEuMjkxMjk1LDAgLTExLjg1NzAyMiwtMC4wMjMxIC0xMi4xNTIzMDMsLTAuNDk1OTEgeiBtIDAsLTcuNDA4MzMgYyAtMC4xNzAzMzQsLTAuMjcyNzUgLTAuMjc2OTQsLTAuNzE5MjQgLTAuMjM2OTAyLC0wLjk5MjE5IDAuMDY5NzgsLTAuNDc1NzUgMC41Njk4NTMsLTAuNDk5MjUgMTIuMDg2MTU3LC0wLjU2ODA0IDEzLjQ4MjA5MSwtMC4wODA1IDE0LjE5NjI4LDAuMDA2IDEyLjY3NDgyLDEuNTI2OTcgLTAuNTEzNDAyLDAuNTEzNCAtMC44ODE5NDMsMC41MjkxNiAtMTIuMzcxNzcyLDAuNTI5MTYgLTExLjI5MTI5NSwwIC0xMS44NTcwMjIsLTAuMDIzMSAtMTIuMTUyMzAzLC0wLjQ5NTkgeiIKICAgICAgIHN0eWxlPSJmaWxsOiM0NzcwYzc7c3Ryb2tlLXdpZHRoOjAuMjY0NTgzMzIiCiAgICAgICBzb2RpcG9kaTpub2RldHlwZXM9ImNjY2Njc2NjY2Njc2MiIC8+CiAgICA8cGF0aAogICAgICAgc3R5bGU9ImZpbGw6I2ZmNjYwMDtmaWxsLW9wYWNpdHk6MTtzdHJva2U6IzFhMWExYTtzdHJva2Utd2lkdGg6MC4wNDQ2NDI4NjtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZSIKICAgICAgIGQ9IiIKICAgICAgIGlkPSJwYXRoMzgyMyIKICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiCiAgICAgICB0cmFuc2Zvcm09Im1hdHJpeCgwLjI2NDU4MzMzLDAsMCwwLjI2NDU4MzMzLC04MS4xNTE0ODYsMTY4LjUwNzA0KSIgLz4KICAgIDxwYXRoCiAgICAgICBzdHlsZT0iZmlsbDojZmY2NjAwO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTojMWExYTFhO3N0cm9rZS13aWR0aDowLjA0NDY0Mjg2O3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lIgogICAgICAgZD0iIgogICAgICAgaWQ9InBhdGgzODI5IgogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIKICAgICAgIHRyYW5zZm9ybT0ibWF0cml4KDAuMjY0NTgzMzMsMCwwLDAuMjY0NTgzMzMsLTgxLjE1MTQ4NiwxNjguNTA3MDQpIiAvPgogICAgPHBhdGgKICAgICAgIHN0eWxlPSJmaWxsOiNmZjY2MDA7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOiMxYTFhMWE7c3Ryb2tlLXdpZHRoOjAuMDQ0NjQyODY7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmUiCiAgICAgICBkPSIiCiAgICAgICBpZD0icGF0aDM4MzEiCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIgogICAgICAgdHJhbnNmb3JtPSJtYXRyaXgoMC4yNjQ1ODMzMywwLDAsMC4yNjQ1ODMzMywtODEuMTUxNDg2LDE2OC41MDcwNCkiIC8+CiAgPC9nPgo8L3N2Zz4K";

const _partsOfSpeech = {
    noun: "NN",
    "proper noun": "NNP",
    verb: "VB",
    adverb: "RB",
    adjective: "JJ",
    number: "CD",
};

/**
 * Class for the text processing-related blocks in Scratch 3.0
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */
class Scratch3TextProcessingBlocks {
    constructor(runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.scratch_vm = runtime;
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        // Set the video display properties to defaults the first time
        // getInfo is run. This turns on the video device when it is
        // first added to a project, and is overwritten by a PROJECT_LOADED
        // event listener that later calls updateVideoDisplay
        // Return extension definition
        return {
            id: "textProcessing",
            name: formatMessage({
                id: "textProcessing.categoryName",
                default: "Text Processing",
                description: "Label for the Text Processing extension category",
            }),
            blockIconURI: blockIconURI,
            menuIconURI: menuIconURI,
            //color1, color2, color3
            blocks: [
                {
                    opcode: "splitString",
                    text: formatMessage({
                        id: "textClassification.splitString",
                        default: "word [NUM] of [TEXT]",
                        description:
                            "Reporter block that returns the nth word of an input string",
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        NUM: {
                            type: ArgumentType.NUMBER,
                            defaultValue: "1",
                        },
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "Here comes the robot",
                        },
                    },
                },
                {
                    opcode: "getPartOfSpeech",
                    text: formatMessage({
                        id: "textClassification.getPartOfSpeech",
                        default: "[POS] from [TEXT]",
                        description:
                            "Reporter block that returns the 1st match for a requested part of speech",
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        POS: {
                            type: ArgumentType.STRING,
                            menu: "parts_of_speech",
                            defaultValue: "noun",
                        },
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "My name is Scratch Cat",
                        },
                    },
                },
                {
                    opcode: "getPartOfSpeechAll",
                    text: formatMessage({
                        id: "textClassification.getPartOfSpeechAll",
                        default: "all [POS] from [TEXT]",
                        description:
                            "Reporter block that returns all matches for a requested part of speech",
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        POS: {
                            type: ArgumentType.STRING,
                            menu: "parts_of_speech_plural",
                            defaultValue: "nouns",
                        },
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "My name is Scratch Cat",
                        },
                    },
                },
                {
                    opcode: "getWordsLike",
                    text: formatMessage({
                        id: "textClassification.getWordsLike",
                        default: "get [LIST] words from [TEXT]",
                        description:
                            "Reporter block that returns words that match target words",
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        LIST: {
                            type: ArgumentType.STRING,
                            menu: "runtime_lists",
                            defaultValue: this.getListNames()[0],
                        },
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "No I don't like them",
                        },
                    },
                },
                {
                    opcode: "removeWordsLike",
                    text: formatMessage({
                        id: "textClassification.removeWordsLike",
                        default: "remove [LIST] words from [TEXT]",
                        description:
                            "Reporter block that returns the input string minus words that match target words",
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        LIST: {
                            type: ArgumentType.STRING,
                            menu: "runtime_lists",
                            defaultValue: this.getListNames()[1],
                        },
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "My name is Scratch Cat",
                        },
                    },
                },
            ],
            menus: {
                parts_of_speech: {
                    acceptReporters: true,
                    items: Object.keys(_partsOfSpeech),
                },
                parts_of_speech_plural: {
                    acceptReporters: true,
                    items: Object.keys(_partsOfSpeech).map((e) => {
                        return (e += "s");
                    }),
                },
                runtime_lists: {
                    acceptReporters: true,
                    items: "getListNames",
                },
            },
        };
    }

    splitString(args) {
        let number = Number.parseInt(args.NUM);
        if (number && number > 0) {
            let splitText = args.TEXT.split(" ");
            if (number <= splitText.length) return splitText[number - 1];
        }
        return "";
    }

    getPartOfSpeech(args) {
        let words = new pos.Lexer().lex(args.TEXT);
        let tagger = new pos.Tagger();
        let taggedWords = tagger.tag(words);

        for (let i = 0; i < taggedWords.length; i++) {
            let taggedWord = taggedWords[i];
            if (taggedWord[1].startsWith(_partsOfSpeech[args.POS])) {
                return taggedWord[0];
            }
        }

        // no matches
        return "";
    }

    getPartOfSpeechAll(args) {
        let words = new pos.Lexer().lex(args.TEXT);
        let tagger = new pos.Tagger();
        let taggedWords = tagger.tag(words);

        // collect matches
        let matches = [];

        //
        let partOfSpeech = args.POS.slice(0, -1);
        for (let i = 0; i < taggedWords.length; i++) {
            let taggedWord = taggedWords[i];
            if (taggedWord[1].startsWith(_partsOfSpeech[partOfSpeech])) {
                matches.push(taggedWord[0]);
            }
        }

        // no matches
        return matches.join(" ");
    }

    getWordsLike(args) {
        let lists = this.scratch_vm.getTargetForStage().variables;
        let l = Object.keys(lists).find((x) => lists[x].name === args.LIST);

        // target words can come as a string or list name
        let targetWords = args.LIST.toLowerCase().split(" ");
        if (l) {
            // we've got a list name
            targetWords = lists[l].value.map((x) => x.toLowerCase());
        }

        let splitText = args.TEXT.toLowerCase().split(" ");
        for (let i = 0; i < splitText.length; i++) {
            if (targetWords.includes(splitText[i])) {
                return splitText[i];
            }
        }

        // no matches
        return "";
    }

    removeWordsLike(args) {
        let lists = this.scratch_vm.getTargetForStage().variables;
        let l = Object.keys(lists).find((x) => lists[x].name === args.LIST);

        // target words can come as a string or list name
        let targetWords = args.LIST.toLowerCase().split(" ");
        if (l) {
            // we've got a list name
            targetWords = lists[l].value.map((x) => x.toLowerCase());
        }

        let splitText = args.TEXT.split(" ");
        for (let i = 0; i < splitText.length; i++) {
            let word = splitText[i].toLowerCase();
            if (targetWords.includes(word)) {
                splitText.splice(i, 1);
                i -= 1;
            }
        }

        // no matches
        return splitText.join(" ");
    }

    /**
     * Return label list for block menus
     * @return {array of strings} an array of the list names
     */
    getListNames() {
        // TODO make sure this updates properly
        this.listNames = this.scratch_vm.getAllVarNamesOfType("list");
        return this.listNames;
    }
}

module.exports = Scratch3TextProcessingBlocks;
