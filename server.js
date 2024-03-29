//const fastify = require("fastify")();
const express = require("express");
const fs = require('fs/promises');
const path = require ("path")
const cors = require("cors")
//const fastifyCors = require("@fastify/cors");


const app = express();
const PORT = 8080;

app.use(cors({
    origin: 'http://localhost:63342'
}));
// fastify.register(fastifyCors, {
//     origin: 'http://localhost:63343'
// });



// fastify.get('/getNominations', async (req, res) => {
//     try {
//         const nominationsData = await readJSONFile(); // Read data from the JSON file
//          // Filter data based on query parameters and return the filtered data as JSON
//         return filterNominations(req.query, nominationsData);
//     } catch (error) {
//         console.error(error);
//         res.code(500).send({ error: 'Internal Server Error' });
//     }
// });
// fastify.get('/getNominees', async (req,res) => {
//     try {
//         const nomineeData = await readJSONFile(); // Read data from the JSON file
//         // Filter data based on query parameters and return the filtered data as JSON
//         return filterNominees(req.query, nomineeData);
//     } catch (error) {
//         console.error(error);
//         res.code(500).send({ error: 'Internal Server Error' });
//     }
// })
app.get('/getNominations', async (req, res) => {
    try {
        const nominationsData = await readJSONFile();
        const filteredData = filterNominations(req.query, nominationsData);
        res.json(filteredData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/getNominees', async (req, res) => {
    try {
        const nomineeData = await readJSONFile();
        const filteredData = filterNominees(req.query, nomineeData);
        res.json(filteredData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

async function readJSONFile() {
    try {
        const jsonFilePath = path.join(__dirname, "oscars.json");
        const data = await fs.readFile(jsonFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(error);
        throw new Error('Error reading nominations file');
    }
}
function filterNominations(query, nominationsData) {
    // Implement filtering logic based on HTML inputs (query parameters)
    const {Year, Category, Nominee, Info, Won } = query;
    console.log(Year)
    console.log(query)
    // Implement your specific filtering logic based on input values
       let filteredData = nominationsData;
     console.log("Year in Server:: " + Year)
    // Year query is coming undefined solve it
    if (Year) {
        filteredData = filteredData.filter(nomination => nomination.Year.toLowerCase().includes(Year.toLowerCase().trim()));
        console.log("Year is defined")
    }
    if (Category) {
        filteredData = filteredData.filter(nomination => nomination.Category.toLowerCase().includes(Category.toLowerCase().trim()));
        console.log("Category is defined")
    }
    if (Nominee) {
        filteredData = filteredData.filter(nomination => nomination.Nominee.toLowerCase().includes(Nominee.toLowerCase().trim()));
        console.log("Nominee is defined")
    }
    // Solve the lower case problem in Info
    if (Info) {
        filteredData = filteredData.filter(nomination => {
            if (nomination.Info !== undefined && nomination.Info !== null && Array.isArray(nomination.Info)) {
                // Handle array case, you might want to customize this based on your requirements
                return nomination.Info.some(infoItem => infoItem.toLowerCase().includes(Info.trim()));
            } else if (nomination.Info !== undefined && nomination.Info !== null) {
                // Handle string case
                return nomination.Info.toLowerCase().includes(Info.trim());
            }
            return false; // If Info is undefined, null, or an em
        });
        console.log("Info is defined")
    }
    if (Won && (Won === "yes" || Won === "no")){
        filteredData = filteredData.filter(nomination => nomination.Won.toLowerCase().includes(Won.toLowerCase().trim()));
        console.log("Won is defined")
    }
   // console.log(filteredData) // Debugging the output JSON
   return filteredData;
}



// Finish this part ....
function filterNominees(query,nomineeData) {
    const {Nominee, Times} = query
    const wonCounts = {};
    const nomineeSet = new Set();

    // Filtering Actors,Actress and Supports
    const personFilteredData = nomineeData.filter(nomination => nomination.Category.includes("Actor") || nomination.Category.includes("Actress") )

    personFilteredData.forEach(nomination => {
        const nomineeName = nomination.Nominee.trim();

        //Initialize count if the nominee is encountered for the first time
        if (!wonCounts[nomineeName]) {
            wonCounts[nomineeName] = 0;
        }

        //Increment the won count for the nominee
        wonCounts[nomineeName]++;
        nomineeSet.add(nomineeName);
    });

    const mappedData = Array.from(nomineeSet).map(nomination => ({
        Nominee: nomination,
        Times: wonCounts[nomination]
    }));

    let filteredData = mappedData;


    if (!Times || Times === "") {
        filteredData = filteredData.filter(nomination => {
            if (Nominee && Nominee !== "") {
                return nomination.Nominee.toLowerCase().includes(Nominee.toLowerCase().trim());
            }
            return true;
        });
        //filteredData.sort((a, b) => b.Times - a.Times);
        //filteredData = filteredData.filter(nomination => wonCounts[nomination.Nominee] !== undefined || wonCounts[nomination.Nominee] !== "");
        filteredData.sort((a, b) => wonCounts[b.Nominee] - wonCounts[a.Nominee]);
    }
    else {
        filteredData = filteredData.filter(nomination =>
            nomination.Nominee.toLowerCase().includes(Nominee.toLowerCase().trim()) &&
            nomination.Times === parseInt(Times, 10)
        );
        // filteredData = filteredData.filter(nomination => nomination.Nominee.toLowerCase().includes(Nominee.toLowerCase().trim()));
        // filteredData = filteredData.filter(nomination => wonCounts[nomination.Nominee] === Times);
    }
    console.log(filteredData)
    return filteredData;

}


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// fastify.listen(PORT, '0.0.0.0', (err) => {
//     if (err) {
//         console.error(err);
//         process.exit(1);
//     }
//     console.log(`Server is running on port ${PORT}`);
// });