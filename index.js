#!/usr/bin/env node

const vorpal = require("vorpal")();
const fsAutocomplete = require("vorpal-autocomplete-fs");
const zlib = require("zlib");
const gunzipFile = require("gunzip-file");
const fs = require("fs");
const path = require("path");
const watch = require("node-watch");
const NodeGit = require("nodegit");

let currentPath = process.cwd();

let watcher;

let repository;
let index;
let oid;

vorpal.command("start").action(function(args, cb) {
	const self = this;
	self.log("Hello.")
  var promise = this.prompt([
    {
      type: "input",
      name: "path",
      message: "Where can your Ableton Live project be found? Please enter the absolute path.: ",
      default: currentPath
    }
  ]);

  promise.then(function(answers) {
    currentPath = answers.path;
    NodeGit.Repository.open(currentPath).then(
      function(successfulResult) {
        repository = successfulResult;
        self.log("successfully opened repository", repository.workdir());
        vorpal.exec("watch");
        cb();
      },
      function(reasonForFailure) {
        // self.log("could not open repository", reasonForFailure);
        var promise = self.prompt([
          {
            type: "confirm",
            name: "config",
            message:
              "Do you want to initialise and configure a new git repository?",
            default: true
          }
        ]);
        promise.then(function(answers) {
          if (answers.config) {
            vorpal.exec("config");
            cb();
          } else {
            cb();
          }
        });
        cb();
      }
    );
  });
});

vorpal.command("config").action(function(args, cb) {
  var self = this;
  this.log(path.resolve(currentPath));
  NodeGit.Repository.init(currentPath, 0).then(
    function(repo) {
      repository = repo;
      self.log("successfully initialised git repo");
      cb();
    },
    function(error) {
      self.log(error);
      cb();
    }
  );
  cb();
});

vorpal.command("commit").action(function(args, cb) {
  var self = this;
  var promise = this.prompt([
    {
      type: "input",
      name: "message",
      message: "message: "
    }
  ]);
  // TODO: stage *.als and commit them with answers.message

  promise.then(function(answers) {
    NodeGit.Repository.open(currentPath)
      .then(
        function(repo) {
          repository = repo;
          return repository.refreshIndex();
        },
        function(error) {
          console.error(error);
        }
      )
      .then(
        function(indexResult) {
          index = indexResult;
        },
        function(error) {
          console.error(error);
        }
      )
      .then(
        function() {
          let dirCont = fs.readdirSync(currentPath);
          let files = dirCont.filter(function(elm) {
            return elm.match(/.*\.(als)/gi);
          });
          console.log(files);
          files.forEach(file => {
            const relativePath = path.relative(currentPath, file);
            index.addByPath(relativePath);
          });
          return index.write();
        },
        function(error) {
          console.error(error);
        }
      )
      // .then(
      //   function() {
      //     return index.write();
      //   },
      //   function(error) {
      //     console.error(error);
      //   }
      // )
      .then(
        function() {
          return index.writeTree();
        },
        function(error) {
          console.error(error);
        }
      )
      .then(
        function(oidResult) {
          oid = oidResult;
          return NodeGit.Reference.nameToId(repository, "HEAD");
        },
        function(error) {
          console.error(error);
        }
      )
      .then(
        function(head) {
          return repository.getCommit(head);
        },
        function(error) {
          console.error(error);
        }
      )
      .then(
        function(parent) {
          const author = NodeGit.Signature.now(
            "gitable",
            "thomas.geissl@gmail.com"
          );
          const committer = NodeGit.Signature.now(
            "gitable",
            "thomas.geissl@gmail.com"
          );

          return repository.createCommit(
            "HEAD",
            author,
            committer,
            answers.message,
            oid,
            [parent]
          );
        },
        function(error) {
          console.error(error);
        }
      )
      .done(function(commitId) {
        console.log("succesfully commited live set");
      });
  });
  cb();
});

vorpal.command("push").action(function(args, cb) {
  NodeGit.Repository.open(currentPath).then(
    function(repo) {
      repository = repo;
    },
    function(error) {
      console.error(error);
    }
  );
  // TODO: push to origin master
  cb();
});

vorpal
  .command("watch")
  .action(function(args, cb) {
		const self = this
		this.log("Watching your project for changes ..., ^C to stop")
    if (currentPath) {
      watcher = watch(currentPath, { recursive: false, delay: 1000 }, function(
        evt,
        name
      ) {
        // console.log('%s changed.', name);
        // console.log(evt, name);
        const parts = name.split(".");
        if (parts.length > 0 && parts[1] === "als") {
          const xml = name.split(".")[0] + ".xml";
          gunzipFile(name, xml);
          setTimeout(function() {
            NodeGit.Repository.open(currentPath)
              .then(
                function(repo) {
                  repository = repo;
                  return repository.refreshIndex();
                },
                function(error) {
                  console.error(error);
                }
              )
              .then(
                function(indexResult) {
                  index = indexResult;
                },
                function(error) {
                  console.error(error);
                }
              )
              .then(
                function() {
                  const relativePath = path.relative(currentPath, xml);
                  console.log(index.entries());
                  console.log(repository.workdir(), relativePath);
                  return index.addByPath(relativePath);
                },
                function(error) {
                  console.error(error);
                }
              )
              .then(
                function() {
                  return index.write();
                },
                function(error) {
                  console.error(error);
                }
              )
              .then(
                function() {
                  return index.writeTree();
                },
                function(error) {
                  console.error(error);
                }
              )
              .then(
                function(oidResult) {
                  oid = oidResult;
                  return NodeGit.Reference.nameToId(repository, "HEAD");
                },
                function(error) {
                  console.error(error);
                }
              )
              .then(
                function(head) {
                  return repository.getCommit(head);
                },
                function(error) {
                  console.error(error);
                }
              )
              .then(
                function(parent) {
                  const author = NodeGit.Signature.now(
                    "gitable",
                    "thomas.geissl@gmail.com"
                  );
                  const committer = NodeGit.Signature.now(
                    "gitable",
                    "thomas.geissl@gmail.com"
                  );

                  return repository.createCommit(
                    "HEAD",
                    author,
                    committer,
                    "automatic commit on save",
                    oid,
                    [parent]
                  );
                },
                function(error) {
                  console.error(error);
                }
              )
              .done(function(commitId) {
                console.log("succesfully commited live set");
              });
          }, 1000);
        }
      });
    }
    // cb();
  })
  .cancel(function() {
    watcher.close();
  });

vorpal.command("back2live").action(function(args, cb) {
  const zip = zlib.createGzip();
  fs.readdirSync(currentPath).forEach(file => {
    file = path.join(currentPath, file);
    const parts = file.split(".");
    if (parts.length > 0 && parts[1] === "xml") {
      const fileContents = fs.createReadStream(file);
      const writeStream = fs.createWriteStream(parts[0] + ".als");
      fileContents
        .pipe(zip)
        .pipe(writeStream)
        .on("finish", err => {});
    }
  });
});

vorpal.delimiter("gitable$").show();
// vorpal.parse(process.argv);
vorpal.exec("start");
