const { randomInt } = require('crypto');
const jsonfile = require('jsonfile');
const moment = require('moment');
const simpleGit = require('simple-git');

const FILE_PATH = './email.py';  // Path to the file you're committing

const func = async function() {
    let y = 175;
    
    // Start from July 3, 2024, and loop through to July 28, 2024 (every day)
    const startDate = moment('2024-07-03');  // Starting date (July 3, 2024)
    const endDate = moment('2024-07-28');    // Ending date (July 28, 2024)

    let currentDate = startDate.clone();  // Use a variable to track the current commit date

    // Loop until the current date is on or before the end date
    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
        let x = randomInt(6);  // Random number of commits for each iteration

        for (let i = 0; i < x; i++) {
            var DATE = currentDate.format();  // Get the formatted date for commit
            
            // Prepare the data to write to the JSON file (optional)
            var data = {
                date: DATE,
                radu: x,
            };
            
            // Wait for the file to be written asynchronously (optional if you're writing data.json)
            await jsonfile.writeFile(FILE_PATH, data, { spaces: 2, EOL: '\n' });
            
            // Make the Git commit with the specified commit message and file path 'email.py'
            await simpleGit().add([FILE_PATH])
                .commit('Email-classifier', { '--date': DATE })  // Commit with the date
                .then(() => {
                    console.log("Commit made for date: " + DATE);  // Log the commit date
                }).catch((err) => {
                    console.error("Git commit failed: ", err);
                });
            
            // Override the previous commit (i.e., amend it) with the new changes
            await simpleGit().commit('Email-classifier', { '--amend': null }).then(() => {
                console.log("Previous commit amended.");
            }).catch((err) => {
                console.error("Failed to amend the previous commit: ", err);
            });
        }

        // Increment the date by 1 day for the next commit
        currentDate.add(1, 'days');
    }
}

func();
