/*
 * Resources:
 *  - Text to speech extension written by Scratch Team 2019
 *  - Speech to text extension written by Sayamindu Dasgupta <sayamindu@media.mit.edu>, April 2014
 *  - Knn Classifier model written by Katya3141 https://katya3141.github.io/scratch-gui/teachable-classifier/ August 2019
 */

require("regenerator-runtime/runtime");
const Runtime = require('../../engine/runtime');
const nets = require('nets');
const MathUtil = require('../../util/math-util');

const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Clone = require('../../util/clone');
const Cast = require('../../util/cast');
const formatMessage = require('format-message');
const Video = require('../../io/video');
const Timer = require('../../util/timer');
const tf = require('@tensorflow/tfjs');
const knnClassifier = require('@tensorflow-models/knn-classifier');
const use = require('@tensorflow-models/universal-sentence-encoder');


/**
 * Icon svg to be displayed in the blocks category menu, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const menuIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgaWQ9IkxheWVyXzFfMV8iCiAgIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDY0IDY0IgogICBoZWlnaHQ9IjcyLjc4MDIwNSIKICAgdmlld0JveD0iMCAwIDkuMTk5MTIzNCA5LjA5NzUyNTYiCiAgIHdpZHRoPSI3My41OTI5ODciCiAgIHZlcnNpb249IjEuMSIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMC40OC40IHI5OTM5IgogICBzb2RpcG9kaTpkb2NuYW1lPSJ0ZXh0LWNsYXNzaWZpY2F0aW9uLWJsb2Nrcy1tZW51LnN2ZyI+CiAgPG1ldGFkYXRhCiAgICAgaWQ9Im1ldGFkYXRhMjEiPgogICAgPHJkZjpSREY+CiAgICAgIDxjYzpXb3JrCiAgICAgICAgIHJkZjphYm91dD0iIj4KICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD4KICAgICAgICA8ZGM6dHlwZQogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiIC8+CiAgICAgICAgPGRjOnRpdGxlPjwvZGM6dGl0bGU+CiAgICAgIDwvY2M6V29yaz4KICAgIDwvcmRmOlJERj4KICA8L21ldGFkYXRhPgogIDxkZWZzCiAgICAgaWQ9ImRlZnMxOSIgLz4KICA8c29kaXBvZGk6bmFtZWR2aWV3CiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIgogICAgIGJvcmRlcmNvbG9yPSIjNjY2NjY2IgogICAgIGJvcmRlcm9wYWNpdHk9IjEiCiAgICAgb2JqZWN0dG9sZXJhbmNlPSIxMCIKICAgICBncmlkdG9sZXJhbmNlPSIxMCIKICAgICBndWlkZXRvbGVyYW5jZT0iMTAiCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAiCiAgICAgaW5rc2NhcGU6cGFnZXNoYWRvdz0iMiIKICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjEwMDciCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iNzgzIgogICAgIGlkPSJuYW1lZHZpZXcxNyIKICAgICBzaG93Z3JpZD0iZmFsc2UiCiAgICAgZml0LW1hcmdpbi10b3A9IjAiCiAgICAgZml0LW1hcmdpbi1sZWZ0PSIwIgogICAgIGZpdC1tYXJnaW4tcmlnaHQ9IjAiCiAgICAgZml0LW1hcmdpbi1ib3R0b209IjAiCiAgICAgaW5rc2NhcGU6em9vbT0iMTAuNDI5ODI1IgogICAgIGlua3NjYXBlOmN4PSI0NC45MTIxMTIiCiAgICAgaW5rc2NhcGU6Y3k9IjMzLjEwODQ3MSIKICAgICBpbmtzY2FwZTp3aW5kb3cteD0iNjI3IgogICAgIGlua3NjYXBlOndpbmRvdy15PSIxNzgiCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMCIKICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJMYXllcl8xXzFfIiAvPgogIDxwYXRoCiAgICAgc29kaXBvZGk6dHlwZT0iYXJjIgogICAgIHN0eWxlPSJmaWxsOiNhYWZmY2M7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOiMwMGFhNDQiCiAgICAgaWQ9InBhdGgyOTkzIgogICAgIHNvZGlwb2RpOmN4PSItNC4zNjI0ODkyIgogICAgIHNvZGlwb2RpOmN5PSIyOC41ODEyMjMiCiAgICAgc29kaXBvZGk6cng9IjMyLjkzNDM5OSIKICAgICBzb2RpcG9kaTpyeT0iMzIuOTM0Mzk5IgogICAgIGQ9Im0gMjguNTcxOTA5LDI4LjU4MTIyMyBhIDMyLjkzNDM5OSwzMi45MzQzOTkgMCAxIDEgLTY1Ljg2ODc5NywwIDMyLjkzNDM5OSwzMi45MzQzOTkgMCAxIDEgNjUuODY4Nzk3LDAgeiIKICAgICB0cmFuc2Zvcm09Im1hdHJpeCgwLjEzNzU1Njk4LDAsMCwwLjEzNjEwMTM3LDUuMjAxMzczMywwLjY1OTI0MTAxKSIgLz4KICA8cGF0aAogICAgIGQ9Im0gMi45NzkxMjMzLDYuMTM3NDI4IGMgMCwwLjEzOTE3NSAtMC4wMzIwMiwwLjI2OTcyOSAtMC4wOTExNCwwLjM4NTUwMyAtMC4xNDA0MDcsMC4yODMyNzcgLTAuNDMzNTM3LDAuNDc2NjQ0IC0wLjc3MTAwNiwwLjQ3NjY0NCAtMC40NzY2NDQsMCAtMC44NjIxNDcsLTAuMzg1NTAzIC0wLjg2MjE0NywtMC44NjIxNDcgMCwtMC40NzY2NDQgMC4zODU1MDMsLTAuODYyMTQ3IDAuODYyMTQ3LC0wLjg2MjE0NyAwLjE3MzY2MSwwIDAuMzMzNzc0LDAuMDUwNSAwLjQ2ODAyMywwLjEzNzk0MyAwLjIzNzcwNiwwLjE1Mzk1NSAwLjM5NDEyNCwwLjQxOTk4OSAwLjM5NDEyNCwwLjcyNDIwNCB6IgogICAgIGlkPSJwYXRoMyIKICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIgogICAgIHN0eWxlPSJmaWxsOiMwMDAwODA7ZmlsbC1vcGFjaXR5OjEiIC8+CiAgPHBhdGgKICAgICBkPSJtIDcuNTAwMjMwNywzLjg1NzIzOTMgYyAwLjQ3NjY0NCwwIDAuODYyMTQ3LDAuMzg1NTAzIDAuODYyMTQ3LDAuODYyMTQ3IDAsMC40NzY2NDQgLTAuMzg1NTAzLDAuODYyMTQ3IC0wLjg2MjE0NywwLjg2MjE0NyAtMC4yMzE1NDgsMCAtMC40NDA5MjYsLTAuMDg5OTEgLTAuNTk0ODgxLC0wLjI0MDE3IC0wLjE2NTA0LC0wLjE1NTE4NiAtMC4yNjcyNjYsLTAuMzc2ODgxIC0wLjI2NzI2NiwtMC42MjE5NzcgMCwtMC4wMzk0MSAwLjAwMjUsLTAuMDc3NTkgMC4wMDg2LC0wLjExNTc3NCAwLjAyNDYzLC0wLjE5MjEzNiAwLjExMzMxMSwtMC4zNjMzMzQgMC4yNDM4NjQsLTAuNDkzODg3IDAuMTU2NDE4LC0wLjE1NjQxOCAwLjM3MDcyMywtMC4yNTI0ODYgMC42MDk2NjEsLTAuMjUyNDg2IHoiCiAgICAgaWQ9InBhdGg3IgogICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiCiAgICAgc3R5bGU9ImZpbGw6IzAwMDA4MCIgLz4KICA8cGF0aAogICAgIHN0eWxlPSJmaWxsOiMwMDAwODA7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmUiCiAgICAgZD0iTSAxLjY4NDIxODQsMy42NDE0NDEgQyAxLjI2Mjk5MDEsMy4zNjI3MjQzIDEuMjAwNjM5NiwyLjc0NjIxMjcgMS41NTU3MTA2LDIuMzcwNzc1NyAxLjkwMjI1OTEsMi4wMDQzNTAxIDIuNDk1MTc4NSwyLjA2MzM0NTYgMi43Nzk0OTE4LDIuNDkyNTQxOSAzLjI0NDkyNjgsMy4xOTUxNTc3IDIuMzgwMzU2Myw0LjEwMjA1ODMgMS42ODQyMTg0LDMuNjQxNDQxIHoiCiAgICAgaWQ9InBhdGgyOTg4IgogICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiIC8+CiAgPHBhdGgKICAgICBzdHlsZT0iZmlsbDojMDAwMDgwO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lIgogICAgIGQ9Ik0gNC4zMDQ5MDQ0LDIuNTc3NjY4MiBDIDQuMDEyNzcwNiwyLjMyODI3MTUgMy45MzQyNTU5LDIuMDAxMTIzMSA0LjA4MTAxMTIsMS42NDQ3Njk3IDQuMzA2NDE4NCwxLjA5NzQzMjkgNC45Nzg0MTEzLDAuOTI2NTkzODcgNS4zODg2NTEzLDEuMzEyMzMxNiA2LjE5NzgyNzQsMi4wNzMxNzg3IDUuMTQ4NzM2NSwzLjI5ODA1MjUgNC4zMDQ5MDQ0LDIuNTc3NjY4MiB6IgogICAgIGlkPSJwYXRoMjk5MCIKICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPgogIDxwYXRoCiAgICAgc3R5bGU9ImZpbGw6IzAwMDA4MDtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZSIKICAgICBkPSJNIDQuMzc4NDk3Miw0Ljk3NTcwMTEgQyAzLjgyNzgzNjUsNC42NDA5NTU0IDMuODkyODQ1NiwzLjg1MDQyNzMgNC40OTM4MTgyLDMuNTczMzY5NCA0Ljg2NjA4OCwzLjQwMTc0NjkgNS4yODkzODIyLDMuNTMwMjgyNCA1LjUxMDExNzUsMy44ODE5NzM4IDUuNzMwMTg2Miw0LjIzMjYwMzMgNS43MDg5NzY2LDQuNTI0NDQ5MiA1LjQ0MjU2MDksNC44MTE1NjA4IDUuMTQ1NjQ4OCw1LjEzMTUzNzcgNC43MzgyMzQzLDUuMTk0Mzg0NiA0LjM3ODQ5NzIsNC45NzU3MDExIHoiCiAgICAgaWQ9InBhdGgyOTkyIgogICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiIC8+CiAgPHBhdGgKICAgICBzdHlsZT0iZmlsbDojMDAwMDgwO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lIgogICAgIGQ9Ik0gNC4zMjQ2MjY4LDcuOTgyMDc1MSBDIDQuMDM2Njg0OCw3LjczNzk3NTQgMy45NTkyOTY1LDcuNDE3Nzc1MiA0LjEwMzk0NjIsNy4wNjg5OTA0IDQuMzI2MTE5LDYuNTMzMjc4MiA0Ljk4ODQ2OTUsNi4zNjYwNjc2IDUuMzkyODIzLDYuNzQzNjEyOCA2LjE5MDM4ODUsNy40ODgzMDA1IDUuMTU2MzUwNyw4LjY4NzE1OTcgNC4zMjQ2MjY4LDcuOTgyMDc1MSB6IgogICAgIGlkPSJwYXRoMjk5NCIKICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPgogIDxwYXRoCiAgICAgc3R5bGU9ImZpbGw6I2Y2ZGI0MDtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZSIKICAgICBkPSIiCiAgICAgaWQ9InBhdGgzMDAxIgogICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiIC8+CiAgPHBhdGgKICAgICBkPSJtIDIuNTQzNjE2Myw1LjI1MDY0OCBjIC0wLjEyOTMyMiwtMC4wNjI0NCAtMC4yNzM2NywtMC4wOTg1MyAtMC40MjY2NCwtMC4wOTg1MyAtMC41NDMyNzUsMCAtMC45ODUzMTEsMC40NDIwMzUgLTAuOTg1MzExLDAuOTg1MzExIDAsMC41NDMyNzYgMC40NDIwMzYsMC45ODUzMTEgMC45ODUzMTEsMC45ODUzMTEgMC4zNDA5MTgsMCAwLjY0MTgwNywtMC4xNzQxNTQgMC44MTg3OTMsLTAuNDM4MDk0IGwgMC45MzA3NSwwLjQ2NTkyOSBjIC0wLjAxNjAxLDAuMDcwMzMgLTAuMDI1MjUsMC4xNDMzNjIgLTAuMDI1MjUsMC4yMTg0OTIgMCwwLjU0MzI3NiAwLjQ0MjAzNSwwLjk4NTMxMSAwLjk4NTMxMSwwLjk4NTMxMSAwLjU0MzI3NSwwIDAuOTg1MzEsLTAuNDQyMDM1IDAuOTg1MzEsLTAuOTg1MzExIDAsLTAuMjA0MjA1IC0wLjA2MjQ0LC0wLjM5NDAwMSAtMC4xNjkzNSwtMC41NTE1MjcgbCAxLjMwNzg3NywtMS4zNjc0ODkgYyAwLjE2NDA1NCwwLjEyMTY4NiAwLjM2NjI4OSwwLjE5NDcyMiAwLjU4NTc2NywwLjE5NDcyMiAwLjU0MzI3NiwwIDAuOTg1MzExLC0wLjQ0MjAzNSAwLjk4NTMxMSwtMC45ODUzMSAwLC0wLjU0MzI3NiAtMC40NDIwMzUsLTAuOTg1MzExIC0wLjk4NTMxMSwtMC45ODUzMTEgLTAuMjI3MzYsMCAtMC40MzYyNDYsMC4wNzgwOSAtMC42MDMyNTYsMC4yMDc5MDEgTCA1LjYwMzk5MDMsMi41NTMxMTUgYyAwLjEyOTgxNSwtMC4xNjcwMSAwLjIwNzksLTAuMzc1ODk2IDAuMjA3OSwtMC42MDMyNTcgMCwtMC41NDMyNzUgLTAuNDQyMDM1LC0wLjk4NTMxMTAyIC0wLjk4NTMxLC0wLjk4NTMxMTAyIC0wLjU0MzI3NiwwIC0wLjk4NTMxMSwwLjQ0MjAzNjAyIC0wLjk4NTMxMSwwLjk4NTMxMTAyIDAsMC4wNzQ4OCAwLjAwOTEsMC4xNDc2NzQgMC4wMjUxMiwwLjIxNzg3NyBMIDIuOTkyOTExMywyLjQ4NTk5IEMgMi44MjkyMzMzLDIuMTY4MTA0IDIuNDk4NDE1MywxLjk0OTg1NyAyLjExNjk3NjMsMS45NDk4NTcgYyAtMC41NDMyNzUsMCAtMC45ODUzMTEsMC40NDIwMzUgLTAuOTg1MzExLDAuOTg1MzExIDAsMC41NDMyNzYgMC40NDIwMzYsMC45ODUzMTEgMC45ODUzMTEsMC45ODUzMTEgMC4xNDAxNjEsMCAwLjI3MzMwMSwtMC4wMjk4MSAwLjM5NDEyNSwtMC4wODI4OSBsIDAuNDUzMzY2LDAuNzYzIHogbSAtMC40MjY2NCwxLjYyNTc2MyBjIC0wLjQwNzU0OSwwIC0wLjczODk4MywtMC4zMzE0MzQgLTAuNzM4OTgzLC0wLjczODk4MyAwLC0wLjQwNzU0OSAwLjMzMTQzNCwtMC43Mzg5ODMgMC43Mzg5ODMsLTAuNzM4OTgzIDAuNDA3NTQ5LDAgMC43Mzg5ODMsMC4zMzE0MzQgMC43Mzg5ODMsMC43Mzg5ODMgMCwwLjQwNzU0OSAtMC4zMzE0MzQsMC43Mzg5ODMgLTAuNzM4OTgzLDAuNzM4OTgzIHogbSAwLjkyODUzMiwtMC40MTI0NzYgYyAwLjAzNjA5LC0wLjEwMjM0OSAwLjA1Njc4LC0wLjIxMTk2NSAwLjA1Njc4LC0wLjMyNjUwNyAwLC0wLjMwMjEyMSAtMC4xMzY5NTgsLTAuNTcyNTg5IC0wLjM1MTYzMywtMC43NTMzOTMgbCAwLjM1NDIxOSwtMC41NDcwOTQgMS4wNjc5NTQsMS43OTcwODMgYyAtMC4wODk5MSwwLjA4MDA2IC0wLjE2NTE2MywwLjE3NTg3OCAtMC4yMjA5NTYsMC4yODM2NDcgeiBtIDEuNzgxMDczLC0zLjUyODc2NyBjIDAuMjI3MzYsMCAwLjQzNjI0NiwtMC4wNzgwOSAwLjYwMzI1NiwtMC4yMDc5MDEgbCAxLjMyOTA2MSwxLjMyOTA2MSBjIC0wLjA3OTY5LDAuMTAyNDczIC0wLjEzOTI5OCwwLjIyMDgzMyAtMC4xNzM2NjEsMC4zNDk2NjMgTCA1LjgxMTUyMjMsNC4yOTk1NzcgYyAtMS4yM2UtNCwtMC4wMDMyIDMuNjllLTQsLTAuMDA2NCAzLjY5ZS00LC0wLjAwOTYgMCwtMC41NDMyNzUgLTAuNDQyMDM1LC0wLjk4NTMxMSAtMC45ODUzMSwtMC45ODUzMTEgLTAuMzQwOTE4LDAgLTAuNjQxOTMsMC4xNzQxNTQgLTAuODE4NzkzLDAuNDM4MDk0IEwgMy44NjA4NTMzLDMuNjY5MzUgNC40MDAwNjQzLDIuODM2NjM5IGMgMC4xMjkxOTksMC4wNjI0NCAwLjI3MzU0NywwLjA5ODUzIDAuNDI2NTE3LDAuMDk4NTMgeiBtIDAuMTIzMTY0LDMuNDU3MDg2IFYgNS4yNjY2NTkgYyAwLjQwMDI4MiwtMC4wNTAyNSAwLjcyNTkyNywtMC4zNDExNjMgMC44Mjc5MDcsLTAuNzIzMjE4IGwgMC43NzM3MTUsMC4xMDY0MTQgYyAwLDAuMDAzMiAtNC45MmUtNCwwLjAwNjQgLTQuOTJlLTQsMC4wMDk2IDAsMC4yMzUyNDMgMC4wODMwMSwwLjQ1MTE0OSAwLjIyMTA3OSwwLjYyMDc0NiBMIDUuNDc4NzMzMyw2LjYzMjQxNiBDIDUuMzMzNzY5Myw2LjUwMzk1NiA1LjE1MTM2NDMsNi40MTc2MTkgNC45NDk3NDUzLDYuMzkyMjQ3IHogTSA0LjgyNjU4MTMsMy41NTA5ODcgYyAwLjQwNzU0OSwwIDAuNzM4OTgzLDAuMzMxNDM0IDAuNzM4OTgzLDAuNzM4OTgzIDAsMC40MDc1NDkgLTAuMzMxNDM0LDAuNzM4OTgzIC0wLjczODk4MywwLjczODk4MyAtMC40MDc1NDksMCAtMC43Mzg5ODMsLTAuMzMxNDM0IC0wLjczODk4MywtMC43Mzg5ODMgMCwtMC40MDc1NDkgMC4zMzE0MzQsLTAuNzM4OTgzIDAuNzM4OTgzLC0wLjczODk4MyB6IG0gLTAuOTI4NTMyLDAuNDEyNDc2IGMgLTAuMDM2MDksMC4xMDIzNDkgLTAuMDU2NzgsMC4yMTE5NjUgLTAuMDU2NzgsMC4zMjY1MDcgMCwwLjUwMTUyMyAwLjM3Njg4MSwwLjkxNTg0NyAwLjg2MjE0NywwLjk3NjgxMyB2IDEuMTI1NTk0IGMgLTAuMTE2NzU5LDAuMDE0NjYgLTAuMjI2OTkxLDAuMDQ5NjQgLTAuMzI3MzcsMC4xMDE0ODcgTCAzLjI1NDI3MDMsNC42MDYxMzIgMy43MjYxMTEzLDMuODc3NDk1IHogbSAwLjkyODUzMiw0LjE0NDU4NiBjIC0wLjQwNzU0OSwwIC0wLjczODk4MywtMC4zMzE0MzQgLTAuNzM4OTgzLC0wLjczODk4MyAwLC0wLjQwNzU0OSAwLjMzMTQzNCwtMC43Mzg5ODMgMC43Mzg5ODMsLTAuNzM4OTgzIDAuNDA3NTQ5LDAgMC43Mzg5ODMsMC4zMzE0MzQgMC43Mzg5ODMsMC43Mzg5ODMgMCwwLjQwNzU0OSAtMC4zMzE0MzQsMC43Mzg5ODMgLTAuNzM4OTgzLDAuNzM4OTgzIHogbSAyLjcwOTYwNCwtNC4xODc1NyBjIDAuNDA3NTQ5LDAgMC43Mzg5ODMsMC4zMzE0MzQgMC43Mzg5ODMsMC43Mzg5ODMgMCwwLjQwNzU0OSAtMC4zMzE0MzQsMC43Mzg5ODMgLTAuNzM4OTgzLDAuNzM4OTgzIC0wLjQwNzU0OSwwIC0wLjczODk4MywtMC4zMzE0MzQgLTAuNzM4OTgzLC0wLjczODk4MyAwLC0wLjQwNzU0OSAwLjMzMTQzNCwtMC43Mzg5ODMgMC43Mzg5ODMsLTAuNzM4OTgzIHogTSA0LjgyNjU4MTMsMS4yMTA4NzQgYyAwLjQwNzU0OSwwIDAuNzM4OTgzLDAuMzMxNDM0IDAuNzM4OTgzLDAuNzM4OTgzIDAsMC40MDc1NDkgLTAuMzMxNDM0LDAuNzM4OTgzIC0wLjczODk4MywwLjczODk4MyAtMC40MDc1NDksMCAtMC43Mzg5ODMsLTAuMzMxNDM0IC0wLjczODk4MywtMC43Mzg5ODMgMCwtMC40MDc1NDkgMC4zMzE0MzQsLTAuNzM4OTgzIDAuNzM4OTgzLC0wLjczODk4MyB6IG0gLTAuODc1ODE4LDEuMTg4MTYyIGMgMC4wNjAyMywwLjExNjg4MiAwLjE0MjYyMywwLjIyMDIxNyAwLjI0MjI2MywwLjMwNDIxNCBMIDMuNjM5MjgxMywzLjU1ODUgMy4wNDU2MzIzLDMuMjYxNjc1IGMgMC4wMzU5NiwtMC4xMDIzNDkgMC4wNTY2NSwtMC4yMTE5NjUgMC4wNTY2NSwtMC4zMjY1MDcgMCwtMC4wNzQ4OCAtMC4wMDkxLC0wLjE0NzY3MyAtMC4wMjUxMiwtMC4yMTc4NzcgeiBtIC0yLjU3Mjc3LDAuNTM2MTMyIGMgMCwtMC40MDc1NDkgMC4zMzE0MzQsLTAuNzM4OTgzIDAuNzM4OTgzLC0wLjczODk4MyAwLjQwNzU0OSwwIDAuNzM4OTgzLDAuMzMxNDM0IDAuNzM4OTgzLDAuNzM4OTgzIDAsMC40MDc1NDkgLTAuMzMxNDM0LDAuNzM4OTgzIC0wLjczODk4MywwLjczODk4MyAtMC40MDc1NDksMCAtMC43Mzg5ODMsLTAuMzMxNDM0IC0wLjczODk4MywtMC43Mzg5ODMgeiBtIDEuMzQ0MzM0LDAuNzc1ODA5IGMgMC4wODI1MiwtMC4wNjQ1NCAwLjE1NDk0LC0wLjE0MTM5MiAwLjIxMzQ0MiwtMC4yMjg1OTIgbCAwLjU2ODY0OCwwLjI4NDI2MiAtMC4zOTA1NTMsMC42MDMxMzMgeiIKICAgICBpZD0icGF0aDE1IgogICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiCiAgICAgc3R5bGU9ImZpbGw6IzAwMDAwMCIgLz4KPC9zdmc+Cg==';

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgaWQ9IkxheWVyXzFfMV8iCiAgIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDY0IDY0IgogICBoZWlnaHQ9IjU5LjExODY0OSIKICAgdmlld0JveD0iMCAwIDcuMzg5ODMwMSA3LjM4OTgzMTEiCiAgIHdpZHRoPSI1OS4xMTg2NDEiCiAgIHZlcnNpb249IjEuMSIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMC40OC40IHI5OTM5IgogICBzb2RpcG9kaTpkb2NuYW1lPSJ0ZXh0LWNsYXNzaWZpY2F0aW9uLWJsb2Nrcy1zbWFsbC5zdmciPgogIDxtZXRhZGF0YQogICAgIGlkPSJtZXRhZGF0YTIxIj4KICAgIDxyZGY6UkRGPgogICAgICA8Y2M6V29yawogICAgICAgICByZGY6YWJvdXQ9IiI+CiAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+CiAgICAgICAgPGRjOnR5cGUKICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIiAvPgogICAgICAgIDxkYzp0aXRsZT48L2RjOnRpdGxlPgogICAgICA8L2NjOldvcms+CiAgICA8L3JkZjpSREY+CiAgPC9tZXRhZGF0YT4KICA8ZGVmcwogICAgIGlkPSJkZWZzMTkiIC8+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiIKICAgICBib3JkZXJvcGFjaXR5PSIxIgogICAgIG9iamVjdHRvbGVyYW5jZT0iMTAiCiAgICAgZ3JpZHRvbGVyYW5jZT0iMTAiCiAgICAgZ3VpZGV0b2xlcmFuY2U9IjEwIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwIgogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxMDA3IgogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9Ijc4MyIKICAgICBpZD0ibmFtZWR2aWV3MTciCiAgICAgc2hvd2dyaWQ9ImZhbHNlIgogICAgIGZpdC1tYXJnaW4tdG9wPSIwIgogICAgIGZpdC1tYXJnaW4tbGVmdD0iMCIKICAgICBmaXQtbWFyZ2luLXJpZ2h0PSIwIgogICAgIGZpdC1tYXJnaW4tYm90dG9tPSIwIgogICAgIGlua3NjYXBlOnpvb209IjcuMzc1IgogICAgIGlua3NjYXBlOmN4PSI0MC4yNDQyNjQiCiAgICAgaW5rc2NhcGU6Y3k9IjI3LjM3NDM5NCIKICAgICBpbmtzY2FwZTp3aW5kb3cteD0iNjI3IgogICAgIGlua3NjYXBlOndpbmRvdy15PSIxNzgiCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMCIKICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJMYXllcl8xXzFfIiAvPgogIDxwYXRoCiAgICAgZD0ibSAxLjg0NzQ1OCw1LjE3Mjg4MSBjIDAsMC4xMzkxNzUgLTAuMDMyMDIsMC4yNjk3MjkgLTAuMDkxMTQsMC4zODU1MDMgLTAuMTQwNDA3LDAuMjgzMjc3IC0wLjQzMzUzNywwLjQ3NjY0NCAtMC43NzEwMDYsMC40NzY2NDQgLTAuNDc2NjQ0LDAgLTAuODYyMTQ3LC0wLjM4NTUwMyAtMC44NjIxNDcsLTAuODYyMTQ3IDAsLTAuNDc2NjQ0IDAuMzg1NTAzLC0wLjg2MjE0NyAwLjg2MjE0NywtMC44NjIxNDcgMC4xNzM2NjEsMCAwLjMzMzc3NCwwLjA1MDUgMC40NjgwMjMsMC4xMzc5NDMgMC4yMzc3MDYsMC4xNTM5NTUgMC4zOTQxMjQsMC40MTk5ODkgMC4zOTQxMjQsMC43MjQyMDQgeiIKICAgICBpZD0icGF0aDMiCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIKICAgICBzdHlsZT0iZmlsbDojMDAwMDgwO2ZpbGwtb3BhY2l0eToxIiAvPgogIDxwYXRoCiAgICAgZD0ibSA2LjM2ODU2NTQsMi44OTI2OTIzIGMgMC40NzY2NDQsMCAwLjg2MjE0NywwLjM4NTUwMyAwLjg2MjE0NywwLjg2MjE0NyAwLDAuNDc2NjQ0IC0wLjM4NTUwMywwLjg2MjE0NyAtMC44NjIxNDcsMC44NjIxNDcgLTAuMjMxNTQ4LDAgLTAuNDQwOTI2LC0wLjA4OTkxIC0wLjU5NDg4MSwtMC4yNDAxNyAtMC4xNjUwNCwtMC4xNTUxODYgLTAuMjY3MjY2LC0wLjM3Njg4MSAtMC4yNjcyNjYsLTAuNjIxOTc3IDAsLTAuMDM5NDEgMC4wMDI1LC0wLjA3NzU5IDAuMDA4NiwtMC4xMTU3NzQgMC4wMjQ2MywtMC4xOTIxMzYgMC4xMTMzMTEsLTAuMzYzMzM0IDAuMjQzODY0LC0wLjQ5Mzg4NyAwLjE1NjQxOCwtMC4xNTY0MTggMC4zNzA3MjMsLTAuMjUyNDg2IDAuNjA5NjYxLC0wLjI1MjQ4NiB6IgogICAgIGlkPSJwYXRoNyIKICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIgogICAgIHN0eWxlPSJmaWxsOiMwMDAwODAiIC8+CiAgPHBhdGgKICAgICBzdHlsZT0iZmlsbDojMDAwMDgwO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lIgogICAgIGQ9Ik0gMC41NTI1NTMxLDIuNjc2ODk0IEMgMC4xMzEzMjQ4LDIuMzk4MTc3MyAwLjA2ODk3NDMsMS43ODE2NjU3IDAuNDI0MDQ1MywxLjQwNjIyODcgMC43NzA1OTM4LDEuMDM5ODAzMSAxLjM2MzUxMzIsMS4wOTg3OTg2IDEuNjQ3ODI2NSwxLjUyNzk5NDkgMi4xMTMyNjE1LDIuMjMwNjEwNyAxLjI0ODY5MSwzLjEzNzUxMTMgMC41NTI1NTMxLDIuNjc2ODk0IHoiCiAgICAgaWQ9InBhdGgyOTg4IgogICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiIC8+CiAgPHBhdGgKICAgICBzdHlsZT0iZmlsbDojMDAwMDgwO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lIgogICAgIGQ9Ik0gMy4xNzMyMzkxLDEuNjEzMTIxMiBDIDIuODgxMTA1MywxLjM2MzcyNDUgMi44MDI1OTA2LDEuMDM2NTc2MSAyLjk0OTM0NTksMC42ODAyMjI3MSAzLjE3NDc1MzEsMC4xMzI4ODU5MSAzLjg0Njc0NiwtMC4wMzc5NTMxMiA0LjI1Njk4NiwwLjM0Nzc4NDYxIDUuMDY2MTYyMSwxLjEwODYzMTcgNC4wMTcwNzEyLDIuMzMzNTA1NSAzLjE3MzIzOTEsMS42MTMxMjEyIHoiCiAgICAgaWQ9InBhdGgyOTkwIgogICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiIC8+CiAgPHBhdGgKICAgICBzdHlsZT0iZmlsbDojMDAwMDgwO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lIgogICAgIGQ9Ik0gMy4yNDY4MzE5LDQuMDExMTU0MSBDIDIuNjk2MTcxMiwzLjY3NjQwODQgMi43NjExODAzLDIuODg1ODgwMyAzLjM2MjE1MjksMi42MDg4MjI0IDMuNzM0NDIyNywyLjQzNzE5OTkgNC4xNTc3MTY5LDIuNTY1NzM1NCA0LjM3ODQ1MjIsMi45MTc0MjY4IDQuNTk4NTIwOSwzLjI2ODA1NjMgNC41NzczMTEzLDMuNTU5OTAyMiA0LjMxMDg5NTYsMy44NDcwMTM4IDQuMDEzOTgzNSw0LjE2Njk5MDcgMy42MDY1NjksNC4yMjk4Mzc2IDMuMjQ2ODMxOSw0LjAxMTE1NDEgeiIKICAgICBpZD0icGF0aDI5OTIiCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIgLz4KICA8cGF0aAogICAgIHN0eWxlPSJmaWxsOiMwMDAwODA7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmUiCiAgICAgZD0iTSAzLjE5Mjk2MTUsNy4wMTc1MjgxIEMgMi45MDUwMTk1LDYuNzczNDI4NCAyLjgyNzYzMTIsNi40NTMyMjgyIDIuOTcyMjgwOSw2LjEwNDQ0MzQgMy4xOTQ0NTM3LDUuNTY4NzMxMiAzLjg1NjgwNDIsNS40MDE1MjA2IDQuMjYxMTU3Nyw1Ljc3OTA2NTggNS4wNTg3MjMyLDYuNTIzNzUzNSA0LjAyNDY4NTQsNy43MjI2MTI3IDMuMTkyOTYxNSw3LjAxNzUyODEgeiIKICAgICBpZD0icGF0aDI5OTQiCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIgLz4KICA8cGF0aAogICAgIHN0eWxlPSJmaWxsOiNmNmRiNDA7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmUiCiAgICAgZD0iIgogICAgIGlkPSJwYXRoMzAwMSIKICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPgogIDxwYXRoCiAgICAgZD0iTSAxLjQxMTk1MSw0LjI4NjEwMSBDIDEuMjgyNjI5LDQuMjIzNjYxIDEuMTM4MjgxLDQuMTg3NTcxIDAuOTg1MzExLDQuMTg3NTcxIDAuNDQyMDM2LDQuMTg3NTcxIDAsNC42Mjk2MDYgMCw1LjE3Mjg4MiBjIDAsMC41NDMyNzYgMC40NDIwMzYsMC45ODUzMTEgMC45ODUzMTEsMC45ODUzMTEgMC4zNDA5MTgsMCAwLjY0MTgwNywtMC4xNzQxNTQgMC44MTg3OTMsLTAuNDM4MDk0IGwgMC45MzA3NSwwLjQ2NTkyOSBjIC0wLjAxNjAxLDAuMDcwMzMgLTAuMDI1MjUsMC4xNDMzNjIgLTAuMDI1MjUsMC4yMTg0OTIgMCwwLjU0MzI3NiAwLjQ0MjAzNSwwLjk4NTMxMSAwLjk4NTMxMSwwLjk4NTMxMSAwLjU0MzI3NSwwIDAuOTg1MzEsLTAuNDQyMDM1IDAuOTg1MzEsLTAuOTg1MzExIDAsLTAuMjA0MjA1IC0wLjA2MjQ0LC0wLjM5NDAwMSAtMC4xNjkzNSwtMC41NTE1MjcgTCA1LjgxODc1Miw0LjQ4NTUwNCBjIDAuMTY0MDU0LDAuMTIxNjg2IDAuMzY2Mjg5LDAuMTk0NzIyIDAuNTg1NzY3LDAuMTk0NzIyIDAuNTQzMjc2LDAgMC45ODUzMTEsLTAuNDQyMDM1IDAuOTg1MzExLC0wLjk4NTMxIDAsLTAuNTQzMjc2IC0wLjQ0MjAzNSwtMC45ODUzMTEgLTAuOTg1MzExLC0wLjk4NTMxMSAtMC4yMjczNiwwIC0wLjQzNjI0NiwwLjA3ODA5IC0wLjYwMzI1NiwwLjIwNzkwMSBMIDQuNDcyMzI1LDEuNTg4NTY4IEMgNC42MDIxNCwxLjQyMTU1OCA0LjY4MDIyNSwxLjIxMjY3MiA0LjY4MDIyNSwwLjk4NTMxMTAxIDQuNjgwMjI1LDAuNDQyMDM2MDEgNC4yMzgxOSwwIDMuNjk0OTE1LDAgMy4xNTE2MzksMCAyLjcwOTYwNCwwLjQ0MjAzNjAxIDIuNzA5NjA0LDAuOTg1MzExMDEgYyAwLDAuMDc0ODggMC4wMDkxLDAuMTQ3NjczOTkgMC4wMjUxMiwwLjIxNzg3Njk5IEwgMS44NjEyNDYsMS41MjE0NDMgQyAxLjY5NzU2OCwxLjIwMzU1NyAxLjM2Njc1LDAuOTg1MzEwMDEgMC45ODUzMTEsMC45ODUzMTAwMSAwLjQ0MjAzNiwwLjk4NTMxMDAxIDAsMS40MjczNDUgMCwxLjk3MDYyMSBjIDAsMC41NDMyNzYgMC40NDIwMzYsMC45ODUzMTEgMC45ODUzMTEsMC45ODUzMTEgMC4xNDAxNjEsMCAwLjI3MzMwMSwtMC4wMjk4MSAwLjM5NDEyNSwtMC4wODI4OSBsIDAuNDUzMzY2LDAuNzYzIHogbSAtMC40MjY2NCwxLjYyNTc2MyBjIC0wLjQwNzU0OSwwIC0wLjczODk4MywtMC4zMzE0MzQgLTAuNzM4OTgzLC0wLjczODk4MyAwLC0wLjQwNzU0OSAwLjMzMTQzNCwtMC43Mzg5ODMgMC43Mzg5ODMsLTAuNzM4OTgzIDAuNDA3NTQ5LDAgMC43Mzg5ODMsMC4zMzE0MzQgMC43Mzg5ODMsMC43Mzg5ODMgMCwwLjQwNzU0OSAtMC4zMzE0MzQsMC43Mzg5ODMgLTAuNzM4OTgzLDAuNzM4OTgzIHogTSAxLjkxMzg0Myw1LjQ5OTM4OCBDIDEuOTQ5OTMzLDUuMzk3MDM5IDEuOTcwNjIzLDUuMjg3NDIzIDEuOTcwNjIzLDUuMTcyODgxIDEuOTcwNjIzLDQuODcwNzYgMS44MzM2NjUsNC42MDAyOTIgMS42MTg5OSw0LjQxOTQ4OCBMIDEuOTczMjA5LDMuODcyMzk0IDMuMDQxMTYzLDUuNjY5NDc3IEMgMi45NTEyNTMsNS43NDk1MzcgMi44NzYsNS44NDUzNTUgMi44MjAyMDcsNS45NTMxMjQgeiBNIDMuNjk0OTE2LDEuOTcwNjIxIGMgMC4yMjczNiwwIDAuNDM2MjQ2LC0wLjA3ODA5IDAuNjAzMjU2LC0wLjIwNzkwMSBMIDUuNjI3MjMzLDMuMDkxNzgxIEMgNS41NDc1NDMsMy4xOTQyNTQgNS40ODc5MzUsMy4zMTI2MTQgNS40NTM1NzIsMy40NDE0NDQgTCA0LjY3OTg1NywzLjMzNTAzIGMgLTEuMjNlLTQsLTAuMDAzMiAzLjY5ZS00LC0wLjAwNjQgMy42OWUtNCwtMC4wMDk2IDAsLTAuNTQzMjc1IC0wLjQ0MjAzNSwtMC45ODUzMTEgLTAuOTg1MzEsLTAuOTg1MzExIC0wLjM0MDkxOCwwIC0wLjY0MTkzLDAuMTc0MTU0IC0wLjgxODc5MywwLjQzODA5NCBMIDIuNzI5MTg4LDIuNzA0ODAzIDMuMjY4Mzk5LDEuODcyMDkyIGMgMC4xMjkxOTksMC4wNjI0NCAwLjI3MzU0NywwLjA5ODUzIDAuNDI2NTE3LDAuMDk4NTMgeiBNIDMuODE4MDgsNS40Mjc3MDcgViA0LjMwMjExMiBDIDQuMjE4MzYyLDQuMjUxODYyIDQuNTQ0MDA3LDMuOTYwOTQ5IDQuNjQ1OTg3LDMuNTc4ODk0IGwgMC43NzM3MTUsMC4xMDY0MTQgYyAwLDAuMDAzMiAtNC45MmUtNCwwLjAwNjQgLTQuOTJlLTQsMC4wMDk2IDAsMC4yMzUyNDMgMC4wODMwMSwwLjQ1MTE0OSAwLjIyMTA3OSwwLjYyMDc0NiBMIDQuMzQ3MDY4LDUuNjY3ODY5IEMgNC4yMDIxMDQsNS41Mzk0MDkgNC4wMTk2OTksNS40NTMwNzIgMy44MTgwOCw1LjQyNzcgeiBNIDMuNjk0OTE2LDIuNTg2NDQgYyAwLjQwNzU0OSwwIDAuNzM4OTgzLDAuMzMxNDM0IDAuNzM4OTgzLDAuNzM4OTgzIDAsMC40MDc1NDkgLTAuMzMxNDM0LDAuNzM4OTgzIC0wLjczODk4MywwLjczODk4MyAtMC40MDc1NDksMCAtMC43Mzg5ODMsLTAuMzMxNDM0IC0wLjczODk4MywtMC43Mzg5ODMgMCwtMC40MDc1NDkgMC4zMzE0MzQsLTAuNzM4OTgzIDAuNzM4OTgzLC0wLjczODk4MyB6IE0gMi43NjYzODQsMi45OTg5MTYgYyAtMC4wMzYwOSwwLjEwMjM0OSAtMC4wNTY3OCwwLjIxMTk2NSAtMC4wNTY3OCwwLjMyNjUwNyAwLDAuNTAxNTIzIDAuMzc2ODgxLDAuOTE1ODQ3IDAuODYyMTQ3LDAuOTc2ODEzIFYgNS40Mjc4MyBDIDMuNDU0OTkyLDUuNDQyNDkgMy4zNDQ3Niw1LjQ3NzQ3IDMuMjQ0MzgxLDUuNTI5MzE3IEwgMi4xMjI2MDUsMy42NDE1ODUgMi41OTQ0NDYsMi45MTI5NDggeiBtIDAuOTI4NTMyLDQuMTQ0NTg2IGMgLTAuNDA3NTQ5LDAgLTAuNzM4OTgzLC0wLjMzMTQzNCAtMC43Mzg5ODMsLTAuNzM4OTgzIDAsLTAuNDA3NTQ5IDAuMzMxNDM0LC0wLjczODk4MyAwLjczODk4MywtMC43Mzg5ODMgMC40MDc1NDksMCAwLjczODk4MywwLjMzMTQzNCAwLjczODk4MywwLjczODk4MyAwLDAuNDA3NTQ5IC0wLjMzMTQzNCwwLjczODk4MyAtMC43Mzg5ODMsMC43Mzg5ODMgeiBNIDYuNDA0NTIsMi45NTU5MzIgYyAwLjQwNzU0OSwwIDAuNzM4OTgzLDAuMzMxNDM0IDAuNzM4OTgzLDAuNzM4OTgzIDAsMC40MDc1NDkgLTAuMzMxNDM0LDAuNzM4OTgzIC0wLjczODk4MywwLjczODk4MyAtMC40MDc1NDksMCAtMC43Mzg5ODMsLTAuMzMxNDM0IC0wLjczODk4MywtMC43Mzg5ODMgMCwtMC40MDc1NDkgMC4zMzE0MzQsLTAuNzM4OTgzIDAuNzM4OTgzLC0wLjczODk4MyB6IE0gMy42OTQ5MTYsMC4yNDYzMjcwMSBjIDAuNDA3NTQ5LDAgMC43Mzg5ODMsMC4zMzE0MzQgMC43Mzg5ODMsMC43Mzg5ODMgMCwwLjQwNzU0ODk5IC0wLjMzMTQzNCwwLjczODk4Mjk5IC0wLjczODk4MywwLjczODk4Mjk5IC0wLjQwNzU0OSwwIC0wLjczODk4MywtMC4zMzE0MzQgLTAuNzM4OTgzLC0wLjczODk4Mjk5IDAsLTAuNDA3NTQ5IDAuMzMxNDM0LC0wLjczODk4MyAwLjczODk4MywtMC43Mzg5ODMgeiBNIDIuODE5MDk4LDEuNDM0NDg5IGMgMC4wNjAyMywwLjExNjg4MiAwLjE0MjYyMywwLjIyMDIxNyAwLjI0MjI2MywwLjMwNDIxNCBMIDIuNTA3NjE2LDIuNTkzOTUzIDEuOTEzOTY3LDIuMjk3MTI4IGMgMC4wMzU5NiwtMC4xMDIzNDkgMC4wNTY2NSwtMC4yMTE5NjUgMC4wNTY2NSwtMC4zMjY1MDcgMCwtMC4wNzQ4OCAtMC4wMDkxLC0wLjE0NzY3MyAtMC4wMjUxMiwtMC4yMTc4NzcgeiBtIC0yLjU3Mjc3LDAuNTM2MTMyIGMgMCwtMC40MDc1NDkgMC4zMzE0MzQsLTAuNzM4OTgzIDAuNzM4OTgzLC0wLjczODk4MyAwLjQwNzU0OSwwIDAuNzM4OTgzLDAuMzMxNDM0IDAuNzM4OTgzLDAuNzM4OTgzIDAsMC40MDc1NDkgLTAuMzMxNDM0LDAuNzM4OTgzIC0wLjczODk4MywwLjczODk4MyAtMC40MDc1NDksMCAtMC43Mzg5ODMsLTAuMzMxNDM0IC0wLjczODk4MywtMC43Mzg5ODMgeiBNIDEuNTkwNjYyLDIuNzQ2NDMgQyAxLjY3MzE4MiwyLjY4MTg5IDEuNzQ1NjAyLDIuNjA1MDM4IDEuODA0MTA0LDIuNTE3ODM4IEwgMi4zNzI3NTIsMi44MDIxIDEuOTgyMTk5LDMuNDA1MjMzIHoiCiAgICAgaWQ9InBhdGgxNSIKICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIgogICAgIHN0eWxlPSJmaWxsOiMwMDAwMDAiIC8+Cjwvc3ZnPgo=';

/**
 * The url of the synthesis server.
 * @type {string}
 */
