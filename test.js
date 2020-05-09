const fs = require("fs");
const path = require("path");
const { exec, execSync } = require("child_process");

execSync("node ./index.js version");
fs.mkdirSync("test");
fs.writeFileSync(path.join("test", "fake.als.xml"), "");

execSync("cd test && node ../index.js init");
execSync("cd test && node ../index.js back2live");

const proc = exec(
  "cd test && node ../index.js watch",
  { timeout: 10000 },
  (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      console.log("should be caused by the 10s timeout for this process");
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
    }
    console.log(`stdout: ${stdout}`);
  }
);

setTimeout(() => {
  execSync("touch test/fake.als");
}, 1000);

execSync("npm install -g thomasgeissl/gitable");
execSync("gitable version");
