const tryInitExtension = (extension) => {
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
      await importStaticScript(`${id}/bundle.js`, onLoad, onError);
      return true;
  }
  catch(e) {
      error ? console.error(e) : console.log(e);
      return false;
  }
}

export const tryLoadExtensionFromBundle = async (runtime, id, onLoad) => {
  const success = await tryImportExtensionBundle(id, 
    () => {
      const bundle = window[id];
      const {Extension, ...UI} = bundle;

      console.log(UI);

      const extensionInstance = new Extension(runtime);
      tryInitExtension(extensionInstance); 
      onLoad(extensionInstance);
    }, 
    () => {
      console.log(`Unable to load bundle for ${id}`);
  });
  return success;
}