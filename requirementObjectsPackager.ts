import { IDescriptionsHolder, IRequirementCollection, IRequirementsHolder } from "./interfaces";

export function breakStrings(monolithicData: string[]): IRequirementsHolder[]{
    let requirementNumber = -1;
    const requirements: IRequirementsHolder[] = [] 
    for (let r of monolithicData){
        requirementNumber++;
        let data = r.split(/\r?\n|\r/);
        const requirementData = data.filter(x => x.trim() !== ""); // remove empty lines
        let descriptionNumber = 0;
        for (let x = 0; x < requirementData.length; x++) {
          // create the RequirementsHolder object for the epic
          if (x === 0) {
            createAndStoreRequirementHolder(requirementData, requirements);
            // TODO: too many description holder objects are being created for some epics and not enough for other epics
            // set the description name for the first collection of requirements in the epic or create a new one
          } else if (!requirementData[x].startsWith("-")) {
            if (x === 1) {
              addDescriptionNameToInitialDescriptionHolder(
                requirementData,
                requirementNumber,
                requirements
              );
            } else {
              descriptionNumber++;
              addDescriptionHolderToRequirementHolder(
                requirementData,
                x,
                requirementNumber,
                requirements
              );
            }
          } else if (requirementData[x].startsWith("-")) {
            addRequirementToDescriptionHolder(
              requirementData,
              x,
              requirementNumber,
              descriptionNumber,
              requirements
            );
          } else {
            throw new Error("Unrecognized data in monolithic data array");
          }
        }
    }
    return requirements;
}

function createAndStoreRequirementHolder(data: string[], requirements: IRequirementsHolder[]){
    let descriptionHolder: IDescriptionsHolder = {
      description: "",
      requirements: [],
    };
    let requirement: IRequirementsHolder = {
      epic: {
        name: data[0],
        descriptions: [descriptionHolder],
      },
    };
    requirements.push(requirement);
}

function addDescriptionNameToInitialDescriptionHolder(data: string[], requirementIndex: number, requirements: IRequirementsHolder[]){
  const requirementHolder = requirements[requirementIndex];
  requirementHolder.epic.descriptions[0].description = data[1];
}

function addDescriptionHolderToRequirementHolder(data: string[], iterationIndex: number, requirementIndex: number, requirements: IRequirementsHolder[]){
  const requirementHolder = requirements[requirementIndex];
  const descriptionHolder: IDescriptionsHolder = {
    description: data[iterationIndex],
    requirements: []
  }
  requirementHolder.epic.descriptions.push(descriptionHolder);
}

function addRequirementToDescriptionHolder(data: string[], iterationIndex: number, requirementIndex: number, descriptionIndex: number, requirements: IRequirementsHolder[]){
  const requirementHolder = requirements[requirementIndex];
  const descriptionHolder = requirementHolder.epic.descriptions[descriptionIndex];
  descriptionHolder.requirements.push(data[iterationIndex]);
}