const SERVER_HOST = 'https://synthesis-service.scratch.mit.edu';

/**
 * The url of the translate server.
 * @type {string}
 */
const serverURL = 'https://translate-service.scratch.mit.edu/';

/**
 * How long to wait in ms before timing out requests to translate server.
 * @type {int}
 */
const serverTimeoutMs = 10000; // 10 seconds (chosen arbitrarily).


/**
 * How long to wait in ms before timing out requests to synthesis server.
 * @type {int}
 */
const SERVER_TIMEOUT = 10000; // 10 seconds

/**
 * Volume for playback of speech sounds, as a percentage.
 * @type {number}
 */
const SPEECH_VOLUME = 250;

/**
 * An id for one of the voices.
 */
const ALTO_ID = 'ALTO';

/**
 * An id for one of the voices.
 */
const TENOR_ID = 'TENOR';

/**
 * An id for one of the voices.
 */
const SQUEAK_ID = 'SQUEAK';

/**
 * An id for one of the voices.
 */
const GIANT_ID = 'GIANT';

/**
 * Playback rate for the tenor voice, for cases where we have only a female gender voice.
 */
const FEMALE_TENOR_RATE = 0.89; // -2 semitones

/**
 * Playback rate for the giant voice, for cases where we have only a female gender voice.
 */
