import { IRequirementsHolder } from "./interfaces"; 


const template = 
`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>P0 Scorecard</title>
    <style>
        table {
            box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.2);
        }

        tr {
            box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.1);
        }

        td:first-child {
            width: 602.28px;
            height: 22px;
        }

        td {
            text-align: center;
            box-shadow: 0px 0px 2px 1px rgba(0, 0, 0, 0.1);
            width: 91.3px;
            height: 22px;
        }

        #businessRequirementsTable {
            background-color: #d39494;
        }

        #softwareRequirementsTable {
            background-color: #8dbe8d;
        }

        #developmentRequirementsTable {
            background-color: #9c9cce;
        }
    </style>
</head>
<body>
    <div id="scoreDisplay"><!--data will auto populate--></div>
</body>
<script>

    /*
     *   Array data taken from Pep Supplemental Project document in P0-starter repo, would be ideal 
     *   to read directly from the document
     */

    const requirements = ?;
    // [
    //     {
    //         epic:{
    //             name: "Business Requirements",
    //             descriptions: [
    //                 {
    //                     description: "description of requirement collection", 
    //                     requirements: ["requirement one", "requirement two"]
    //                 },
    //             ]
    //         }
    //     },
    //     {
    //         epic:{
    //             name: "Software Requirements",
    //             descriptions: [
    //                 {
    //                     description: null, 
    //                     requirements: ["requirement one"]
    //                 },
    //                 {
    //                     description: "more description", 
    //                     requirements: ["requirement one"]
    //                 }
    //             ]
    //         }
    //     },
    // ];

    let score = 0;
    let possiblePoints = 0;
    setupTables();
    setPossiblePoints();
    displayPossiblePoints();
    addOnCheckboxChange();

    function setupTables() {
        requirements.forEach((dataCollection, index) => {
            const div = document.createElement("div");
            div.id = \`\${dataCollection.epic.name.replace(/ /g, "")}Container\`;
            const h1 = document.createElement("h1");
            h1.textContent = dataCollection.epic.name;
            div.appendChild(h1);
            for(let descriptionData of dataCollection.epic.descriptions){
                const p = document.createElement("p");
                if(descriptionData.description){
                    p.textContent = descriptionData.description;
                    div.appendChild(p);
                }
                const table = document.createElement("table");
                table.id = \`\${dataCollection.epic.name.replace(/ /g, "")}Table\`;
                div.appendChild(table);
                const headerRow = table.insertRow();
                const headerCellRequirement = headerRow.insertCell();
                headerCellRequirement.textContent = "Requirement";
                const headerCellNotMet = headerRow.insertCell();
                headerCellNotMet.textContent = "Not Met";
                const headerCellPartiallyMet = headerRow.insertCell();
                headerCellPartiallyMet.textContent = "Partially Met";
                const headerCellMostlyMet = headerRow.insertCell();
                headerCellMostlyMet.textContent = "Mostly Met";
                const headerCellMet = headerRow.insertCell();
                headerCellMet.textContent = "Met";
                console.log(descriptionData.requirements);
                for (let r of descriptionData.requirements){
                    const row = table.insertRow();
                    const requirementCell = row.insertCell();
                    requirementCell.textContent = r;
                    for (let j = 1; j <= 4; j++) {
                        const checkboxCell = row.insertCell();
                        checkboxCell.innerHTML = \`<input type="checkbox">\`;
                    }
                }

            }
            document.body.appendChild(div);
        });
    }

    function setPossiblePoints() {
        let count = 0;
        const tables = document.getElementsByTagName("table");
        for (let i = 0; i < tables.length; i++) {
            const table = tables[i];
            const rows = table.getElementsByTagName("tr");
            for (let j = 0; j < rows.length; j++) {
                const row = rows[j];
                if (row.getElementsByTagName("th").length === 0) {
                    count++;
                }
            }
        }
        possiblePoints = count * 3;
    }

    function displayPossiblePoints() {
        const scoreDisplay = document.getElementById("scoreDisplay");
        scoreDisplay.innerHTML = '';
        const header = document.createElement("h2");
        header.textContent = \`Points: \${score}/\${possiblePoints}\`;
        scoreDisplay.appendChild(header);
    }

    function updateScore(event) {
        const checkbox = event.target;
        const tdElements = checkbox.parentNode.parentNode.getElementsByTagName('td');
        const position = Array.from(tdElements).indexOf(checkbox.parentNode) - 1;
        if (checkbox.checked) {
            score += position;
        } else {
            score -= position;
        }
        displayPossiblePoints();
    }

    function addOnCheckboxChange() {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', updateScore);
        });
    }
</script>
</html>`;

export function addRequirementDataToHTML(requirementData: IRequirementsHolder[]) {
    return template.replace("?", JSON.stringify(requirementData));
}