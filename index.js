const vorpal = require("vorpal")();
const fsAutocomplete = require("vorpal-autocomplete-fs");
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
	console.log(currentPath)
  var promise = this.prompt([
    {
      type: "input",
      name: "path",
      message: "path: "
    }
  ]);

  promise.then(function(answers) {
    currentPath = answers.path;
    NodeGit.Repository.open(currentPath).then(
      function(successfulResult) {
        // This is the first function of the then which contains the successfully
        // calculated result of the promise
        repository = successfulResult;
        console.log("successfully opened repository", repository.workdir());
        vorpal.exec("watch");
        cb();
      },
      function(reasonForFailure) {
        // This is the second function of the then which contains the reason the
        // promise failed
        console.log("could not open repository", reasonForFailure);
        cb();
      }
    );
  });
});

vorpal.command("init").action(function(args, cb) {
  var self = this;
  this.log(path.resolve(currentPath));
  NodeGit.Repository.init(
    "/Users/thomasgeissl/Desktop/gitabletest Project/",
    0
  ).then(
    function(repo) {
      repository = repo;
      self.log("successfully initialised git repo");
      cb();
    },
    function(error) {
      self.log(error);
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
    NodeGit.Repository.open(currentPath).then(
      function(successfulResult) {
        repository = successfulResult;
        console.log("successfully opened repository", repository.workdir());
        cb();
      },
      function(reasonForFailure) {
        console.log("could not open repository", reasonForFailure);
        cb();
      }
    );
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
                console.log("New Commit: ", commitId);
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

vorpal.command("back2live").action(function(args, cb) {});

vorpal.delimiter("gitable").show();
// vorpal.parse(process.argv);
vorpal.exec("start");
