#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const watch = require("node-watch");
const yargs = require("yargs");
const git = require("simple-git/promise");
const pc = require("./package.json");
const cwd = process.cwd();
let repo = null;

// eslint-disable-line
yargs.command(
  "version",
  "prints the version",
  (yargs) => {},
  (argv) => {
    console.log(pc.version);
  }
).argv;

yargs.command(
  "init",
  "initialises a git repo",
  (yargs) => {},
  (argv) => {
    fs.writeFileSync(path.join(cwd, ".gitable"));
    repo = git(cwd);
    repo
      .checkIsRepo()
      .then((isRepo) => {
        if (!isRepo) {
          return repo.init();
        } else {
          return true;
        }
      })
      .then(() => repo.add(path.join(cwd, ".gitable")))
      .then(() => repo.commit("initial commit by gitable"))
      .then(() => console.log("initialised repo and create initial commit"))
      .catch((reason) => {
        console.error("could not initialise repo", reason);
      });
  }
).argv;

yargs.command(
  "watch",
  "watches and commits on chate",
  (yargs) => {},
  (argv) => {
    repo = git(cwd);
    watch(cwd, { recursive: true, filter: /\.als$/ }, function (evt, name) {
      if (evt === "update") {
        const fileContents = fs.createReadStream(name);
        const writeStream = fs.createWriteStream(`${name}.xml`);
        const unzip = zlib.createGunzip();
        fileContents.pipe(unzip).pipe(writeStream);
        repo
          .add(`${name}.xml`)
          .then(() => {
            // TODO: prompt for commit message, with timeout
            return repo.commit("automatic commit by gitable");
          })
          .then(() => console.log("created an automatic commit"))
          .catch((reason) => {
            console.error(reason);
          });
      }
    });
  }
).argv;

yargs.command(
  "back2live",
  "creates an ableton live set",
  (yargs) => {},
  (argv) => {
    const zip = zlib.createGzip();
    fs.readdirSync(cwd).forEach((file) => {
      file = path.join(cwd, file);
      let parts = file.split(".");
      const extension = parts.pop();
      const filePath = parts.join(".");
      if (parts.length > 0 && extension === "xml") {
        console.log(filePath, extension);
        const fileContents = fs.createReadStream(file);
        const writeStream = fs.createWriteStream(filePath);
        fileContents
          .pipe(zip)
          .pipe(writeStream)
          .on("finish", (err) => {
            console.error(err);
          });
      }
    });
  }
).argv;
