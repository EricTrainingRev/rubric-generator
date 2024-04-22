import { IRequirementCollection, IRequirementsHolder } from "./interfaces";

export function breakStrings(monolithicData: string[]): IRequirementCollection{
    let index = 0;
    const epics: string[] = [];
    const descriptions: [number, string][] = [];
    const requirements: [number, string][] = [];
    for (let r of monolithicData){
        let data = r.split(/\r?\n|\r/);
        data = data.filter(x => x !== "");
        for (let x = 0; x < data.length; x++){
            if(x === 0){
                epics.push(data[x]);
            } else if (!data[x].startsWith("-")){
                descriptions.push([index, data[x]]);
            } else if (data[x].startsWith("-")){
                requirements.push([index, data[x]]);
            } else {
                throw new Error("Unrecognized data in monolithic data array");
            }
        }
        index++;
    }
    console.log({ epics, descriptions, requirements });
    return {epics, descriptions, requirements};
}

export function organizeRequirements(requirementsCollection: IRequirementCollection): IRequirementsHolder[]{
    const requirementsHolders: IRequirementsHolder[] = [];

    const { epics, descriptions, requirements } = requirementsCollection;

    epics.forEach((epicName, index) => {
      const holder: IRequirementsHolder = {
        epic: {
          name: epicName,
          descriptions: [],
        },
      };
      for (let i = index; i < descriptions.length; i++) {
        const [descriptionIndex, description] = descriptions[i];
        if (descriptionIndex === index) {
          holder.epic.descriptions.push({ description, requirements: [] });
        } else {
          break;
        }
      }
        for (let i = index; i < requirements.length; i++) {
          const [requirementIndex, requirement] = requirements[i];
          if (requirementIndex === index) {
            holder.epic.descriptions[index].requirements.push(requirement.replace("- ",""));
          } else {
            break;
          }
        }
      requirementsHolders.push(holder);
    });

    return requirementsHolders;

}
