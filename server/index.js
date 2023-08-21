const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { sha256 } = require("ethereum-cryptography/sha256");
const { toHex } = require("ethereum-cryptography/utils")
const SHA256 = require('crypto-js/sha256');
app.use(cors());
app.use(express.json());

const balances = {
  "04796604f7e4d1451703c5ccd8424ae971b86276970c15d158dbf9a4e3549920a0c18c9fde403e0c32c04aa6320b81d41538e2f5da49a955f00975531a633a4a15": 100,
  "0450b642669d0dcb5c79070df2f3ef893c00eff8df18e24a14f05ae4477b1e9008be89c141c775cfc2f477ce51b1321ae35fa15b65bcbfde82aff7317935995e86": 50,
  "0445c074681caa8da8fca4cabdb2c64453c5935dd4492e4cec77598666fb3bf1f1d08c23ebc04f831715f66380a6ce0417c8304359f059ab99ee0b713af4f620c7": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

const PRIVATE_KEY = "6b911fd37cdf5c81d4c0adb1ab7fa822ed253ab0ad9aa18d77257c88b29b718e";
function getPublicKey() {
  return secp.getPublicKey(PRIVATE_KEY);
}

function getAddress() {
  const publicKey = getPublicKey();
  return toHex(keccak256(publicKey.slice(1)).slice(-20));
}

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

function findBalance(address) {
  return transactions.find((t) => t.hash === hash);
}
