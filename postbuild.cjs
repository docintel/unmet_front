const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

// Paths
const repoUrl = 'https://github.com/docintel/unmet_front.git';
const buildPath = path.resolve(__dirname, '..', 'unmet_build');
const distPath = path.resolve(__dirname, 'dist');

if(!fs.existsSync(buildPath)){
    //create build folder
    fs.mkdirSync(buildPath);
    execSync("git init .",{cwd: buildPath, stdio: 'inherit'});
    execSync(`git remote add origin ${repoUrl}`,{cwd: buildPath, stdio: 'inherit'});
    execSync("git fetch origin",{cwd: buildPath, stdio: 'inherit'});
    execSync("git checkout build",{cwd: buildPath, stdio: 'inherit'});
}
// execSync("git stash",{cwd: buildPath, stdio: 'inherit'});
// execSync("git pull origin build",{cwd: buildPath, stdio: 'inherit'});

fs.readdirSync(buildPath).forEach((file) => {
    if(file !== ".git"){
    const fullPath = path.join(buildPath, file);
    fs.removeSync(fullPath);
    console.log(`Deleted ${fullPath}`);
    }
});

//copy dist into build

fs.copySync(distPath, buildPath);

execSync("git add .",{cwd: buildPath, stdio: 'inherit'});
execSync("git gui",{cwd: buildPath, stdio: 'inherit'});


