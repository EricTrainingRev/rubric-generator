
function filterStrings(strings: string[], indicator: string): string[] {
    // filter out strings that do not start with the indicator
    // may want to make this check more robust in future, currently checks against first
    // character of the rubric indicator, probably will miss some edge cases
    return strings.filter((str) => !str.startsWith(indicator[0]));
}

export default filterStrings;