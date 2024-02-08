document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('get-nominations').addEventListener('click', getNominations);
    document.getElementById('get-nominees').addEventListener('click', getNominees);
    document.getElementById('clear-input').addEventListener('click', clearInput);
    document.getElementById('clear-output').addEventListener('click', clearOutput);
});
let yearValue, categoryValue, nomineeValue, infoValue, nomInfoValue, timesValue, wonValue;

function updateInputs(){
     yearValue = document.getElementById('inp-year').value;
     categoryValue = document.getElementById('inp-category').value;
     nomineeValue = document.getElementById('inp-nominee').value;
     infoValue = document.getElementById('inp-info').value;
     nomInfoValue = document.getElementById('inp-nomInfo').value;
     timesValue = document.getElementById('inp-times').value;
     wonValue = document.getElementById('won').value;
}


function getNominations() {
    updateInputs();

    if((nomineeValue !== "" || infoValue !== "") && nomInfoValue !== ""){
        return(alert("You cant enter value to Nominee/Info while entering value one of them already."))
    }
    if((nomineeValue === "" || infoValue === "") && nomInfoValue !== ""){
        infoValue = nomInfoValue;
        nomineeValue = nomInfoValue;
    }

    const url = `http://localhost:8080/getNominations?
    Year=${encodeURIComponent(yearValue)}
    &Category=${encodeURIComponent(categoryValue)}
    &Nominee=${encodeURIComponent(nomineeValue)}
    &Info=${encodeURIComponent(infoValue)}
    &Won=${encodeURIComponent(wonValue)}`;
    fetch(url)
        .then((response)=>{

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            let output = "<table>";

            output +="<tr>";
            for (const header of ["Year", "Category", "Nominee", "Info","Won"]){
                output += `<th>${header}</th>`
            }
            for (const nomination of data) {
                output += "<tr>";
                for (const key of ["Year", "Category", "Nominee", "Info", "Won"]) {
                    output += `<td>${nomination[key]}</td>`;
                }
                output += "</tr>";
            }
            output += "</table>";
            document.getElementById("output").innerHTML = output;
        })
}

// Fix this part !!
function getNominees() {
    updateInputs();
    const url = `http://localhost:8080/getNominees?&Nominee=${encodeURIComponent(nomineeValue)}
    &Times=${encodeURIComponent(timesValue)}`;

    fetch(url)
        .then((response)=> response.json())
        .then((data) => {
            let output = "<table>";

            output +="<tr>";
            for (const header of ["Nominee", "Times"]){
                output += `<th>${header}</th>`
            }
            for (const nominee of data) {
                output += "<tr>";
                for (const key of ["Nominee", "Times"]) {
                    output += `<td>${nominee[key]}</td>`;
                }
                output += "</tr>";
            }
            output += "</table>";
            document.getElementById("output").innerHTML = output;
        })
}

function clearInput() {
    const inputFields = document.querySelectorAll('input');

    // Loop through each input field and reset its value
    inputFields.forEach(input => {
        if (input.type !== 'button') {
            input.value = ''; // Reset the value to an empty string
        }
    });
}

function clearOutput() {
    document.getElementById("output").innerHTML ="";
}