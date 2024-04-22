
export interface IFileLoader {
  // Define the readFileContents function signature
  readFileContents: (
    path: string,
    rubricIdentifier: string
  ) => Promise<string[]>;
}

export interface IRequirementsHolder {
  epic: {
    name: string;
    descriptions: {
      description: string;
      requirements: string[];
    }[];
  };
}

export interface IRequirementCollection{
    epics: string[];
    descriptions: [number, string][];
    requirements: [number, string][]
}