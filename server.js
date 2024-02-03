const fastify = require("fastify")();
const fs = require('fs/promises');
const path = require ("path")
const fastifyCors = require("@fastify/cors");

fastify.register(fastifyCors, {
    origin: 'http://localhost:63343'
});

fastify.get('/getNominations', async (req, res) => {
    try {
        const nominationsData = await readJSONFile(); // Read data from the JSON file
         // Filter data based on query parameters and return the filtered data as JSON
        return filterNominations(req.query, nominationsData);
    } catch (error) {
        console.error(error);
        res.code(500).send({ error: 'Internal Server Error' });
    }
});
fastify.get('/getNominees', async (req,res) => {
    try {
        const nomineeData = await readJSONFile(); // Read data from the JSON file
        // Filter data based on query parameters and return the filtered data as JSON
        return filterNominees(req.query, nomineeData);
    } catch (error) {
        console.error(error);
        res.code(500).send({ error: 'Internal Server Error' });
    }
})

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
    const { Year, Category, Nominee, Info, Won } = query;

    // Implement your specific filtering logic based on input values
       let filteredData = nominationsData;

    if (Year !== undefined) {
        filteredData = filteredData.filter(nomination => nomination.Year.toLowerCase().includes(Year.toLowerCase().trim()));
        console.log("Year is defined")
    }
    if (Category !== undefined) {
        filteredData = filteredData.filter(nomination => nomination.Category.toLowerCase().includes(Category.toLowerCase().trim()));
        console.log("Category is defined")
    }
    if (Nominee !== undefined) {
        filteredData = filteredData.filter(nomination => nomination.Nominee.toLowerCase().includes(Nominee.toLowerCase().trim()));
        console.log("Nominee is defined")
    }
    // if (Info !== undefined) {
    //     filteredData = filteredData.filter(nomination => nomination.Info.toLowerCase().includes(Info.toLowerCase().trim()));
    //     console.log("Info is defined")
    // }
    if (Won !== undefined) {
        filteredData = filteredData.filter(nomination => nomination.Won.toLowerCase().includes(Won.toLowerCase().trim()));
        console.log("Won is defined")
    }
   console.log(filteredData) // Debugging the output JSON
   return filteredData;
}




function filterNominees(query,nomineeData) {
    const {nominee, times} = query

    const filteredData = nomineeData.filter((item) => {
        return (
            (!nominee || item.Nominee.toLowerCase().includes(nominee.toLowerCase().trim())) &&
            (!times || item.Times)
        );
    });
    return filteredData;
}



const PORT = 8080;

fastify.listen(PORT, '0.0.0.0', (err) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server is running on port ${PORT}`);
});