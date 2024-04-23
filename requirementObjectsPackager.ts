import { IDescriptionsHolder, IRequirementCollection, IRequirementsHolder } from "./interfaces";

export function breakStrings(monolithicData: string[]): IRequirementCollection{
    let index = 0;
    const epics: string[] = [];
    const descriptions: [number, string][] = [];
    const requirements: [number, number, string][] = [];
    for (let r of monolithicData){
        let data = r.split(/\r?\n|\r/);
        data = data.filter(x => x !== "");
        let descriptionId = -1;
        for (let x = 0; x < data.length; x++){
            if(x === 0){
                epics.push(data[x]);
            } else if (!data[x].startsWith("-")){
                descriptions.push([index, data[x]]);
                descriptionId++;
            } else if (data[x].startsWith("-")){
                requirements.push([index, descriptionId, data[x]]);
            } else {
                throw new Error("Unrecognized data in monolithic data array");
            }
        }
        index++;
    }
    return {epics, descriptions, requirements};
}

export function organizeRequirements(requirementsCollection: IRequirementCollection): IRequirementsHolder[]{
    const requirementsHolder: IRequirementsHolder[] = [];

    const { epics, descriptions, requirements } = requirementsCollection;

    epics.forEach((epicName) => {
      const holder: IRequirementsHolder = {
        epic: {
          name: epicName,
          descriptions: [],
        },
      };
      requirementsHolder.push(holder);
    });

    descriptions.forEach((descriptionData) => {
      let [epicId, description] = descriptionData;
      requirementsHolder.forEach((requirement, index) => {
        if (index === epicId){
          let d: IDescriptionsHolder = {
            description: description,
            requirements: []
          }
        requirement.epic.descriptions.push(d);
        }
      });
    });

    requirements.forEach((requirementData) => {
      let [epicId, descriptionId, r] = requirementData;
      requirementsHolder.forEach((requirement, requirementIndex) => {
        if(requirementIndex === epicId){
          requirement.epic.descriptions.forEach((descriptionHolder, descriptionHolderIndex) => {
            if(descriptionHolderIndex === descriptionId){
              descriptionHolder.requirements.push(r.replace("- ",""));
            }
          });
        }
      });
    });

    return requirementsHolder;
}
