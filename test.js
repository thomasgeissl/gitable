const fs = require("fs");
const path = require("path");
const { exec, execSync } = require("child_process");

fs.mkdirSync("test");
fs.writeFileSync(path.join("test", "fake.als.xml"), "");

execSync("cd test && node ../index.js init");
execSync("cd test && node ../index.js back2live");

const proc = exec(
  "cd test && node ../index.js watch",
  (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      process.exit(-1);
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      process.exit(-1);
    }
    console.log(`stdout: ${stdout}`);
  }
);

setTimeout(() => {
  execSync("touch test/fake.als");
  setTimeout(() => {
    proc.kill();
  }, 2000);
}, 1000);
