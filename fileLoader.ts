import {promises as fs} from "fs";
import { IFileLoader } from "./interfaces";

// Create the fileLoader object
const fileLoader: IFileLoader = {
  async readFileContents(path: string, rubricIdentifier: string): Promise<string[]> {
    // using async/await to read the file contents would not parse error messages correctly
    // so we are using a promise directly for the time being
    return fs
      .readFile(path, "utf8")
      // Split the file contents by the "## " separator, may need to change in future
      .then((data) => data.split(rubricIdentifier))
      .catch((error) => {
        return Promise.reject(error);
      });
  },
};

// Export the fileLoader object
export default fileLoader;