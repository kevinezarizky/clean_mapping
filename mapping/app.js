const ldap = require("ldapjs");
const express = require("express");
const app = express();
const port = 3000;
let client;

// unbind after completion of process
function closeConnection() {
  console.log("closeConnection");
  client.unbind((err) => {
    console.log("unbind error", err);
  });
}

function search() {
  const searchOptions = {
    filter: "(uid=yourSearchText)", // search text
    scope: "sub",
  };
  return new Promise((resolve, reject) => {
    client.search(
      "ou=consultants," + 'ou="Your OU",ou=yourOu,dc=yourDc,dc=com',
      searchOptions,
      (err, res) => {
        res.on("searchEntry", (entry) => {
          console.log("searchEntry", entry.object);
          resolve(entry.object);
        });
        res.on("searchReference", (referral) => {
          console.log("referral: " + referral.uris.join());
          resolve(referral.uris.join());
        });
        res.on("error", (err) => {
          console.error("search error: " + err.message);
          reject(err);
        });
        res.on("end", (result) => {
          console.log("If not found", result);
          reject({ message: "User not found" });
        });
      }
    );
  });
}

function authenticate() {
  const server = "localhost:10389";
  client = ldap.createClient({
    url: `ldap://${server}`,
  });

  return new Promise((resolve, reject) => {
    client.bind("cn=yourcn,dc=yourdc,dc=com", "sortedSolutions", (err) => {
      if (err) {
        reject(err);
      }
      resolve("Authenticated successfully");
    });
  });
}

function start(req, res) {
  let searchResponseData;
  authenticate()
    .then((authenticateResponse) => {
      console.log("authenticateResponse", authenticateResponse);
      return search();
    })
    .then((searchResponse) => {
      console.log("searchResponsesearchResponse", searchResponse);
      searchResponseData = searchResponse;
      return closeConnection();
    })
    .then((closeConnectionResponse) => {
      console.log("ldap connection closed", closeConnectionResponse);
      res.status(200).send(searchResponseData);
    })
    .catch((error) => {
      console.log("catch error", error);
      res.status(400).send(error);
    });
}

module.exports.start = start;
app.get("/", (req, res) => {
  res.send(start("asd", "sad"));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
