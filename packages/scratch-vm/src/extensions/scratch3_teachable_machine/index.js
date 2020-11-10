require("regenerator-runtime/runtime");
const Runtime = require('../../engine/runtime');

const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Clone = require('../../util/clone');
const Cast = require('../../util/cast');
const formatMessage = require('format-message');
const Video = require('../../io/video');

const VideoMotion = require('./library');

const tmImage = require('@teachablemachine/image');
const tmPose = require('@teachablemachine/pose');
const tmAudioSpeechCommands = require('@tensorflow-models/speech-commands');

/**
 * Icon svg to be displayed in the blocks category menu, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const menuIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgaWQ9IkxheWVyXzFfMV8iCiAgIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDY0IDY0IgogICBoZWlnaHQ9IjcyLjc4MDIwNSIKICAgdmlld0JveD0iMCAwIDkuMTk5MTIzNCA5LjA5NzUyNTYiCiAgIHdpZHRoPSI3My41OTI5ODciCiAgIHZlcnNpb249IjEuMSIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMC40OC40IHI5OTM5IgogICBzb2RpcG9kaTpkb2NuYW1lPSJ0ZWFjaGFibGUtbWFjaGluZS1ibG9ja3MtbWVudS5zdmciPgogIDxtZXRhZGF0YQogICAgIGlkPSJtZXRhZGF0YTIxIj4KICAgIDxyZGY6UkRGPgogICAgICA8Y2M6V29yawogICAgICAgICByZGY6YWJvdXQ9IiI+CiAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+CiAgICAgICAgPGRjOnR5cGUKICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIiAvPgogICAgICAgIDxkYzp0aXRsZSAvPgogICAgICA8L2NjOldvcms+CiAgICA8L3JkZjpSREY+CiAgPC9tZXRhZGF0YT4KICA8ZGVmcwogICAgIGlkPSJkZWZzMTkiIC8+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiIKICAgICBib3JkZXJvcGFjaXR5PSIxIgogICAgIG9iamVjdHRvbGVyYW5jZT0iMTAiCiAgICAgZ3JpZHRvbGVyYW5jZT0iMTAiCiAgICAgZ3VpZGV0b2xlcmFuY2U9IjEwIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwIgogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxODU1IgogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjEwNTYiCiAgICAgaWQ9Im5hbWVkdmlldzE3IgogICAgIHNob3dncmlkPSJmYWxzZSIKICAgICBmaXQtbWFyZ2luLXRvcD0iMCIKICAgICBmaXQtbWFyZ2luLWxlZnQ9IjAiCiAgICAgZml0LW1hcmdpbi1yaWdodD0iMCIKICAgICBmaXQtbWFyZ2luLWJvdHRvbT0iMCIKICAgICBpbmtzY2FwZTp6b29tPSIxMC40Mjk4MjUiCiAgICAgaW5rc2NhcGU6Y3g9IjI2LjIxNTcyOSIKICAgICBpbmtzY2FwZTpjeT0iNDQuOTAxNTc0IgogICAgIGlua3NjYXBlOndpbmRvdy14PSI2NSIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iMjQiCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSIKICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJMYXllcl8xXzFfIiAvPgogIDxwYXRoCiAgICAgc29kaXBvZGk6dHlwZT0iYXJjIgogICAgIHN0eWxlPSJmaWxsOiM4MGIzZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOiMwMDU1ZDQiCiAgICAgaWQ9InBhdGgyOTkzIgogICAgIHNvZGlwb2RpOmN4PSItNC4zNjI0ODkyIgogICAgIHNvZGlwb2RpOmN5PSIyOC41ODEyMjMiCiAgICAgc29kaXBvZGk6cng9IjMyLjkzNDM5OSIKICAgICBzb2RpcG9kaTpyeT0iMzIuOTM0Mzk5IgogICAgIGQ9Im0gMjguNTcxOTA5LDI4LjU4MTIyMyBhIDMyLjkzNDM5OSwzMi45MzQzOTkgMCAxIDEgLTY1Ljg2ODc5NywwIDMyLjkzNDM5OSwzMi45MzQzOTkgMCAxIDEgNjUuODY4Nzk3LDAgeiIKICAgICB0cmFuc2Zvcm09Im1hdHJpeCgwLjEzNzU1Njk4LDAsMCwwLjEzNjEwMTM3LDUuMjAxMzczMywwLjY1OTI0MTAxKSIgLz4KICA8cGF0aAogICAgIGQ9Im0gMi45NzkxMjMzLDYuMTM3NDI4IGMgMCwwLjEzOTE3NSAtMC4wMzIwMiwwLjI2OTcyOSAtMC4wOTExNCwwLjM4NTUwMyAtMC4xNDA0MDcsMC4yODMyNzcgLTAuNDMzNTM3LDAuNDc2NjQ0IC0wLjc3MTAwNiwwLjQ3NjY0NCAtMC40NzY2NDQsMCAtMC44NjIxNDcsLTAuMzg1NTAzIC0wLjg2MjE0NywtMC44NjIxNDcgMCwtMC40NzY2NDQgMC4zODU1MDMsLTAuODYyMTQ3IDAuODYyMTQ3LC0wLjg2MjE0NyAwLjE3MzY2MSwwIDAuMzMzNzc0LDAuMDUwNSAwLjQ2ODAyMywwLjEzNzk0MyAwLjIzNzcwNiwwLjE1Mzk1NSAwLjM5NDEyNCwwLjQxOTk4OSAwLjM5NDEyNCwwLjcyNDIwNCB6IgogICAgIGlkPSJwYXRoMyIKICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIgogICAgIHN0eWxlPSJmaWxsOiNmNmRiNDA7ZmlsbC1vcGFjaXR5OjEiIC8+CiAgPHBhdGgKICAgICBkPSJtIDcuNTAwMjMwNywzLjg1NzIzOTMgYyAwLjQ3NjY0NCwwIDAuODYyMTQ3LDAuMzg1NTAzIDAuODYyMTQ3LDAuODYyMTQ3IDAsMC40NzY2NDQgLTAuMzg1NTAzLDAuODYyMTQ3IC0wLjg2MjE0NywwLjg2MjE0NyAtMC4yMzE1NDgsMCAtMC40NDA5MjYsLTAuMDg5OTEgLTAuNTk0ODgxLC0wLjI0MDE3IC0wLjE2NTA0LC0wLjE1NTE4NiAtMC4yNjcyNjYsLTAuMzc2ODgxIC0wLjI2NzI2NiwtMC42MjE5NzcgMCwtMC4wMzk0MSAwLjAwMjUsLTAuMDc3NTkgMC4wMDg2LC0wLjExNTc3NCAwLjAyNDYzLC0wLjE5MjEzNiAwLjExMzMxMSwtMC4zNjMzMzQgMC4yNDM4NjQsLTAuNDkzODg3IDAuMTU2NDE4LC0wLjE1NjQxOCAwLjM3MDcyMywtMC4yNTI0ODYgMC42MDk2NjEsLTAuMjUyNDg2IHoiCiAgICAgaWQ9InBhdGg3IgogICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiCiAgICAgc3R5bGU9ImZpbGw6I2Y2ZGI0MCIgLz4KICA8cGF0aAogICAgIHN0eWxlPSJmaWxsOiNmNmRiNDA7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmUiCiAgICAgZD0iTSAxLjY4NDIxODQsMy42NDE0NDEgQyAxLjI2Mjk5MDEsMy4zNjI3MjQzIDEuMjAwNjM5NiwyLjc0NjIxMjcgMS41NTU3MTA2LDIuMzcwNzc1NyAxLjkwMjI1OTEsMi4wMDQzNTAxIDIuNDk1MTc4NSwyLjA2MzM0NTYgMi43Nzk0OTE4LDIuNDkyNTQxOSAzLjI0NDkyNjgsMy4xOTUxNTc3IDIuMzgwMzU2Myw0LjEwMjA1ODMgMS42ODQyMTg0LDMuNjQxNDQxIHoiCiAgICAgaWQ9InBhdGgyOTg4IgogICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiIC8+CiAgPHBhdGgKICAgICBzdHlsZT0iZmlsbDojZjZkYjQwO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lIgogICAgIGQ9Ik0gNC4zMDQ5MDQ0LDIuNTc3NjY4MiBDIDQuMDEyNzcwNiwyLjMyODI3MTUgMy45MzQyNTU5LDIuMDAxMTIzMSA0LjA4MTAxMTIsMS42NDQ3Njk3IDQuMzA2NDE4NCwxLjA5NzQzMjkgNC45Nzg0MTEzLDAuOTI2NTkzODcgNS4zODg2NTEzLDEuMzEyMzMxNiA2LjE5NzgyNzQsMi4wNzMxNzg3IDUuMTQ4NzM2NSwzLjI5ODA1MjUgNC4zMDQ5MDQ0LDIuNTc3NjY4MiB6IgogICAgIGlkPSJwYXRoMjk5MCIKICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPgogIDxwYXRoCiAgICAgc3R5bGU9ImZpbGw6I2Y2ZGI0MDtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZSIKICAgICBkPSJNIDQuMzc4NDk3Miw0Ljk3NTcwMTEgQyAzLjgyNzgzNjUsNC42NDA5NTU0IDMuODkyODQ1NiwzLjg1MDQyNzMgNC40OTM4MTgyLDMuNTczMzY5NCA0Ljg2NjA4OCwzLjQwMTc0NjkgNS4yODkzODIyLDMuNTMwMjgyNCA1LjUxMDExNzUsMy44ODE5NzM4IDUuNzMwMTg2Miw0LjIzMjYwMzMgNS43MDg5NzY2LDQuNTI0NDQ5MiA1LjQ0MjU2MDksNC44MTE1NjA4IDUuMTQ1NjQ4OCw1LjEzMTUzNzcgNC43MzgyMzQzLDUuMTk0Mzg0NiA0LjM3ODQ5NzIsNC45NzU3MDExIHoiCiAgICAgaWQ9InBhdGgyOTkyIgogICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiIC8+CiAgPHBhdGgKICAgICBzdHlsZT0iZmlsbDojZjZkYjQwO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lIgogICAgIGQ9Ik0gNC4zMjQ2MjY4LDcuOTgyMDc1MSBDIDQuMDM2Njg0OCw3LjczNzk3NTQgMy45NTkyOTY1LDcuNDE3Nzc1MiA0LjEwMzk0NjIsNy4wNjg5OTA0IDQuMzI2MTE5LDYuNTMzMjc4MiA0Ljk4ODQ2OTUsNi4zNjYwNjc2IDUuMzkyODIzLDYuNzQzNjEyOCA2LjE5MDM4ODUsNy40ODgzMDA1IDUuMTU2MzUwNyw4LjY4NzE1OTcgNC4zMjQ2MjY4LDcuOTgyMDc1MSB6IgogICAgIGlkPSJwYXRoMjk5NCIKICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPgogIDxwYXRoCiAgICAgc3R5bGU9ImZpbGw6I2Y2ZGI0MDtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZSIKICAgICBkPSIiCiAgICAgaWQ9InBhdGgzMDAxIgogICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiIC8+CiAgPHBhdGgKICAgICBkPSJtIDIuNTQzNjE2Myw1LjI1MDY0OCBjIC0wLjEyOTMyMiwtMC4wNjI0NCAtMC4yNzM2NywtMC4wOTg1MyAtMC40MjY2NCwtMC4wOTg1MyAtMC41NDMyNzUsMCAtMC45ODUzMTEsMC40NDIwMzUgLTAuOTg1MzExLDAuOTg1MzExIDAsMC41NDMyNzYgMC40NDIwMzYsMC45ODUzMTEgMC45ODUzMTEsMC45ODUzMTEgMC4zNDA5MTgsMCAwLjY0MTgwNywtMC4xNzQxNTQgMC44MTg3OTMsLTAuNDM4MDk0IGwgMC45MzA3NSwwLjQ2NTkyOSBjIC0wLjAxNjAxLDAuMDcwMzMgLTAuMDI1MjUsMC4xNDMzNjIgLTAuMDI1MjUsMC4yMTg0OTIgMCwwLjU0MzI3NiAwLjQ0MjAzNSwwLjk4NTMxMSAwLjk4NTMxMSwwLjk4NTMxMSAwLjU0MzI3NSwwIDAuOTg1MzEsLTAuNDQyMDM1IDAuOTg1MzEsLTAuOTg1MzExIDAsLTAuMjA0MjA1IC0wLjA2MjQ0LC0wLjM5NDAwMSAtMC4xNjkzNSwtMC41NTE1MjcgbCAxLjMwNzg3NywtMS4zNjc0ODkgYyAwLjE2NDA1NCwwLjEyMTY4NiAwLjM2NjI4OSwwLjE5NDcyMiAwLjU4NTc2NywwLjE5NDcyMiAwLjU0MzI3NiwwIDAuOTg1MzExLC0wLjQ0MjAzNSAwLjk4NTMxMSwtMC45ODUzMSAwLC0wLjU0MzI3NiAtMC40NDIwMzUsLTAuOTg1MzExIC0wLjk4NTMxMSwtMC45ODUzMTEgLTAuMjI3MzYsMCAtMC40MzYyNDYsMC4wNzgwOSAtMC42MDMyNTYsMC4yMDc5MDEgTCA1LjYwMzk5MDMsMi41NTMxMTUgYyAwLjEyOTgxNSwtMC4xNjcwMSAwLjIwNzksLTAuMzc1ODk2IDAuMjA3OSwtMC42MDMyNTcgMCwtMC41NDMyNzUgLTAuNDQyMDM1LC0wLjk4NTMxMTAyIC0wLjk4NTMxLC0wLjk4NTMxMTAyIC0wLjU0MzI3NiwwIC0wLjk4NTMxMSwwLjQ0MjAzNjAyIC0wLjk4NTMxMSwwLjk4NTMxMTAyIDAsMC4wNzQ4OCAwLjAwOTEsMC4xNDc2NzQgMC4wMjUxMiwwLjIxNzg3NyBMIDIuOTkyOTExMywyLjQ4NTk5IEMgMi44MjkyMzMzLDIuMTY4MTA0IDIuNDk4NDE1MywxLjk0OTg1NyAyLjExNjk3NjMsMS45NDk4NTcgYyAtMC41NDMyNzUsMCAtMC45ODUzMTEsMC40NDIwMzUgLTAuOTg1MzExLDAuOTg1MzExIDAsMC41NDMyNzYgMC40NDIwMzYsMC45ODUzMTEgMC45ODUzMTEsMC45ODUzMTEgMC4xNDAxNjEsMCAwLjI3MzMwMSwtMC4wMjk4MSAwLjM5NDEyNSwtMC4wODI4OSBsIDAuNDUzMzY2LDAuNzYzIHogbSAtMC40MjY2NCwxLjYyNTc2MyBjIC0wLjQwNzU0OSwwIC0wLjczODk4MywtMC4zMzE0MzQgLTAuNzM4OTgzLC0wLjczODk4MyAwLC0wLjQwNzU0OSAwLjMzMTQzNCwtMC43Mzg5ODMgMC43Mzg5ODMsLTAuNzM4OTgzIDAuNDA3NTQ5LDAgMC43Mzg5ODMsMC4zMzE0MzQgMC43Mzg5ODMsMC43Mzg5ODMgMCwwLjQwNzU0OSAtMC4zMzE0MzQsMC43Mzg5ODMgLTAuNzM4OTgzLDAuNzM4OTgzIHogbSAwLjkyODUzMiwtMC40MTI0NzYgYyAwLjAzNjA5LC0wLjEwMjM0OSAwLjA1Njc4LC0wLjIxMTk2NSAwLjA1Njc4LC0wLjMyNjUwNyAwLC0wLjMwMjEyMSAtMC4xMzY5NTgsLTAuNTcyNTg5IC0wLjM1MTYzMywtMC43NTMzOTMgbCAwLjM1NDIxOSwtMC41NDcwOTQgMS4wNjc5NTQsMS43OTcwODMgYyAtMC4wODk5MSwwLjA4MDA2IC0wLjE2NTE2MywwLjE3NTg3OCAtMC4yMjA5NTYsMC4yODM2NDcgeiBtIDEuNzgxMDczLC0zLjUyODc2NyBjIDAuMjI3MzYsMCAwLjQzNjI0NiwtMC4wNzgwOSAwLjYwMzI1NiwtMC4yMDc5MDEgbCAxLjMyOTA2MSwxLjMyOTA2MSBjIC0wLjA3OTY5LDAuMTAyNDczIC0wLjEzOTI5OCwwLjIyMDgzMyAtMC4xNzM2NjEsMC4zNDk2NjMgTCA1LjgxMTUyMjMsNC4yOTk1NzcgYyAtMS4yM2UtNCwtMC4wMDMyIDMuNjllLTQsLTAuMDA2NCAzLjY5ZS00LC0wLjAwOTYgMCwtMC41NDMyNzUgLTAuNDQyMDM1LC0wLjk4NTMxMSAtMC45ODUzMSwtMC45ODUzMTEgLTAuMzQwOTE4LDAgLTAuNjQxOTMsMC4xNzQxNTQgLTAuODE4NzkzLDAuNDM4MDk0IEwgMy44NjA4NTMzLDMuNjY5MzUgNC40MDAwNjQzLDIuODM2NjM5IGMgMC4xMjkxOTksMC4wNjI0NCAwLjI3MzU0NywwLjA5ODUzIDAuNDI2NTE3LDAuMDk4NTMgeiBtIDAuMTIzMTY0LDMuNDU3MDg2IFYgNS4yNjY2NTkgYyAwLjQwMDI4MiwtMC4wNTAyNSAwLjcyNTkyNywtMC4zNDExNjMgMC44Mjc5MDcsLTAuNzIzMjE4IGwgMC43NzM3MTUsMC4xMDY0MTQgYyAwLDAuMDAzMiAtNC45MmUtNCwwLjAwNjQgLTQuOTJlLTQsMC4wMDk2IDAsMC4yMzUyNDMgMC4wODMwMSwwLjQ1MTE0OSAwLjIyMTA3OSwwLjYyMDc0NiBMIDUuNDc4NzMzMyw2LjYzMjQxNiBDIDUuMzMzNzY5Myw2LjUwMzk1NiA1LjE1MTM2NDMsNi40MTc2MTkgNC45NDk3NDUzLDYuMzkyMjQ3IHogTSA0LjgyNjU4MTMsMy41NTA5ODcgYyAwLjQwNzU0OSwwIDAuNzM4OTgzLDAuMzMxNDM0IDAuNzM4OTgzLDAuNzM4OTgzIDAsMC40MDc1NDkgLTAuMzMxNDM0LDAuNzM4OTgzIC0wLjczODk4MywwLjczODk4MyAtMC40MDc1NDksMCAtMC43Mzg5ODMsLTAuMzMxNDM0IC0wLjczODk4MywtMC43Mzg5ODMgMCwtMC40MDc1NDkgMC4zMzE0MzQsLTAuNzM4OTgzIDAuNzM4OTgzLC0wLjczODk4MyB6IG0gLTAuOTI4NTMyLDAuNDEyNDc2IGMgLTAuMDM2MDksMC4xMDIzNDkgLTAuMDU2NzgsMC4yMTE5NjUgLTAuMDU2NzgsMC4zMjY1MDcgMCwwLjUwMTUyMyAwLjM3Njg4MSwwLjkxNTg0NyAwLjg2MjE0NywwLjk3NjgxMyB2IDEuMTI1NTk0IGMgLTAuMTE2NzU5LDAuMDE0NjYgLTAuMjI2OTkxLDAuMDQ5NjQgLTAuMzI3MzcsMC4xMDE0ODcgTCAzLjI1NDI3MDMsNC42MDYxMzIgMy43MjYxMTEzLDMuODc3NDk1IHogbSAwLjkyODUzMiw0LjE0NDU4NiBjIC0wLjQwNzU0OSwwIC0wLjczODk4MywtMC4zMzE0MzQgLTAuNzM4OTgzLC0wLjczODk4MyAwLC0wLjQwNzU0OSAwLjMzMTQzNCwtMC43Mzg5ODMgMC43Mzg5ODMsLTAuNzM4OTgzIDAuNDA3NTQ5LDAgMC43Mzg5ODMsMC4zMzE0MzQgMC43Mzg5ODMsMC43Mzg5ODMgMCwwLjQwNzU0OSAtMC4zMzE0MzQsMC43Mzg5ODMgLTAuNzM4OTgzLDAuNzM4OTgzIHogbSAyLjcwOTYwNCwtNC4xODc1NyBjIDAuNDA3NTQ5LDAgMC43Mzg5ODMsMC4zMzE0MzQgMC43Mzg5ODMsMC43Mzg5ODMgMCwwLjQwNzU0OSAtMC4zMzE0MzQsMC43Mzg5ODMgLTAuNzM4OTgzLDAuNzM4OTgzIC0wLjQwNzU0OSwwIC0wLjczODk4MywtMC4zMzE0MzQgLTAuNzM4OTgzLC0wLjczODk4MyAwLC0wLjQwNzU0OSAwLjMzMTQzNCwtMC43Mzg5ODMgMC43Mzg5ODMsLTAuNzM4OTgzIHogTSA0LjgyNjU4MTMsMS4yMTA4NzQgYyAwLjQwNzU0OSwwIDAuNzM4OTgzLDAuMzMxNDM0IDAuNzM4OTgzLDAuNzM4OTgzIDAsMC40MDc1NDkgLTAuMzMxNDM0LDAuNzM4OTgzIC0wLjczODk4MywwLjczODk4MyAtMC40MDc1NDksMCAtMC43Mzg5ODMsLTAuMzMxNDM0IC0wLjczODk4MywtMC43Mzg5ODMgMCwtMC40MDc1NDkgMC4zMzE0MzQsLTAuNzM4OTgzIDAuNzM4OTgzLC0wLjczODk4MyB6IG0gLTAuODc1ODE4LDEuMTg4MTYyIGMgMC4wNjAyMywwLjExNjg4MiAwLjE0MjYyMywwLjIyMDIxNyAwLjI0MjI2MywwLjMwNDIxNCBMIDMuNjM5MjgxMywzLjU1ODUgMy4wNDU2MzIzLDMuMjYxNjc1IGMgMC4wMzU5NiwtMC4xMDIzNDkgMC4wNTY2NSwtMC4yMTE5NjUgMC4wNTY2NSwtMC4zMjY1MDcgMCwtMC4wNzQ4OCAtMC4wMDkxLC0wLjE0NzY3MyAtMC4wMjUxMiwtMC4yMTc4NzcgeiBtIC0yLjU3Mjc3LDAuNTM2MTMyIGMgMCwtMC40MDc1NDkgMC4zMzE0MzQsLTAuNzM4OTgzIDAuNzM4OTgzLC0wLjczODk4MyAwLjQwNzU0OSwwIDAuNzM4OTgzLDAuMzMxNDM0IDAuNzM4OTgzLDAuNzM4OTgzIDAsMC40MDc1NDkgLTAuMzMxNDM0LDAuNzM4OTgzIC0wLjczODk4MywwLjczODk4MyAtMC40MDc1NDksMCAtMC43Mzg5ODMsLTAuMzMxNDM0IC0wLjczODk4MywtMC43Mzg5ODMgeiBtIDEuMzQ0MzM0LDAuNzc1ODA5IGMgMC4wODI1MiwtMC4wNjQ1NCAwLjE1NDk0LC0wLjE0MTM5MiAwLjIxMzQ0MiwtMC4yMjg1OTIgbCAwLjU2ODY0OCwwLjI4NDI2MiAtMC4zOTA1NTMsMC42MDMxMzMgeiIKICAgICBpZD0icGF0aDE1IgogICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiCiAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZiIgLz4KPC9zdmc+Cg==';

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgaWQ9IkxheWVyXzFfMV8iCiAgIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDY0IDY0IgogICBoZWlnaHQ9IjU5LjExODY0OSIKICAgdmlld0JveD0iMCAwIDcuMzg5ODMwMSA3LjM4OTgzMTEiCiAgIHdpZHRoPSI1OS4xMTg2NDEiCiAgIHZlcnNpb249IjEuMSIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMC40OC40IHI5OTM5IgogICBzb2RpcG9kaTpkb2NuYW1lPSJ0ZWFjaGFibGUtbWFjaGluZS1ibG9ja3Mtc21hbGwuc3ZnIj4KICA8bWV0YWRhdGEKICAgICBpZD0ibWV0YWRhdGEyMSI+CiAgICA8cmRmOlJERj4KICAgICAgPGNjOldvcmsKICAgICAgICAgcmRmOmFib3V0PSIiPgogICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PgogICAgICAgIDxkYzp0eXBlCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz4KICAgICAgPC9jYzpXb3JrPgogICAgPC9yZGY6UkRGPgogIDwvbWV0YWRhdGE+CiAgPGRlZnMKICAgICBpZD0iZGVmczE5IiAvPgogIDxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiCiAgICAgYm9yZGVyb3BhY2l0eT0iMSIKICAgICBvYmplY3R0b2xlcmFuY2U9IjEwIgogICAgIGdyaWR0b2xlcmFuY2U9IjEwIgogICAgIGd1aWRldG9sZXJhbmNlPSIxMCIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMCIKICAgICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTg1NSIKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSIxMDU2IgogICAgIGlkPSJuYW1lZHZpZXcxNyIKICAgICBzaG93Z3JpZD0iZmFsc2UiCiAgICAgZml0LW1hcmdpbi10b3A9IjAiCiAgICAgZml0LW1hcmdpbi1sZWZ0PSIwIgogICAgIGZpdC1tYXJnaW4tcmlnaHQ9IjAiCiAgICAgZml0LW1hcmdpbi1ib3R0b209IjAiCiAgICAgaW5rc2NhcGU6em9vbT0iMTAuNDI5ODI1IgogICAgIGlua3NjYXBlOmN4PSIxNy4xNjI0MDciCiAgICAgaW5rc2NhcGU6Y3k9IjM4Ljk1NjM5MSIKICAgICBpbmtzY2FwZTp3aW5kb3cteD0iNjUiCiAgICAgaW5rc2NhcGU6d2luZG93LXk9IjI0IgogICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjEiCiAgICAgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0iTGF5ZXJfMV8xXyIgLz4KICA8cGF0aAogICAgIGQ9Im0gMS44NDc0NTgsNS4xNzI4ODEgYyAwLDAuMTM5MTc1IC0wLjAzMjAyLDAuMjY5NzI5IC0wLjA5MTE0LDAuMzg1NTAzIC0wLjE0MDQwNywwLjI4MzI3NyAtMC40MzM1MzcsMC40NzY2NDQgLTAuNzcxMDA2LDAuNDc2NjQ0IC0wLjQ3NjY0NCwwIC0wLjg2MjE0NywtMC4zODU1MDMgLTAuODYyMTQ3LC0wLjg2MjE0NyAwLC0wLjQ3NjY0NCAwLjM4NTUwMywtMC44NjIxNDcgMC44NjIxNDcsLTAuODYyMTQ3IDAuMTczNjYxLDAgMC4zMzM3NzQsMC4wNTA1IDAuNDY4MDIzLDAuMTM3OTQzIDAuMjM3NzA2LDAuMTUzOTU1IDAuMzk0MTI0LDAuNDE5OTg5IDAuMzk0MTI0LDAuNzI0MjA0IHoiCiAgICAgaWQ9InBhdGgzIgogICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiCiAgICAgc3R5bGU9ImZpbGw6I2Y2ZGI0MDtmaWxsLW9wYWNpdHk6MSIgLz4KICA8cGF0aAogICAgIGQ9Im0gNi4zNjg1NjU0LDIuODkyNjkyMyBjIDAuNDc2NjQ0LDAgMC44NjIxNDcsMC4zODU1MDMgMC44NjIxNDcsMC44NjIxNDcgMCwwLjQ3NjY0NCAtMC4zODU1MDMsMC44NjIxNDcgLTAuODYyMTQ3LDAuODYyMTQ3IC0wLjIzMTU0OCwwIC0wLjQ0MDkyNiwtMC4wODk5MSAtMC41OTQ4ODEsLTAuMjQwMTcgLTAuMTY1MDQsLTAuMTU1MTg2IC0wLjI2NzI2NiwtMC4zNzY4ODEgLTAuMjY3MjY2LC0wLjYyMTk3NyAwLC0wLjAzOTQxIDAuMDAyNSwtMC4wNzc1OSAwLjAwODYsLTAuMTE1Nzc0IDAuMDI0NjMsLTAuMTkyMTM2IDAuMTEzMzExLC0wLjM2MzMzNCAwLjI0Mzg2NCwtMC40OTM4ODcgMC4xNTY0MTgsLTAuMTU2NDE4IDAuMzcwNzIzLC0wLjI1MjQ4NiAwLjYwOTY2MSwtMC4yNTI0ODYgeiIKICAgICBpZD0icGF0aDciCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIKICAgICBzdHlsZT0iZmlsbDojZjZkYjQwIiAvPgogIDxwYXRoCiAgICAgc3R5bGU9ImZpbGw6I2Y2ZGI0MDtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZSIKICAgICBkPSJNIDAuNTUyNTUzMDksMi42NzY4OTQgQyAwLjEzMTMyNDgsMi4zOTgxNzczIDAuMDY4OTc0MzIsMS43ODE2NjU3IDAuNDI0MDQ1MzEsMS40MDYyMjg3IDAuNzcwNTkzODEsMS4wMzk4MDMxIDEuMzYzNTEzMiwxLjA5ODc5ODYgMS42NDc4MjY1LDEuNTI3OTk0OSAyLjExMzI2MTUsMi4yMzA2MTA3IDEuMjQ4NjkxLDMuMTM3NTExMyAwLjU1MjU1MzA5LDIuNjc2ODk0IHoiCiAgICAgaWQ9InBhdGgyOTg4IgogICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiIC8+CiAgPHBhdGgKICAgICBzdHlsZT0iZmlsbDojZjZkYjQwO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lIgogICAgIGQ9Ik0gMy4xNzMyMzkxLDEuNjEzMTIxMiBDIDIuODgxMTA1MywxLjM2MzcyNDUgMi44MDI1OTA2LDEuMDM2NTc2MSAyLjk0OTM0NTksMC42ODAyMjI3NiAzLjE3NDc1MzEsMC4xMzI4ODU5IDMuODQ2NzQ2LC0wLjAzNzk1MzExIDQuMjU2OTg2LDAuMzQ3Nzg0NjEgNS4wNjYxNjIxLDEuMTA4NjMxNyA0LjAxNzA3MTIsMi4zMzM1MDU1IDMuMTczMjM5MSwxLjYxMzEyMTIgeiIKICAgICBpZD0icGF0aDI5OTAiCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIgLz4KICA8cGF0aAogICAgIHN0eWxlPSJmaWxsOiNmNmRiNDA7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmUiCiAgICAgZD0iTSAzLjI0NjgzMTksNC4wMTExNTQxIEMgMi42OTYxNzEyLDMuNjc2NDA4NCAyLjc2MTE4MDMsMi44ODU4ODAzIDMuMzYyMTUyOSwyLjYwODgyMjQgMy43MzQ0MjI3LDIuNDM3MTk5OSA0LjE1NzcxNjksMi41NjU3MzU0IDQuMzc4NDUyMiwyLjkxNzQyNjggNC41OTg1MjA5LDMuMjY4MDU2MyA0LjU3NzMxMTMsMy41NTk5MDIyIDQuMzEwODk1NiwzLjg0NzAxMzggNC4wMTM5ODM1LDQuMTY2OTkwNyAzLjYwNjU2OSw0LjIyOTgzNzYgMy4yNDY4MzE5LDQuMDExMTU0MSB6IgogICAgIGlkPSJwYXRoMjk5MiIKICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPgogIDxwYXRoCiAgICAgc3R5bGU9ImZpbGw6I2Y2ZGI0MDtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZSIKICAgICBkPSJNIDMuMTkyOTYxNSw3LjAxNzUyODEgQyAyLjkwNTAxOTUsNi43NzM0Mjg0IDIuODI3NjMxMiw2LjQ1MzIyODIgMi45NzIyODA5LDYuMTA0NDQzNCAzLjE5NDQ1MzcsNS41Njg3MzEyIDMuODU2ODA0Miw1LjQwMTUyMDYgNC4yNjExNTc3LDUuNzc5MDY1OCA1LjA1ODcyMzIsNi41MjM3NTM1IDQuMDI0Njg1NCw3LjcyMjYxMjcgMy4xOTI5NjE1LDcuMDE3NTI4MSB6IgogICAgIGlkPSJwYXRoMjk5NCIKICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPgogIDxwYXRoCiAgICAgc3R5bGU9ImZpbGw6I2Y2ZGI0MDtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZSIKICAgICBkPSIiCiAgICAgaWQ9InBhdGgzMDAxIgogICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiCiAgICAgdHJhbnNmb3JtPSJzY2FsZSgwLjEyNSwwLjEyNSkiIC8+CiAgPHBhdGgKICAgICBkPSJNIDEuNDExOTUxLDQuMjg2MTAxIEMgMS4yODI2MjksNC4yMjM2NjEgMS4xMzgyODEsNC4xODc1NzEgMC45ODUzMTEsNC4xODc1NzEgMC40NDIwMzYsNC4xODc1NzEgMCw0LjYyOTYwNiAwLDUuMTcyODgyIGMgMCwwLjU0MzI3NiAwLjQ0MjAzNiwwLjk4NTMxMSAwLjk4NTMxMSwwLjk4NTMxMSAwLjM0MDkxOCwwIDAuNjQxODA3LC0wLjE3NDE1NCAwLjgxODc5MywtMC40MzgwOTQgbCAwLjkzMDc1LDAuNDY1OTI5IGMgLTAuMDE2MDEsMC4wNzAzMyAtMC4wMjUyNSwwLjE0MzM2MiAtMC4wMjUyNSwwLjIxODQ5MiAwLDAuNTQzMjc2IDAuNDQyMDM1LDAuOTg1MzExIDAuOTg1MzExLDAuOTg1MzExIDAuNTQzMjc1LDAgMC45ODUzMSwtMC40NDIwMzUgMC45ODUzMSwtMC45ODUzMTEgMCwtMC4yMDQyMDUgLTAuMDYyNDQsLTAuMzk0MDAxIC0wLjE2OTM1LC0wLjU1MTUyNyBMIDUuODE4NzUyLDQuNDg1NTA0IGMgMC4xNjQwNTQsMC4xMjE2ODYgMC4zNjYyODksMC4xOTQ3MjIgMC41ODU3NjcsMC4xOTQ3MjIgMC41NDMyNzYsMCAwLjk4NTMxMSwtMC40NDIwMzUgMC45ODUzMTEsLTAuOTg1MzEgMCwtMC41NDMyNzYgLTAuNDQyMDM1LC0wLjk4NTMxMSAtMC45ODUzMTEsLTAuOTg1MzExIC0wLjIyNzM2LDAgLTAuNDM2MjQ2LDAuMDc4MDkgLTAuNjAzMjU2LDAuMjA3OTAxIEwgNC40NzIzMjUsMS41ODg1NjggQyA0LjYwMjE0LDEuNDIxNTU4IDQuNjgwMjI1LDEuMjEyNjcyIDQuNjgwMjI1LDAuOTg1MzExIDQuNjgwMjI1LDAuNDQyMDM2IDQuMjM4MTksMCAzLjY5NDkxNSwwIDMuMTUxNjM5LDAgMi43MDk2MDQsMC40NDIwMzYgMi43MDk2MDQsMC45ODUzMTEgYyAwLDAuMDc0ODggMC4wMDkxLDAuMTQ3Njc0IDAuMDI1MTIsMC4yMTc4NzcgTCAxLjg2MTI0NiwxLjUyMTQ0MyBDIDEuNjk3NTY4LDEuMjAzNTU3IDEuMzY2NzUsMC45ODUzMSAwLjk4NTMxMSwwLjk4NTMxIDAuNDQyMDM2LDAuOTg1MzEgMCwxLjQyNzM0NSAwLDEuOTcwNjIxIGMgMCwwLjU0MzI3NiAwLjQ0MjAzNiwwLjk4NTMxMSAwLjk4NTMxMSwwLjk4NTMxMSAwLjE0MDE2MSwwIDAuMjczMzAxLC0wLjAyOTgxIDAuMzk0MTI1LC0wLjA4Mjg5IGwgMC40NTMzNjYsMC43NjMgeiBtIC0wLjQyNjY0LDEuNjI1NzYzIGMgLTAuNDA3NTQ5LDAgLTAuNzM4OTgzLC0wLjMzMTQzNCAtMC43Mzg5ODMsLTAuNzM4OTgzIDAsLTAuNDA3NTQ5IDAuMzMxNDM0LC0wLjczODk4MyAwLjczODk4MywtMC43Mzg5ODMgMC40MDc1NDksMCAwLjczODk4MywwLjMzMTQzNCAwLjczODk4MywwLjczODk4MyAwLDAuNDA3NTQ5IC0wLjMzMTQzNCwwLjczODk4MyAtMC43Mzg5ODMsMC43Mzg5ODMgeiBNIDEuOTEzODQzLDUuNDk5Mzg4IEMgMS45NDk5MzMsNS4zOTcwMzkgMS45NzA2MjMsNS4yODc0MjMgMS45NzA2MjMsNS4xNzI4ODEgMS45NzA2MjMsNC44NzA3NiAxLjgzMzY2NSw0LjYwMDI5MiAxLjYxODk5LDQuNDE5NDg4IEwgMS45NzMyMDksMy44NzIzOTQgMy4wNDExNjMsNS42Njk0NzcgQyAyLjk1MTI1Myw1Ljc0OTUzNyAyLjg3Niw1Ljg0NTM1NSAyLjgyMDIwNyw1Ljk1MzEyNCB6IE0gMy42OTQ5MTYsMS45NzA2MjEgYyAwLjIyNzM2LDAgMC40MzYyNDYsLTAuMDc4MDkgMC42MDMyNTYsLTAuMjA3OTAxIEwgNS42MjcyMzMsMy4wOTE3ODEgQyA1LjU0NzU0MywzLjE5NDI1NCA1LjQ4NzkzNSwzLjMxMjYxNCA1LjQ1MzU3MiwzLjQ0MTQ0NCBMIDQuNjc5ODU3LDMuMzM1MDMgYyAtMS4yM2UtNCwtMC4wMDMyIDMuNjllLTQsLTAuMDA2NCAzLjY5ZS00LC0wLjAwOTYgMCwtMC41NDMyNzUgLTAuNDQyMDM1LC0wLjk4NTMxMSAtMC45ODUzMSwtMC45ODUzMTEgLTAuMzQwOTE4LDAgLTAuNjQxOTMsMC4xNzQxNTQgLTAuODE4NzkzLDAuNDM4MDk0IEwgMi43MjkxODgsMi43MDQ4MDMgMy4yNjgzOTksMS44NzIwOTIgYyAwLjEyOTE5OSwwLjA2MjQ0IDAuMjczNTQ3LDAuMDk4NTMgMC40MjY1MTcsMC4wOTg1MyB6IE0gMy44MTgwOCw1LjQyNzcwNyBWIDQuMzAyMTEyIEMgNC4yMTgzNjIsNC4yNTE4NjIgNC41NDQwMDcsMy45NjA5NDkgNC42NDU5ODcsMy41Nzg4OTQgbCAwLjc3MzcxNSwwLjEwNjQxNCBjIDAsMC4wMDMyIC00LjkyZS00LDAuMDA2NCAtNC45MmUtNCwwLjAwOTYgMCwwLjIzNTI0MyAwLjA4MzAxLDAuNDUxMTQ5IDAuMjIxMDc5LDAuNjIwNzQ2IEwgNC4zNDcwNjgsNS42Njc4NjkgQyA0LjIwMjEwNCw1LjUzOTQwOSA0LjAxOTY5OSw1LjQ1MzA3MiAzLjgxODA4LDUuNDI3NyB6IE0gMy42OTQ5MTYsMi41ODY0NCBjIDAuNDA3NTQ5LDAgMC43Mzg5ODMsMC4zMzE0MzQgMC43Mzg5ODMsMC43Mzg5ODMgMCwwLjQwNzU0OSAtMC4zMzE0MzQsMC43Mzg5ODMgLTAuNzM4OTgzLDAuNzM4OTgzIC0wLjQwNzU0OSwwIC0wLjczODk4MywtMC4zMzE0MzQgLTAuNzM4OTgzLC0wLjczODk4MyAwLC0wLjQwNzU0OSAwLjMzMTQzNCwtMC43Mzg5ODMgMC43Mzg5ODMsLTAuNzM4OTgzIHogTSAyLjc2NjM4NCwyLjk5ODkxNiBjIC0wLjAzNjA5LDAuMTAyMzQ5IC0wLjA1Njc4LDAuMjExOTY1IC0wLjA1Njc4LDAuMzI2NTA3IDAsMC41MDE1MjMgMC4zNzY4ODEsMC45MTU4NDcgMC44NjIxNDcsMC45NzY4MTMgViA1LjQyNzgzIEMgMy40NTQ5OTIsNS40NDI0OSAzLjM0NDc2LDUuNDc3NDcgMy4yNDQzODEsNS41MjkzMTcgTCAyLjEyMjYwNSwzLjY0MTU4NSAyLjU5NDQ0NiwyLjkxMjk0OCB6IG0gMC45Mjg1MzIsNC4xNDQ1ODYgYyAtMC40MDc1NDksMCAtMC43Mzg5ODMsLTAuMzMxNDM0IC0wLjczODk4MywtMC43Mzg5ODMgMCwtMC40MDc1NDkgMC4zMzE0MzQsLTAuNzM4OTgzIDAuNzM4OTgzLC0wLjczODk4MyAwLjQwNzU0OSwwIDAuNzM4OTgzLDAuMzMxNDM0IDAuNzM4OTgzLDAuNzM4OTgzIDAsMC40MDc1NDkgLTAuMzMxNDM0LDAuNzM4OTgzIC0wLjczODk4MywwLjczODk4MyB6IE0gNi40MDQ1MiwyLjk1NTkzMiBjIDAuNDA3NTQ5LDAgMC43Mzg5ODMsMC4zMzE0MzQgMC43Mzg5ODMsMC43Mzg5ODMgMCwwLjQwNzU0OSAtMC4zMzE0MzQsMC43Mzg5ODMgLTAuNzM4OTgzLDAuNzM4OTgzIC0wLjQwNzU0OSwwIC0wLjczODk4MywtMC4zMzE0MzQgLTAuNzM4OTgzLC0wLjczODk4MyAwLC0wLjQwNzU0OSAwLjMzMTQzNCwtMC43Mzg5ODMgMC43Mzg5ODMsLTAuNzM4OTgzIHogTSAzLjY5NDkxNiwwLjI0NjMyNyBjIDAuNDA3NTQ5LDAgMC43Mzg5ODMsMC4zMzE0MzQgMC43Mzg5ODMsMC43Mzg5ODMgMCwwLjQwNzU0OSAtMC4zMzE0MzQsMC43Mzg5ODMgLTAuNzM4OTgzLDAuNzM4OTgzIC0wLjQwNzU0OSwwIC0wLjczODk4MywtMC4zMzE0MzQgLTAuNzM4OTgzLC0wLjczODk4MyAwLC0wLjQwNzU0OSAwLjMzMTQzNCwtMC43Mzg5ODMgMC43Mzg5ODMsLTAuNzM4OTgzIHogTSAyLjgxOTA5OCwxLjQzNDQ4OSBjIDAuMDYwMjMsMC4xMTY4ODIgMC4xNDI2MjMsMC4yMjAyMTcgMC4yNDIyNjMsMC4zMDQyMTQgTCAyLjUwNzYxNiwyLjU5Mzk1MyAxLjkxMzk2NywyLjI5NzEyOCBjIDAuMDM1OTYsLTAuMTAyMzQ5IDAuMDU2NjUsLTAuMjExOTY1IDAuMDU2NjUsLTAuMzI2NTA3IDAsLTAuMDc0ODggLTAuMDA5MSwtMC4xNDc2NzMgLTAuMDI1MTIsLTAuMjE3ODc3IHogbSAtMi41NzI3NywwLjUzNjEzMiBjIDAsLTAuNDA3NTQ5IDAuMzMxNDM0LC0wLjczODk4MyAwLjczODk4MywtMC43Mzg5ODMgMC40MDc1NDksMCAwLjczODk4MywwLjMzMTQzNCAwLjczODk4MywwLjczODk4MyAwLDAuNDA3NTQ5IC0wLjMzMTQzNCwwLjczODk4MyAtMC43Mzg5ODMsMC43Mzg5ODMgLTAuNDA3NTQ5LDAgLTAuNzM4OTgzLC0wLjMzMTQzNCAtMC43Mzg5ODMsLTAuNzM4OTgzIHogTSAxLjU5MDY2MiwyLjc0NjQzIEMgMS42NzMxODIsMi42ODE4OSAxLjc0NTYwMiwyLjYwNTAzOCAxLjgwNDEwNCwyLjUxNzgzOCBMIDIuMzcyNzUyLDIuODAyMSAxLjk4MjE5OSwzLjQwNTIzMyB6IgogICAgIGlkPSJwYXRoMTUiCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIKICAgICBzdHlsZT0iZmlsbDojZmZmZmZmIiAvPgo8L3N2Zz4K';


/**
 * Sensor attribute video sensor block should report.
 * @readonly
 * @enum {string}
 */