const FEMALE_GIANT_RATE = 0.79; // -4 semitones



/**
 * Class for the motion-related blocks in Scratch 3.0
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */
class Scratch3TextClassificationBlocks {
    constructor (runtime) {

         /**
         * The result from the most recent translation.
         * @type {string}
         * @private
         */
        this._translateResult = '';

        /**
         * The language of the text most recently translated.
         * @type {string}
         * @private
         */
        this._lastLangTranslated = '';

        /**
         * The text most recently translated.
         * @type {string}
         * @private
         */
        this._lastTextTranslated = '';

        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
         this.scratch_vm = runtime;
         this.predictedLabel=null;
         //this.mobilenetModule = null;
         this.classifier = knnClassifier.create();
         this.embedding = null;
         this.count = 0;
         this.classifiedData = null;
         this.confidence = 0;
         this.classifiedData = null;   
         this.exampleEmbeddings = {};
         this.lastEmbedding = {};
                 
        /**
         * The timer utility.
         * @type {Timer}
         */
        this._timer = new Timer();

        /**
         * The stored microphone loudness measurement.
         * @type {number}
         */
        this._cachedLoudness = -1;

        /**
         * The time of the most recent microphone loudness measurement.
         * @type {number}
         */
        this._cachedLoudnessTimestamp = 0;
         
         /**
         * Map of soundPlayers by sound id.
         * @type {Map<string, SoundPlayer>}
         */
        this._soundPlayers = new Map();

        this._stopAllSpeech = this._stopAllSpeech.bind(this);
        if (this.scratch_vm) {
            this.scratch_vm.on('PROJECT_STOP_ALL', this._stopAllSpeech);
        }

        this._onTargetCreated = this._onTargetCreated.bind(this);
        if (this.scratch_vm) {
            this.scratch_vm.on('targetWasCreated', this._onTargetCreated);
        }
        
        this.scratch_vm.on('EDIT_TEXT_MODEL', modelInfo => {
            console.log(modelInfo);
            console.log("Calling bound function");
            this.editModel.bind(this, modelInfo);
        });
        this.scratch_vm.on('EDIT_TEXT_CLASSIFIER', modelInfo => {
            console.log(modelInfo);
            console.log("Calling bound function");
            this.editModel.bind(this, modelInfo);
        });
        
        this.labelList = [];
        this.labelListEmpty = true;
        
        // When a project is loaded, reset all the model data
        this.scratch_vm.on('PROJECT_LOADED', () => {
            this.clearLocal();
            this.loadModelFromRuntime();
        });
        // Listen for model editing events emitted by the text modal
        this.scratch_vm.on('NEW_EXAMPLES', (examples, label) => {
            this.newExamples(examples, label);
        });
        this.scratch_vm.on('NEW_LABEL', (label) => {
            this.newLabel(label);
        });
        this.scratch_vm.on('DELETE_EXAMPLE', (label, exampleNum) => {
            this.deleteExample(label, exampleNum);
        });
        this.scratch_vm.on('RENAME_LABEL', (oldName, newName) => {
            this.renameLabel(oldName, newName);
        });
        this.scratch_vm.on('DELETE_LABEL', (label) => {
            this.clearAllWithLabel({LABEL: label});
        });
        this.scratch_vm.on('CLEAR_ALL_LABELS', () => {
            if (!this.labelListEmpty && confirm('Are you sure you want to clear all labels?')) {    //confirm with alert dialogue before clearing the model
                let labels = [...this.labelList];
                for (var i = 0; i < labels.length; i++) {
                    this.clearAllWithLabel({LABEL: labels[i]});
                }
                //this.clearAll(); this crashed Scratch for some reason
            }
        });

        //Listen for model editing events emitted by the classifier modal
        this.scratch_vm.on('EXPORT_CLASSIFIER', () => {
            this.exportClassifier();
        });
        this.scratch_vm.on('LOAD_CLASSIFIER', () => {
            console.log("load");
            this.loadClassifier();
        });

        
        this._recognizedSpeech = "";

    }

