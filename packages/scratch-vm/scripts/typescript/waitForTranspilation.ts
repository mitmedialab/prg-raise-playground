import { isTsReady } from "./interprocessCoordination";

while (!isTsReady()) {}