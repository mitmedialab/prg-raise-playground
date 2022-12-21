const constructors = new Map();
const auxiliarObjects = new Map();

export const tryInitExtension = (extension) => {
  const extensionInit = "internal_init";
  if (extensionInit in extension) extension[extensionInit]();
}

/**
 * 
 * @param {{timeout: boolean, arg: T, test: T}} conditionObj 
 * @param {*} timeout 
 * @param {*} updateFrequency 
 * @returns 
 */
const waitForCondition = async (conditionObj, timeout = 3000, updateFrequency = 100) => {
  const start_time = new Date().getTime()
  while (true) {
      if (conditionObj.arg == conditionObj.test) return conditionObj.timeout = false;
      if (new Date().getTime() > start_time + timeout) return conditionObj.timeout = true;
      await new Promise(resolve => setTimeout(resolve, updateFrequency));
  }
}

/**
* 
* @param {string} endpoint 
* @param {() => void} onLoad 
* @param {() => void} onError 
*/
const importStaticScript = async(endpoint, onLoad, onError) => {
  var scriptTag = document.createElement('script');
  scriptTag.src = `${location.href}/static/${endpoint}`;
  let condition = { test: true, arg: false, timeout: false };
  scriptTag.onload = () => {
      onLoad();
      condition.arg = true;
  };
  scriptTag.onerror = () => {
      onError();
      throw new Error(`Error loading endpoint: ${endpoint}`)
  };        
  document.body.appendChild(scriptTag);
  await waitForCondition(condition);
  if (condition.timeout) throw new Error(`Timed out loading endpoint: ${endpoint}`)
}

const tryImportExtensionBundle = async (id, onLoad, onError, error = false) => {
  try {
      await importStaticScript(`extension-bundles/${id}.js`, onLoad, onError);
      return true;
  }
  catch(e) {
      error ? console.error(e) : console.log(e);
      return false;
  }
}

export const tryGetExtensionConstructorFromBundle = async (id) => {
  if (constructors.has(id)) return constructors.get(id);

  const success = await tryImportExtensionBundle(id, 
    () => {
      const bundle = window[id];
      const {Extension, ...UI} = bundle;
      constructors.set(id, Extension);
      auxiliarObjects.set(id, UI);
    }, 
    () => {
      console.log(`Unable to load bundle for ${id}`);
  });
  return success ? constructors.get(id) : undefined;
}

export const tryGetAuxiliaryObjectFromLoadedBundle = (id, name) => {
  if (!auxiliarObjects.has(id)){
    console.error("Tried to access auxiliar constructor of an extension bundle that wasn't already loaded.");
    return undefined;
  } 

  const auxiliarContainer = auxiliarObjects.get(id);

  if(!(name in auxiliarContainer)) {
    console.error(`The requested object '${name}' was not loaded with extension ${id}`);
    return undefined;
  }

  return auxiliarContainer[name];
}