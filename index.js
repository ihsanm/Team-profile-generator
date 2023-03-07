const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./src/page-template.js");

// array that holds the team
let team = [];

function start () {

    // function to handle generating manager - first bc we need a manager
    function createManager() {
        inquirer.prompt([
            {
              type: "input",
              name: "managerName",
              message: "What is the team manager's name?",
              validate: answer => {
                if (answer !== "") {
                  return true;
                }
                return "Please enter at least one character.";
              }
            },
            {
                type: "input",
                name: "managerId",
                message: "What is your managers Id?",
                validate: answer => {
                    if (answer !== "") {
                      return true;
                    }
                    return "Please enter at least one character.";
                }
            },
            {
                type: "input",
                name: "managerEmail",
                message: "What is your managers email?",
                validate: answer => {
                    if (answer !== "") {
                      return true;
                    }
                    return "Please enter at least one character.";
                }
            },
            {
                type: "input",
                name: "managerOfficeNumber",
                message: "What is your managers office number?",
                validate: answer => {
                    if (answer !== "") {
                      return true;
                    }
                    return "Please enter at least one character.";
                }
            },
            /* {ask for id},
              {ask for email},
              {ask for office number}
             */
          ]).then(answers => {
            const manager = new Manager(answers.managerName, answers.managerId, answers.managerEmail, answers.managerOfficeNumber);
            // push to team array
            team.push(manager);
            // call the next function that will ask what type of employee will be created next
            createTeam();
          })
    }

    // function that asks what type of employee they would like to create next
    function createTeam(){
        // similar setup to what we have listed above
        inquirer.prompt([
            // question asking what we should make next
                // choices(engineer, intern, I dont want to add anything else)
                {
                    type: "checkbox",
                    name: "internOrengineer",
                    message: "do you want to choose an engineer or an intern?",
                    choices: ["intern","engineer","I don't want to add anything else"]
                }
        ]).then(userChoice => {
            /* conditional that decides which of the below functions to call
                based on userChoice. 
                
                - If none of the choices (engineer or employee) have been chosen default to buildTeam()
               
            */
           
           if (userChoice.internOrengineer == "intern"){
            return createIntern();
           } else if (userChoice.internOrengineer == "engineer"){
            return createEngineer();
           } else {
            return buildTeam();
            
           };
        })
    }

    // function to handle generating engineer
    function createEngineer(){
        inquirer.prompt([
            {
                type:"input",
                name:"engineerName",
                message: "What is the engineers name?"
            },
            {
                type:"input",
                name: "engineerId",
                message: "What is your engineers Id?",

            },
            {
                type:"input",
                name:"engineerEmail",
                message:"What is your engineers email?"
            },
            {
                type:"input",
                name:"engineerGithub",
                message: "what is your engineers Github username?"
            }]).then(answers => {
                const engineer = new Engineer(answers.engineerName, answers.engineerId, answers.engineerEmail, answers.engineerGithub);
                team.push(engineer);
                createTeam();
            })
    }
    // function to handle generating intern
    function createIntern(){
        inquirer.prompt([
            {
                type:"input",
                name:"internName",
                message: "what is your interns name?"
            },
            {
                type: "input",
                name: "internId",
                messasge: "what is your interns Id?"
            },
            {
                type: "input",
                name: "internEmail",
                message: "What is your interns email?",
            },
            {
                type: "input",
                name: "internSchool",
                message: "what is your interns school?"
            }
        ]).then(answers => {
            const intern = new Intern(answers.internName, answers.internId, answers.internEmail, answers.internSchool);
            team.push(intern);
            createTeam();
        })
    };
    // function to buildTeam - will use fs.writeFileSync & pass in the outputPath created above, call to render (dont forget to pass in the employee array), & "utf-8"

    function buildTeam(){
        if (!fs.existsSync(OUTPUT_DIR)) {
            fs.mkdirSync(OUTPUT_DIR);
          }
        fs.writeFileSync(outputPath, render(team), "utf-8")
    }
    createManager(); // starts of the whole chain of events. 
}

start();