    /**
     * An object with info for each voice.
     */
    get VOICE_INFO () {
        return {
            [SQUEAK_ID]: {
                name: formatMessage({
                    id: 'text2speech.squeak',
                    default: 'squeak',
                    description: 'Name for a funny voice with a high pitch.'
                }),
                gender: 'female',
                playbackRate: 1.19 // +3 semitones
            },
            [TENOR_ID]: {
                name: formatMessage({
                    id: 'text2speech.tenor',
                    default: 'tenor',
                    description: 'Name for a voice with ambiguous gender.'
                }),
                gender: 'male',
                playbackRate: 1
            },
            [ALTO_ID]: {
                name: formatMessage({
                    id: 'text2speech.alto',
                    default: 'alto',
                    description: 'Name for a voice with ambiguous gender.'
                }),
                gender: 'female',
                playbackRate: 1
            },
            [GIANT_ID]: {
                name: formatMessage({
                    id: 'text2speech.giant',
                    default: 'giant',
                    description: 'Name for a funny voice with a low pitch.'
                }),
                gender: 'male',
                playbackRate: 0.84 // -3 semitones
            }
        };
    }
    
     /**
     * The key to load & store a target's text2speech state.
     * @return {string} The key.
     */
    static get STATE_KEY () {
        return 'Scratch.text2speech';
    }

