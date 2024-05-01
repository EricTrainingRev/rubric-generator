import { error } from "console";
import { IRequirementsHolder } from "./interfaces";
import fileLoader from "./fileLoader";
import requirementsExtractor from "./requirementsExtractor";
import { breakStrings } from "./requirementObjectsPackager";
import { addRequirementDataToHTML } from "./webPageCrafter";
import express from "express";

// get project requirement file when executing application
const projectRequirementsPath: string = process.argv[2];
// get identifier for rubric requirements after path data: defaults to double hash symbols and a single space
const rubricIdentifier: string = process.argv.length === 4 ? process.argv[3] : "## ";
// save project requirement document content in this array to filter later
let projectRequirementsContent: string[] = [];
// save filtered requirements for rubric in this array
let filteredRequirements: string[] = [];
// save requirement data in this array
let requirementData: IRequirementsHolder[] = [];
// webpage data to return to user
let webpageWithRequirements: string = "";
// express server
const app = express();
// express server port
const port = 3000;

try {
    // wrapping code in self invoking function so we can use async/await
    (async () => {
      // read project requirement file and save sections to array
      projectRequirementsContent = await fileLoader.readFileContents(projectRequirementsPath, rubricIdentifier);
      // check that the array has content
      if (projectRequirementsContent.length === 0)throw error(`No content found for project requirements file in path ${projectRequirementsPath}`);
      
      // filter out non-requirements
      filteredRequirements = requirementsExtractor(projectRequirementsContent, rubricIdentifier);
      
      // break requirements monolithic text into epics, descriptions, and requirements arrays
      requirementData = breakStrings(filteredRequirements);

      // add requirementData to html template
      webpageWithRequirements = addRequirementDataToHTML(requirementData);

      // set up express rubric generator route
      app.get("/rubric", (req, res) => {
        res.send(webpageWithRequirements);
      });

      // start express server
      app.listen(port, () => {
        console.log(`Server started: serving rubric at http://localhost:${port}/rubric`);
      });

    })();  
} catch (error) {
  console.log(error);
}

