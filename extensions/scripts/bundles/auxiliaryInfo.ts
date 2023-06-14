import { AuxiliaryExtensionInfo, AuxiliaryExtensionInfoParams } from "$common";
import { BundleInfo } from ".";
import { getBlockIconURI } from "scripts/utils/URIs";
import fs from "fs";
import path from "path";
import { extensionBundlesDirectory } from "scripts/utils/fileSystem";

/**
 * Populate the AuxiliaryExtensionInfo file with the given info,
 * so that it can be read in by the extension framework before the extension is loaded
 * @param info 
 * @returns 
 */
export const setAuxiliaryInfoForExtension = (info: BundleInfo) => {
  const update = JSON.stringify(convertToParams(info));
  const current = extensionMap.get(info.id);
  if (current === update) return;
  extensionMap.set(info.id, update);
  write();
}

const convertToParams = ({ menuDetails, directory, id }: BundleInfo): AuxiliaryExtensionInfoParams => {
  const { name, blockColor, menuColor, menuSelectColor } = menuDetails;
  const blockIconURI = getBlockIconURI(menuDetails, directory);
  return [name, id, blockIconURI, blockColor, menuColor, menuSelectColor];
}

const write = () => {
  const dataPerExtension = Array.from(extensionMap.entries())
    .reduce((acc, [id, serialized]) => {
      acc[id] = JSON.parse(serialized);
      return acc;
    }, {});

  const content = `var ${AuxiliaryExtensionInfo} = ${JSON.stringify(dataPerExtension)};`;
  fs.writeFileSync(path.join(extensionBundlesDirectory, `${AuxiliaryExtensionInfo}.js`), content);
}

const extensionMap = new Map<string, string>();