const SensingAttribute = {
    /** The amount of motion. */
    MOTION: 'motion',

    /** The direction of the motion. */
    DIRECTION: 'direction'
};

/**
 * Subject video sensor block should report for.
 * @readonly
 * @enum {string}
 */
const SensingSubject = {
    /** The sensor traits of the whole stage. */
    STAGE: 'Stage',

    /** The senosr traits of the area overlapped by this sprite. */
    SPRITE: 'this sprite'
};

/**
 * States the video sensing activity can be set to.
 * @readonly
 * @enum {string}
 */
const VideoState = {
    /** Video turned off. */
    OFF: 'off',

    /** Video turned on with default y axis mirroring. */
    ON: 'on',

    /** Video turned on without default y axis mirroring. */
    ON_FLIPPED: 'on-flipped'
};

const ModelType = {
    POSE: 'pose',
    IMAGE: 'image',
    AUDIO: 'audio',
}

const EXTENSION_ID = 'teachableMachine';

/**
 * Class for the motion-related blocks in Scratch 3.0
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */
class Scratch3VideoSensingBlocks {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
        this.runtime.registerPeripheralExtension(EXTENSION_ID, this);
        this.runtime.connectPeripheral(EXTENSION_ID, 0);
        this.runtime.emit(this.runtime.constructor.PERIPHERAL_CONNECTED);