    /**
     * The default state, to be used when a target has no existing state.
     * @type {Text2SpeechState}
     */
    static get DEFAULT_TEXT2SPEECH_STATE () {
        return {
            voiceId: SQUEAK_ID
        };
    }
    
    /**
     * @param {Target} target - collect  state for this target.
     * @returns {Text2SpeechState} the mutable state associated with that target. This will be created if necessary.
     * @private
     */
    _getState (target) {
        let state = target.getCustomState(Scratch3TextClassificationBlocks.STATE_KEY);
        if (!state) {
            state = Clone.simple(Scratch3TextClassificationBlocks.DEFAULT_TEXT2SPEECH_STATE);
            target.setCustomState(Scratch3TextClassificationBlocks.STATE_KEY, state);
        }
        return state;
    }

    /**
     * When a Target is cloned, clone the state.
     * @param {Target} newTarget - the newly created target.
     * @param {Target} [sourceTarget] - the target used as a source for the new clone, if any.
     * @listens Runtime#event:targetWasCreated
     * @private
     */
    _onTargetCreated (newTarget, sourceTarget) {
        if (sourceTarget) {
            const state = sourceTarget.getCustomState(Scratch3TextClassificationBlocks.STATE_KEY);
            if (state) {
                newTarget.setCustomState(Scratch3TextClassificationBlocks.STATE_KEY, Clone.simple(state));
            }
        }
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
            this.firstInstall = false;
            this.predictionState = {};
        }

