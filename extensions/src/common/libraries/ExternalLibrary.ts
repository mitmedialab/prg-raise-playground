import { untilExternalGlobalVariableLoaded } from "$common/utils";

type URL = { url: string };
type Asset = { asset: string };

type LibraryDetails = {
  globalVariableName: string
} & (URL | Asset);

export default abstract class ExternalLibrary<T> {
  private type: T;

  get lib(): Promise<T> {
    const { globalVariableName } = this.details;
    const link = ExternalLibrary.GetLink(this.details);
    return untilExternalGlobalVariableLoaded<T>(link, globalVariableName);
  }

  protected abstract details: LibraryDetails;

  constructor() { }

  private static IsURL = (details: URL | Asset): details is URL => "url" in details;

  private static GetLink = (details: LibraryDetails) => this.IsURL(details)
    ? details.url
    : ExternalLibrary.GetPathToAsset(details.asset);

  private static GetPathToAsset = (asset: string) => `${asset}`;
}