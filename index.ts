import { error } from "console";
import { IRequirementCollection, IRequirementsHolder } from "./interfaces";
import fileLoader from "./fileLoader";
import requirementsExtractor from "./requirementsExtractor";
import {breakStrings, organizeRequirements} from "./requirementObjectsPackager";

// get project requirement file when executing application
const projectRequirementsPath: string = process.argv[2];
// get identifier for rubric requirements after path data: defaults to double hash symbols and a single space
const rubricIdentifier: string = process.argv.hasOwnProperty("3") ? process.argv[3] : "## ";
// save project requirement document content in this array to filter later
let projectRequirementsContent: string[] = [];
// save filtered requirements for rubric in this array
let filteredRequirements: string[] = [];
// save broken-down requirements in this array
let brokenDownRequirements: IRequirementCollection = {epics: [], descriptions: [], requirements: []};
// save requirement data in this array
let requirementData: IRequirementsHolder[] = [];

try {
    // wrapping code in self invoking function so we can use async/await
    (async () => {
      // read project requirement file and save sections to array
      projectRequirementsContent = await fileLoader.readFileContents(projectRequirementsPath, rubricIdentifier);
      // check that the array has content
      if (projectRequirementsContent.length === 0)throw error(`No content found for project requirements file in path ${projectRequirementsPath}`);

      // filter out requirements
      filteredRequirements = requirementsExtractor(projectRequirementsContent, rubricIdentifier);
      
      // break requirements into epic, description, and requirement arrays
      brokenDownRequirements = breakStrings(filteredRequirements);

      // save requirement data into requirementData array
      requirementData = organizeRequirements(brokenDownRequirements);

      // TODO: craft html content with requirement data and return it to user

    })();  
} catch (error) {
  console.log(error);
}

