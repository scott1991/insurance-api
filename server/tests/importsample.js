// import fetch from 'node-fetch';
import fs from 'fs';
import readline from 'readline';
import { fileURLToPath } from 'url';
import path from 'path';
const url = 'http://192.168.2.116:3000';

async function addPolicyholdersFromCSV(csvFilePath) {
    const fileStream = fs.createReadStream(csvFilePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let isFirstLine = true;

    for await (const line of rl) {
        if (isFirstLine) {
            isFirstLine = false;
            continue;
        }

        const [code, name, registration_date, introducer_code] = line.split(',');

        const requestBody = {
            code,
            name,
            registration_date,
            introducer_code: introducer_code || undefined
        };

        try {
            const response = await fetch(`${url}/api/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            const responseData = await response.json();
            console.log('Added:', responseData);
        } catch (error) {
            console.error('Error adding policyholder:', error);
        }
    }
}

const csvFilePath = './policyholders.csv'; 
addPolicyholdersFromCSV(csvFilePath);