        // Return extension definition
        return {
            id: 'textClassification',
            name: formatMessage({
                id: 'textClassification.categoryName',
                default: 'Text Classification',
                description: 'Label for the Text Classification extension category'
            }),
            blockIconURI: blockIconURI,
            menuIconURI: menuIconURI,
            //color1, color2, color3
            blocks: [
                {
                    func: 'EDIT_TEXT_MODEL',
                    blockType: BlockType.BUTTON,
                    text: 'Edit Model'
                },
                {
                    func: 'EDIT_TEXT_CLASSIFIER',
                    blockType: BlockType.BUTTON,
                    text: 'Load / Save Model'
                },
                
                {
                    opcode: 'ifTextMatchesClass',
                    text: formatMessage({
                        id: 'textClassification.ifTextMatchesClass',
                        default: '[TEXT] matches [CLASS_NAME] ?',
                        description: 'Conditional that is true when the text matches the text classification model class [CLASS_NAME]'
                    }),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Enter text or answer block'
                        },
                        CLASS_NAME: {
                            type: ArgumentType.STRING,
                            menu: 'model_classes',
                            defaultValue: this.getLabels()[0],
                        }
                    }
                },
                {
                    opcode: 'getModelPrediction',
                    text: formatMessage({
                        id: 'textClassification.getModelPrediction',
                        default: 'predict class for [TEXT]',
                        description: 'Get the class name that the input text matches'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Enter text or answer block'
                        }
                    },
                },
                {
                    opcode: 'getConfidence',
                    text: formatMessage({
                        id: 'textClassification.getConfidence',
                        default: 'get confidence for [TEXT]',
                        description: 'get the confidence for the labeling of a specified text'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Enter text or answer block'
                        }
                    }
                },
                '---',
                {
                    opcode: 'speakText',
                    text: formatMessage({
                        id: 'textClassification.speakText',
                        default: 'speak [TEXT]',
                        description: 'Send text to the speech to text engine'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Hello'
                        }
                    },
                },
                {
                    opcode: 'askSpeechRecognition',
                    text: formatMessage({
                        id: 'textClassification.askSpeechRecognition',
                        default: 'ask [PROMPT] and wait',
                        description: 'Get the class name that the input text matches'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        PROMPT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'How are you?'
                        }
                    },
                },
                {
                    opcode: 'getRecognizedSpeech',
                    text: formatMessage({
                        id: 'textClassification.getRecognizedSpeech',
                        default: 'answer',
                        description: 'Return the results of the speech recognition'
                    }),
                    blockType: BlockType.REPORTER,
                },
                {
                    opcode: 'setVoice',
                    text: formatMessage({
                        id: 'text2speech.setVoiceBlock',
                        default: 'set voice to [VOICE]',
                        description: 'Set the voice for speech synthesis.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        VOICE: {
                            type: ArgumentType.STRING,
                            menu: 'voices',
                            defaultValue: SQUEAK_ID
                        }
                    }
                },
                '---',
                {
                    opcode: 'onHeardSound',
                    text: formatMessage({
                        id: 'textClassification.onHeardSound',
                        default: 'when heard sound > [THRESHOLD]',
                        description: 'Event that triggers when a sound is heard above a threshold'
                    }),
                    blockType: BlockType.HAT,
                    arguments: {
                        THRESHOLD: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10
                        }
                    },
                }
            ],
            menus: {
                voices: {
                    acceptReporters: true,
                    items: this.getVoiceMenu()
                },
                model_classes: {
                    acceptReporters: false,
                    items: 'getLabels'
                }
            }
        };
    }
    
    /**
     * Moves info from the runtime into the classifier, called when a project is loaded
     */    
    loadModelFromRuntime () {
        //console.log("Load model from runtime");
        this.labelList = [];
        this.labelListEmpty = false;
        let textData = this.scratch_vm.modelData.textData;

        for (let label in this.scratch_vm.modelData.textData) {
            if (this.scratch_vm.modelData.textData.hasOwnProperty(label)) {
                let textExamples = textData[label];
                this.newLabel(label);
                this.newExamples(textExamples, label);
            }
        }

        if (this.labelList.length == 0) {
            this.labelList.push('');    //if the label list is empty, fill it with an empty string
            this.labelListEmpty = true;
        }
    }

    /**
     * Return label list for block menus
     * @return {array of strings} an array of the labels for the text model classifier
     */
    getLabels () {
        return this.labelList;
    }

    /**
     * TODO grab text and add it as an example
     * @param {string} args.LABEL the name of the label to add an example to
     */
    textExample (args) {
        console.log("Get text example");
        // TODO grab text
        let text = '';
         if (frame) {
             this.newExamples([text], args.LABEL);
         }
    }

    /**
     * Add new examples to a label
     * @param {array of strings} examples a list of text examples to add to a label
     * @param {string} label the name of the label
     */
    newExamples (text_examples, label) {   //add examples for a label
        console.log("Add examples to label " + label);
        console.log(text_examples);
        if (this.labelListEmpty) {
            // Edit label list accordingly
            this.labelList.splice(this.labelList.indexOf(''), 1);
            this.labelListEmpty = false;
        }
        if (!this.labelList.includes(label)) {
            this.labelList.push(label);
        }
        for (let text_example of text_examples) {
            if (!this.scratch_vm.modelData.textData[label].includes(text_example)) {
                const embeddedexample = this.getembeddedwords(text_example,label,"example");
                this.scratch_vm.modelData.textData[label].push(text_example);
                this.scratch_vm.modelData.classifierData[label].push(text_example);
                this.count++;
            }
        }

    }
    
    /**
     * Add a new label to labelList
     * @param {string} label the name of the label
     */
    newLabel (newLabelName) {   //add the name of a new label
        if (this.labelListEmpty) {
            // Edit label list accordingly
            this.labelList.splice(this.labelList.indexOf(''), 1);
            this.labelListEmpty = false;
        }
        if (!this.labelList.includes(newLabelName)) {
            this.labelList.push(newLabelName);
        }
        
        this.scratch_vm.modelData.textData[newLabelName] = [];
        this.scratch_vm.modelData.classifierData[newLabelName] = [];
        // update drowndown of class names
        //this.scratch_vm.emit("TOOLBOX_EXTENSIONS_NEED_UPDATE");
        this.scratch_vm.requestToolboxExtensionsUpdate();
    }

    /**
     * Rename a label
     * @param {string} oldName the name of the label to change
     * @param {string} newname the new name for the label
     */
    renameLabel (oldName, newName) {
        console.log("Rename a label");

        let data = {...this.classifier.getClassifierDataset()};  //reset the classifier dataset with the renamed label
        if (data[oldName]) {
            data[newName] = data[oldName];
            delete data[oldName];
            this.classifier.setClassifierDataset(data);
        }


        this.scratch_vm.modelData.classifierData[newName] = this.scratch_vm.modelData.classifierData[oldName];  //reset the runtime's model data with the new renamed label (to share with GUI)
        delete this.scratch_vm.modelData.classifierData[oldName];

        this.scratch_vm.modelData.textData[newName] = this.scratch_vm.modelData.textData[oldName];  //reset the runtime's model data with the new renamed label (to share with GUI)
        delete this.scratch_vm.modelData.textData[oldName];

        this.labelList.splice(this.labelList.indexOf(oldName), 1);  //reset label list with the new renamed label
        this.labelList.push(newName);
    }

    /**
     * Delete an example (or all loaded examples, if exampleNum === -1)
     * @param {string} label the name of the label with the example to be removed
     * @param {integer} exampleNum which example, in the array of a label's examples, to remove
     */
    deleteExample (label, exampleNum) {
        console.log("Delete example " + exampleNum + " with label " + label);
        let data = {...this.classifier.getClassifierDataset()};  //reset the classifier dataset with the deleted example
        let labelExamples = data[label].arraySync();
         // Remove label from the runtime's model data (to share with the GUI)
         if (exampleNum === -1) {    //if this is true, delete all the loaded examples
            let numLoadedExamples = this.scratch_vm.modelData.classifierData[label].length - this.scratch_vm.modelData.textData[label].length;   //imageData[label].length is ONLY the length of the NEW examples (not the saved and then loaded ones!)
            this.scratch_vm.modelData.classifierData[label].splice(0, numLoadedExamples);
            labelExamples.splice(0, numLoadedExamples);
         } else {
         this.scratch_vm.modelData.textData[label].splice(exampleNum, 1);
         this.scratch_vm.modelData.classifierData[label].splice(exampleNum - this.scratch_vm.modelData.textData[label].length - 1, 1);
         labelExamples.splice(exampleNum - this.scratch_vm.modelData.textData[label].length - 1, 1);
         }

         if (labelExamples.length > 0) {
            data[label] = tf.tensor(labelExamples);
            this.classifier.setClassifierDataset(data);
        } else {
            this.classifier.clearClass(label);  //if there are no more examples for this label, don't consider it in the classifier anymore (but keep it in labelList and the runtime model data)
        }

    }

    /**
     * Clear all data stored in the classifier and label list
     */
    clearLocal () {
        console.log("Clear local data");
        this.scratch_vm.emit("TOOLBOX_EXTENSIONS_NEED_UPDATE");
        this.labelList = [''];
        this.labelListEmpty = true;
        this.classifier.clearAllClasses();
    }

    /**
     * Clear local label list, but also clear all data stored in the runtime
     */
    clearAll () {
        console.log("Clear all data");
        this.clearLocal();
        // Clear runtime's model data
        
        this.scratch_vm.modelData = {textData: {}, classifierData: {}, nextLabelNumber: 1};
        
    }

    /**
     * Clear all examples with a given label
     * @param {string} args.LABEL the name of the label to remove from the model
     */
    clearAllWithLabel (args) {
        console.log("Get rid of all examples with label " + args.LABEL);
        if (this.labelList.includes(args.LABEL)) {
            if (this.classifier.getClassExampleCount()[args.LABEL] > 0) {
                this.classifier.clearClass(args.LABEL);  //remove label from the classifier
                console.log("number of classes");
                console.log(this.classifier.getNumClasses());
            }
            // Remove label from labelList
            this.labelList.splice(this.labelList.indexOf(args.LABEL), 1);
            // Remove label from the runtime's model data (to share with the GUI)
            delete this.scratch_vm.modelData.classifierData[args.LABEL];  
            delete this.scratch_vm.modelData.textData[args.LABEL];
            // If the label list is now empty, fill it with an empty string
            if (this.labelList.length === 0) {  
                this.labelListEmpty = true;
                this.labelList.push('');
            }
        }
    }
    
    
    /**
     * Detects if the sound from the input mic is louder than a particular threshold
     * @param args.THRESHOLD {integer} the threshold of loudness to trigger on
     * @return {integer} true if the loudness is above the threshold and false if it is not
     */    
    onHeardSound(args) {
        let threshold = args.THRESHOLD;
        
        return this.getLoudness() > threshold;
    }
    
    /**
     * Get the input volume from the mic
     * @return {integer} mic volume at current time
     */
    getLoudness () {
        if (typeof this.scratch_vm.audioEngine === 'undefined') return -1;
        if (this.scratch_vm.currentStepTime === null) return -1;

        // Only measure loudness once per step
        const timeSinceLoudness = this._timer.time() - this._cachedLoudnessTimestamp;
        if (timeSinceLoudness < this.scratch_vm.currentStepTime) {
            return this._cachedLoudness;
        }

        this._cachedLoudnessTimestamp = this._timer.time();
        this._cachedLoudness = this.scratch_vm.audioEngine.getLoudness();
        return this._cachedLoudness;
    }
    
    /**
     * Get the menu of voices for the "set voice" block.
     * @return {array} the text and value for each menu item.
     */
    getVoiceMenu () {
        return Object.keys(this.VOICE_INFO).map(voiceId => ({
            text: this.VOICE_INFO[voiceId].name,
            value: voiceId
        }));
    }
    
    /**
     * Set the voice for speech synthesis for this sprite.
     * @param  {object} args Block arguments
     * @param {object} util Utility object provided by the runtime.
     */
    setVoice (args, util) {
        const state = this._getState(util.target);

        let voice = args.VOICE;

        // If the arg is a dropped number, treat it as a voice index
        let voiceNum = parseInt(voice, 10);
        if (!isNaN(voiceNum)) {
            voiceNum -= 1; // Treat dropped args as one-indexed
            voiceNum = MathUtil.wrapClamp(voiceNum, 0, Object.keys(this.VOICE_INFO).length - 1);
            voice = Object.keys(this.VOICE_INFO)[voiceNum];
        }

        // Only set the voice if the arg is a valid voice id.
        if (Object.keys(this.VOICE_INFO).includes(voice)) {
            state.voiceId = voice;
        }
    }
    
    /**
     * Stop all currently playing speech sounds.
     */
    _stopAllSpeech () {
        this._soundPlayers.forEach(player => {
            player.stop();
        });
    }

    /**
     * Convert the provided text into a sound file and then play the file.
     * @param  {object} args Block arguments
     * @param {object} util Utility object provided by the runtime.
     * @return {Promise} A promise that resolves after playing the sound
     */
    async speakText(args, util) {
        // Cast input to string
        let words = Cast.toString(args.TEXT);
        let locale = 'en-US';

        const state = this._getState(util.target);

        let gender = this.VOICE_INFO[state.voiceId].gender;
        let playbackRate = this.VOICE_INFO[state.voiceId].playbackRate;
        
        // Build up URL
        let path = `${SERVER_HOST}/synth`;
        path += `?locale=${locale}`;
        path += `&gender=${gender}`;
        path += `&text=${encodeURIComponent(words.substring(0, 128))}`;
        // Perform HTTP request to get audio file
        return new Promise(resolve => {
            nets({
                url: path,
                timeout: SERVER_TIMEOUT
            }, (err, res, body) => {
                if (err) {
                    console.warn(err);
                    return resolve();
                }

                if (res.statusCode !== 200) {
                    console.warn(res.statusCode);
                    return resolve();
                }

                // Play the sound
                const sound = {
                    data: {
                        buffer: body.buffer
                    }
                };
                this.scratch_vm.audioEngine.decodeSoundPlayer(sound).then(soundPlayer => {
                    this._soundPlayers.set(soundPlayer.id, soundPlayer);

                    soundPlayer.setPlaybackRate(playbackRate);

                    // Increase the volume
                    const engine = this.scratch_vm.audioEngine;
                    const chain = engine.createEffectChain();
                    chain.set('volume', SPEECH_VOLUME);
                    soundPlayer.connect(chain);

                    soundPlayer.play();
                    soundPlayer.on('stop', () => {
                        this._soundPlayers.delete(soundPlayer.id);
                        resolve();
                    });
                });
            });
        });
    }
    
    recognizeSpeech() {
        let recognition = new webkitSpeechRecognition();
        let self = this;
        
        return new Promise(resolve => {
            recognition.start();
            recognition.onresult = function(event) {
                if (event.results.length > 0) {
                    self._recognizedSpeech = event.results[0][0].transcript;
                }
                resolve();
            };
        });
    }
    
    async askSpeechRecognition(args, util) {
        let prompt = Cast.toString(args.PROMPT);
        args.TEXT = prompt;
        let speakTextResolved = await this.speakText(args, util);
        return this.recognizeSpeech();
     }
    
    getRecognizedSpeech() {
        return this._recognizedSpeech;
    }

    /**
     * A scratch conditional block that checks if a text example is a part of a particular class
     * @param {object} args - the block arguments
     * @param {BlockUtility} util - the block utility
     * @returns {boolean} true if the model matches
     *   reference
     */
     async ifTextMatchesClass (args) {
        const text = args.TEXT;
        const className = args.CLASS_NAME;

        if (className) {
            await this.get_embeddings(text, 'none', 'predict');
            return className == this.predictedLabel;
        }

        return false;
    }

    /**
     * A scratch hat block reporter that returns whether the input text matches the model class.
     * @param {object} args - the block arguments
     * @param {BlockUtility} util - the block utility
     * @returns {string} class name if input text matched, empty string if there's a problem with the model
     */
     async getModelPrediction (args) {
        const text = args.TEXT;
        await this.get_embeddings(text, 'none', 'predict');
        return this.predictedLabel;
    }

    async getConfidence (args) {
        const text = args.TEXT;
        await this.get_embeddings(text, 'none', 'predict');
        return this.confidence;
    }

    /**
     * Calls the method which embeds text as a 2d tensor
     * @param text - the text inputted
     * @param label - this is always "none" when embedding examples
     * @param direction - is either "example" when an example is being inputted or "predict" when a word to be classified is inputted
     */
        async getembeddedwords(text,label,direction) {
            if (!this.labelListEmpty) {
                const embeddedtext = await this.get_embeddings(text,label,direction);
            }
        }

    /**
     * Embeds text and either adds examples to classifier or returns the predicted label
     * Changes text into a 2d tensor
     * @param text - the text inputted
     * @param label - the label to add the example to
     * @param direction - is either "example" when an example is being inputted or "predict" when a word to be classified is inputted
     * @returns if the direction is "predict" returns the predicted label for the text inputted
     */
    // TODO rename this function to better represent what it does
    async get_embeddings (text, label, direction) {
        // translates text from any language to english
        const newText = await this.getTranslate(text, 'en');

        if (!this.labelListEmpty) {
            // before going through with the expensive USE model loading
            //   check to see if we already have an embedding for this input
            let textEmbeddings = this.exampleEmbeddings[newText] || this.lastEmbedding[newText];
            if (!textEmbeddings) {
                let useModel = await use.load();
                textEmbeddings = await useModel.embed(newText);    
            }
            if (direction === "example") {
                await this.classifier.addExample(textEmbeddings, label);

                // save embeddings of examples for later use
                this.exampleEmbeddings[newText] = textEmbeddings;
                return "Inputting to classes";
    
            } else if (direction === "predict") {
                // TODO consider making this value the n-th root of the number of labels e.g. for 5 labels, take the 5th root
                const k = Math.sqrt(this.count);
                let prediction = await this.classifier.predictClass(textEmbeddings, k);
                console.log("get embeddings result:", prediction);
                this.predictedLabel = prediction.label;
                this.confidence = prediction.confidences[prediction.label];
                return [this.predictedLabel, this.confidence];
            }
        } else {
            return "No class inputted";
        }
    }
   /**
     * Exports the labels and examples in the form of a json document with the default name of "classifier-info.json"
     */
      exportClassifier() { //exports classifier as JSON file
        let dataset = this.scratch_vm.modelData.textData;
        let jsonStr = JSON.stringify(dataset);
        //exports json file
        var data = "text/json;charset=utf-8," + encodeURIComponent(jsonStr);
        var a = document.createElement('a');
        a.setAttribute("href", "data:" + data);
        a.setAttribute("download", "classifier-info.json");
        a.click();
      }
   /**
     * Loads the json document which contains labels and examples. Inputs the labels and examples into the classifier
     */
      async loadClassifier() { //loads classifier to project
        var self = this
        var dataset = document.getElementById("imported-classifier").files[0];
        if (dataset !== undefined) {
        fr = new FileReader();
        fr.onload = receivedText;
        fr.readAsText(dataset);
        }
  
      function receivedText(e) { //parses through the json document and adds to the model textData and classifier
        let lines = e.target.result;
        try {
        var newArr = JSON.parse(lines);
        self.clearAll();
        for (let label in newArr) {
            if (newArr.hasOwnProperty(label)) {
                let textExamples = newArr[label];
                self.newLabel(label);
                self.newExamples(textExamples, label);
            }
        }
    } catch (err) {
        console.log("Incorrect document form");
    }
        
      }
    }

    getTranslate (words,language) {
        // Don't remake the request if we already have the value.
        if (this._lastTextTranslated === words &&
            this._lastLangTranslated === language) {
            return this._translateResult;
        }

        const lang = language;

        let urlBase = `${serverURL}translate?language=`;
        urlBase += lang;
        urlBase += '&text=';
        urlBase += encodeURIComponent(words);

        const tempThis = this;
        const translatePromise = new Promise(resolve => {
            nets({
                url: urlBase,
                timeout: serverTimeoutMs
            }, (err, res, body) => {
                if (err) {
                    log.warn(`error fetching translate result! ${res}`);
                    resolve('');
                    return '';
                }
                const translated = JSON.parse(body).result;
                tempThis._translateResult = translated;
                // Cache what we just translated so we don't keep making the
                // same call over and over.
                tempThis._lastTextTranslated = words;
                tempThis._lastLangTranslated = language;
                resolve(translated);
                return translated;
            });

        });
        translatePromise.then(translatedText => translatedText);
        return translatePromise;
    }
     



      
}

module.exports = Scratch3TextClassificationBlocks;