        /**
         * The motion detection algoritm used to power the motion amount and
         * direction values.
         * @type {VideoMotion}
         */
        this.detect = new VideoMotion();

        /**
         * The last millisecond epoch timestamp that the video stream was
         * analyzed.
         * @type {number}
         */
        this._lastUpdate = null;

        /**
         * A flag to determine if this extension has been installed in a project.
         * It is set to false the first time getInfo is run.
         * @type {boolean}
         */
        this.firstInstall = true;
        
        // What is the confidence of the latest prediction
        this.maxConfidence = '';
        this.modelConfidences = {};

        if (this.runtime.ioDevices) {
            // Configure the video device with values from globally stored locations.
            this.runtime.on(Runtime.PROJECT_LOADED, this.updateVideoDisplay.bind(this));
            // Kick off looping the analysis logic.
            this._loop();
        }
    }

    /**
     * After analyzing a frame the amount of milliseconds until another frame
     * is analyzed.
     * @type {number}
     */
    static get INTERVAL () {
        return 33;
    }

    /**
     * Dimensions the video stream is analyzed at after its rendered to the
     * sample canvas.
     * @type {Array.<number>}
     */
    static get DIMENSIONS () {
        return [480, 360];
    }

    /**
     * The key to load & store a target's motion-related state.
     * @type {string}
     */
    static get STATE_KEY () {
        return 'Scratch.videoSensing';
    }

    /**
     * The default motion-related state, to be used when a target has no existing motion state.
     * @type {MotionState}
     */
    static get DEFAULT_MOTION_STATE () {
        return {
            motionFrameNumber: 0,
            motionAmount: 0,
            motionDirection: 0
        };
    }

    /**
     * The transparency setting of the video preview stored in a value
     * accessible by any object connected to the virtual machine.
     * @type {number}
     */
    get globalVideoTransparency () {
        const stage = this.runtime.getTargetForStage();
        if (stage) {
            return stage.videoTransparency;
        }
        return 50;
    }

    set globalVideoTransparency (transparency) {
        const stage = this.runtime.getTargetForStage();
        if (stage) {
            stage.videoTransparency = transparency;
        }
        return transparency;
    }

    /**
     * The video state of the video preview stored in a value accessible by any
     * object connected to the virtual machine.
     * @type {number}
     */
    get globalVideoState () {
        const stage = this.runtime.getTargetForStage();
        if (stage) {
            return stage.videoState;
        }
        // Though the default value for the stage is normally 'on', we need to default
        // to 'off' here to prevent the video device from briefly activating
        // while waiting for stage targets to be installed that say it should be off
        return VideoState.OFF;
    }

    set globalVideoState (state) {
        const stage = this.runtime.getTargetForStage();
        if (stage) {
            stage.videoState = state;
        }
        return state;
    }

    /**
     * Get the latest values for video transparency and state,
     * and set the video device to use them.
     */
    updateVideoDisplay () {
        this.setVideoTransparency({
            TRANSPARENCY: this.globalVideoTransparency
        });
        this.videoToggle({
            VIDEO_STATE: this.globalVideoState
        });
    }

    /**
     * Occasionally step a loop to sample the video, stamp it to the preview
     * skin, and add a TypedArray copy of the canvas's pixel data.
     * @private
     */
    _loop () {
        setTimeout(this._loop.bind(this), Math.max(this.runtime.currentStepTime, Scratch3VideoSensingBlocks.INTERVAL));

        // Add frame to detector
        const time = Date.now();
        if (this._lastUpdate === null) {
            this._lastUpdate = time;
        }
        if (!this._isPredicting) {
            this._isPredicting = 0;
        }
        const offset = time - this._lastUpdate;

        // TOOD: Self-throttle interval if slow to run predictions
        if (offset > Scratch3VideoSensingBlocks.INTERVAL && this._isPredicting === 0) {
            const frame = this.runtime.ioDevices.video.getFrame({
                format: Video.FORMAT_IMAGE_DATA,
                dimensions: Scratch3VideoSensingBlocks.DIMENSIONS
            });

            if (frame) {
                this._lastUpdate = time;
                this._isPredicting = 0;
                this.predictAllBlocks(frame);
            }
        }
    }

    scan() {
    }

    reset () {
    }

    isConnected() {
        return this.predictionState &&
            this.teachableImageModel &&
            this.predictionState.hasOwnProperty(this.teachableImageModel);
    }

    connect() {
    }


    async predictAllBlocks(frame) {
        for (let modelUrl in this.predictionState) {
            if (!this.predictionState[modelUrl].model) {
                continue;
            }
            if (this.teachableImageModel !== modelUrl) {
                continue;
            }
            ++this._isPredicting;
            const prediction = await this.predictModel(modelUrl, frame);
            this.predictionState[modelUrl].topClass = prediction;
            this.runtime.emit(this.runtime.constructor.PERIPHERAL_CONNECTED);
            --this._isPredicting;
        }
    }

    /**
     * Create data for a menu in scratch-blocks format, consisting of an array
     * of objects with text and value properties. The text is a translated
     * string, and the value is one-indexed.
     * @param {object[]} info - An array of info objects each having a name
     *   property.
     * @return {array} - An array of objects with text and value properties.
     * @private
     */
    _buildMenu (info) {
        return info.map((entry, index) => {
            const obj = {};
            obj.text = entry.name;
            obj.value = entry.value || String(index + 1);
            return obj;
        });
    }

    /**
     * @param {Target} target - collect motion state for this target.
     * @returns {MotionState} the mutable motion state associated with that
     *   target. This will be created if necessary.
     * @private
     */
    _getMotionState (target) {
        let motionState = target.getCustomState(Scratch3VideoSensingBlocks.STATE_KEY);
        if (!motionState) {
            motionState = Clone.simple(Scratch3VideoSensingBlocks.DEFAULT_MOTION_STATE);
            target.setCustomState(Scratch3VideoSensingBlocks.STATE_KEY, motionState);
        }
        return motionState;
    }

    static get SensingAttribute () {
        return SensingAttribute;
    }

    /**
     * An array of choices of whether a reporter should return the frame's
     * motion amount or direction.
     * @type {object[]}
     * @param {string} name - the translatable name to display in sensor
     *   attribute menu
     * @param {string} value - the serializable value of the attribute
     */
    get ATTRIBUTE_INFO () {
        return [
            {
                name: formatMessage({
                    id: 'videoSensing.motion',
                    default: 'motion',
                    description: 'Attribute for the "video [ATTRIBUTE] on [SUBJECT]" block'
                }),
                value: SensingAttribute.MOTION
            },
            {
                name: formatMessage({
                    id: 'videoSensing.direction',
                    default: 'direction',
                    description: 'Attribute for the "video [ATTRIBUTE] on [SUBJECT]" block'
                }),
                value: SensingAttribute.DIRECTION
            }
        ];
    }

    static get SensingSubject () {
        return SensingSubject;
    }

    /**
     * An array of info about the subject choices.
     * @type {object[]}
     * @param {string} name - the translatable name to display in the subject menu
     * @param {string} value - the serializable value of the subject
     */
    get SUBJECT_INFO () {
        return [
            {
                name: formatMessage({
                    id: 'videoSensing.sprite',
                    default: 'sprite',
                    description: 'Subject for the "video [ATTRIBUTE] on [SUBJECT]" block'
                }),
                value: SensingSubject.SPRITE
            },
            {
                name: formatMessage({
                    id: 'videoSensing.stage',
                    default: 'stage',
                    description: 'Subject for the "video [ATTRIBUTE] on [SUBJECT]" block'
                }),
                value: SensingSubject.STAGE
            }
        ];
    }

    /**
     * States the video sensing activity can be set to.
     * @readonly
     * @enum {string}
     */
    static get VideoState () {
        return VideoState;
    }

    /**
     * An array of info on video state options for the "turn video [STATE]" block.
     * @type {object[]}
     * @param {string} name - the translatable name to display in the video state menu
     * @param {string} value - the serializable value stored in the block
     */
    get VIDEO_STATE_INFO () {
        return [
            {
                name: formatMessage({
                    id: 'videoSensing.off',
                    default: 'off',
                    description: 'Option for the "turn video [STATE]" block'
                }),
                value: VideoState.OFF
            },
            {
                name: formatMessage({
                    id: 'videoSensing.on',
                    default: 'on',
                    description: 'Option for the "turn video [STATE]" block'
                }),
                value: VideoState.ON
            },
            {
                name: formatMessage({
                    id: 'videoSensing.onFlipped',
                    default: 'on flipped',
                    description: 'Option for the "turn video [STATE]" block that causes the video to be flipped' +
                        ' horizontally (reversed as in a mirror)'
                }),
                value: VideoState.ON_FLIPPED
            }
        ];
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        // Set the video display properties to defaults the first time
        // getInfo is run. This turns on the video device when it is
        // first added to a project, and is overwritten by a PROJECT_LOADED
        // event listener that later calls updateVideoDisplay
        if (this.firstInstall) {
            this.globalVideoState = VideoState.ON;
            this.globalVideoTransparency = 50;
            this.updateVideoDisplay();
            this.updateToStageModel();
            this.firstInstall = false;
            this.predictionState = {};
        }

        // Return extension definition
        const blocks = [
            {
                opcode: 'useModelBlock',
                text: `use model [MODEL_URL]`,
                arguments: {
                    MODEL_URL: {
                        type: ArgumentType.STRING,
                        defaultValue: this.teachableImageModel || 'https://teachablemachine.withgoogle.com/models/fZsf3AXlg/'
                    }
                }
            },
            {
                // @todo (copied from motion) this hat needs to be set itself to restart existing
                // threads like Scratch 2's behaviour.
                opcode: 'whenModelMatches',
                text: 'when model detects [CLASS_NAME]',
                blockType: BlockType.HAT,
                arguments: {
                    CLASS_NAME: {
                        type: ArgumentType.STRING,
                        defaultValue: this.getCurrentClasses()[0],
                        menu: 'CLASS_NAME'
                    }
                },
            },
            {
                opcode: 'modelPrediction',
                text: formatMessage({
                    id: 'teachableMachine.modelPrediction',
                    default: 'model prediction',
                    description: 'Value of latest model prediction'
                }),
                blockType: BlockType.REPORTER,
                isTerminal: true
            },
            {
                // @todo (copied from motion) this hat needs to be set itself to restart existing
                // threads like Scratch 2's behaviour.
                opcode: 'modelMatches',
                text: formatMessage({
                    id: 'teachableMachine.modelMatches',
                    default: 'prediction is [CLASS_NAME]',
                    description: 'Boolean that is true when the model matches [CLASS_NAME]'
                }),
                blockType: BlockType.BOOLEAN,
                arguments: {
                    CLASS_NAME: {
                        type: ArgumentType.STRING,
                        defaultValue: this.getCurrentClasses()[0],
                        menu: 'CLASS_NAME'
                    }
                },
            },
            /*{
                opcode: 'modelCon',
                text: formatMessage({
                    id: 'teachableMachine.modelConfidence',
                    default: 'prediction confidence',
                    description: 'Confidence value of latest model prediction'
                }),
                blockType: BlockType.REPORTER,
                isTerminal: true
            },*/
            {
                opcode: 'classConfidence',
                text: formatMessage({
                    id: 'teachableMachine.classConfidence',
                    default: 'confidence for [CLASS_NAME]',
                    description: 'Reporter that returns the model confience level for [CLASS_NAME]'
                }),
                blockType: BlockType.REPORTER,
                isTerminal: true,
                arguments: {
                    CLASS_NAME: {
                        type: ArgumentType.STRING,
                        defaultValue: this.getCurrentClasses()[0],
                        menu: 'CLASS_NAME'
                    }
                },
            },
            '---',
            {
                opcode: 'videoToggle',
                text: formatMessage({
                    id: 'videoSensing.videoToggle',
                    default: 'turn video [VIDEO_STATE]',
                    description: 'Controls display of the video preview layer'
                }),
                arguments: {
                    VIDEO_STATE: {
                        type: ArgumentType.NUMBER,
                        menu: 'VIDEO_STATE',
                        defaultValue: VideoState.ON
                    }
                }
            },
            {
                opcode: 'setVideoTransparency',
                text: formatMessage({
                    id: 'videoSensing.setVideoTransparency',
                    default: 'set video transparency to [TRANSPARENCY]',
                    description: 'Controls transparency of the video preview layer'
                }),
                arguments: {
                    TRANSPARENCY: {
                        type: ArgumentType.NUMBER,
                        defaultValue: 50
                    }
                }
            }
        ];

        return {
            id: EXTENSION_ID,
            name: formatMessage({
                id: 'videoSensing.categoryName',
                default: 'Teachable Machine',
                description: 'Label for the Teachable Machine extension category'
            }),
            showStatusButton: true,
            blockIconURI: blockIconURI,
            menuIconURI: menuIconURI,
            blocks: blocks,
            menus: {
                CLASS_NAME: 'getCurrentClasses',
                ATTRIBUTE: {
                    acceptReporters: true,
                    items: this._buildMenu(this.ATTRIBUTE_INFO)
                },
                SUBJECT: {
                    acceptReporters: true,
                    items: this._buildMenu(this.SUBJECT_INFO)
                },
                VIDEO_STATE: {
                    acceptReporters: true,
                    items: this._buildMenu(this.VIDEO_STATE_INFO)
                }
            }
        };
    }

    updateToStageModel() {
        const stage = this.runtime.getTargetForStage();
        if (stage) {
            this.teachableImageModel = stage.teachableImageModel;
            if (this.teachableImageModel) {
                this.useModel(this.teachableImageModel);
            }
        }
    }

    updateStageModel(modelUrl) {
        const stage = this.runtime.getTargetForStage();
        this.teachableImageModel = modelUrl;
        if (stage) {
            stage.teachableImageModel = modelUrl;
        }
    }

    useModelBlock(args, util) {
        const modelArg = args.MODEL_URL;
        this.useModel(modelArg);
    }

    useModel(modelArg) {
        try {
            const modelUrl = this.modelArgumentToURL(modelArg);
            this.getPredictionStateOrStartPredicting(modelUrl);
            this.updateStageModel(modelUrl);
        } catch (e) {
            this.teachableImageModel = null;
        }
    }

    modelArgumentToURL(modelArg) {
        return modelArg.startsWith('https://teachablemachine.withgoogle.com/models/') ?
            modelArg :
            `https://teachablemachine.withgoogle.com/models/${modelArg}/`;
    }

    /**
     * A scratch hat block edge handle that downloads a teachable machine model and determines whether the
     * current video frame matches the model class.
     * @param {object} args - the block arguments
     * @param {BlockUtility} util - the block utility
     * @returns {boolean} true if the model matches
     *   reference
     */
    whenModelMatches(args, util) {
        const modelUrl = this.teachableImageModel;
        const className = args.CLASS_NAME;

        const predictionState = this.getPredictionStateOrStartPredicting(modelUrl);
        if (!predictionState) {
            return false;
        }

        const currentMaxClass = predictionState.topClass;
        return (currentMaxClass === String(className));
    }

    modelMatches(args, util) {
        const modelUrl = this.teachableImageModel;
        const className = args.CLASS_NAME;

        const predictionState = this.getPredictionStateOrStartPredicting(modelUrl);
        if (!predictionState) {
            return false;
        }

        const currentMaxClass = predictionState.topClass;
        return (currentMaxClass === String(className));
    }
    
    classConfidence(args, util) {
        const className = args.CLASS_NAME;
        
        return this.modelConfidences[className];
    }
    
    
    modelCon(args, util) {
        return this.maxConfidence;
    }

    /**
     * A scratch reporter that returns the top class seen in the current video frame
     * @param {object} args - the block arguments
     * @param {BlockUtility} util - the block utility
     * @returns {string} class name if video frame matched, empty string if model not loaded yet
     */
    modelPrediction(args, util) {
        const modelUrl = this.teachableImageModel;
        const predictionState = this.getPredictionStateOrStartPredicting(modelUrl);
        if (!predictionState) {
            return '';
        }
        return predictionState.topClass;
    }
    

    getPredictionStateOrStartPredicting(modelUrl) {
        const hasPredictionState = this.predictionState.hasOwnProperty(modelUrl);
        if (!hasPredictionState) {
            this.startPredicting(modelUrl);
            return null;
        }
        return this.predictionState[modelUrl];
    }

    getCurrentClasses() {
        if (
            !this.teachableImageModel ||
            !this.predictionState ||
            !this.predictionState[this.teachableImageModel] ||
            !this.predictionState[this.teachableImageModel].hasOwnProperty('model')
        ) {
            return ["Class 1"];
        }

        if (this.predictionState[this.teachableImageModel].modelType === ModelType.AUDIO) {
            return this.predictionState[this.teachableImageModel].model.wordLabels();
        }

        return this.predictionState[this.teachableImageModel].model.getClassLabels();
    }

    async startPredicting(modelDataUrl) {
        if (!this.predictionState[modelDataUrl]) {
            try {
                this.predictionState[modelDataUrl] = {};
                // https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image
                const {model, type} = await this.initModel(modelDataUrl);
                this.predictionState[modelDataUrl].modelType = type;
                this.predictionState[modelDataUrl].model = model;
                this.runtime.requestToolboxExtensionsUpdate();
            } catch (e) {
                this.predictionState[modelDataUrl] = {};
                console.log("Model initialization failure!", e);
            }
        }
    }

    async initModel(modelUrl) {
        const modelURL = modelUrl + "model.json";
        const metadataURL = modelUrl + "metadata.json";
        const customMobileNet = await tmImage.load(modelURL, metadataURL);
        if (customMobileNet._metadata.hasOwnProperty('tfjsSpeechCommandsVersion')) {
            // customMobileNet.dispose(); // too early to dispose
            //console.log("We got a speech net yay")
            const recognizer = tmAudioSpeechCommands.create("BROWSER_FFT", undefined, modelURL, metadataURL);
            await recognizer.ensureModelLoaded();
            await recognizer.listen(result => {
                this.latestAudioResults = result;
                //console.log(result);
            }, {
                includeSpectrogram: true, // in case listen should return result.spectrogram
                probabilityThreshold: 0.75,
                invokeCallbackOnNoiseAndUnknown: true,
                overlapFactor: 0.50 // probably want between 0.5 and 0.75. More info in README
            });
            return {model: recognizer, type: ModelType.AUDIO};
        } else if (customMobileNet._metadata.packageName === "@teachablemachine/pose") {
            const customPoseNet = await tmPose.load(modelURL, metadataURL);
            return {model: customPoseNet, type: ModelType.POSE};
        } else {
           return {model: customMobileNet, type: ModelType.IMAGE};
        }
    }

    async predictModel(modelUrl, frame) {
        const predictions = await this.getPredictionFromModel(modelUrl, frame);
        if (!predictions) {
            return;
        }
        let maxProbability = 0;
        let maxClassName = "";
        for (let i = 0; i < predictions.length; i++) {
            const probability = predictions[i].probability.toFixed(2);
            const className = predictions[i].className;
            this.modelConfidences[className] = probability; // update for reporter block
            if (probability > maxProbability) {
                maxClassName = className;
                maxProbability = probability;
            }
        }
        this.maxConfidence = maxProbability; // update for reporter block
        return maxClassName;
    }

    async getPredictionFromModel(modelUrl, frame) {
        const {model, modelType} = this.predictionState[modelUrl];
        switch (modelType) {
            case ModelType.IMAGE:
                const imageBitmap = await createImageBitmap(frame);
                return await model.predict(imageBitmap);
            case ModelType.POSE:
                const {pose, posenetOutput} = await model.estimatePose(frame);
                return await model.predict(posenetOutput);
            case ModelType.AUDIO:
                if (this.latestAudioResults) {
                    return model.wordLabels().map((label, i) => {
                        return {className: label, probability: this.latestAudioResults.scores[i]}
                    });
                } else {
                    return null;
                }
        }
    }

    /**
     * A scratch command block handle that configures the video state from
     * passed arguments.
     * @param {object} args - the block arguments
     * @param {VideoState} args.VIDEO_STATE - the video state to set the device to
     */
    videoToggle (args) {
        const state = args.VIDEO_STATE;
        this.globalVideoState = state;
        if (state === VideoState.OFF) {
            this.runtime.ioDevices.video.disableVideo();
        } else {
            this.runtime.ioDevices.video.enableVideo();
            // Mirror if state is ON. Do not mirror if state is ON_FLIPPED.
            this.runtime.ioDevices.video.mirror = state === VideoState.ON;
        }
    }

    /**
     * A scratch command block handle that configures the video preview's
     * transparency from passed arguments.
     * @param {object} args - the block arguments
     * @param {number} args.TRANSPARENCY - the transparency to set the video
     *   preview to
     */
    setVideoTransparency (args) {
        const transparency = Cast.toNumber(args.TRANSPARENCY);
        this.globalVideoTransparency = transparency;
        this.runtime.ioDevices.video.setPreviewGhost(transparency);
    }
}

module.exports = Scratch3VideoSensingBlocks;
