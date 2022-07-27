import { createRequire } from "module";

const require = createRequire(import.meta.url);
import { create } from "ipfs-http-client";
const client = create();

import { AbortController } from "node-abort-controller";

const { Gateway, Wallets } = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");
// const $ = jQuery = require('jquery')
const crypto = require("crypto");

const CAUtil = require("./lib/CAUtil.cjs");
const AppUtil = require("./lib/AppUtil.cjs");
const {
  buildCAClient,
  registerAndEnrollUser,
  enrollAdmin,
} = require("./lib/CAUtil.cjs");
const { buildCCPOrg1, buildWallet } = require("./lib/AppUtil.cjs");
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

// 👇️ "/home/john/Desktop/javascript"
const __dirname = path.dirname(__filename);
// const channelName = 'mychannel';
// const chaincodeName = 'basic';
// const mspOrg1 = 'Org1MSP';
// const walletPath = path.join(__dirname, 'wallet');
// const org1UserId = 'appUser';

const walletPath = path.join(__dirname, "Org1");
import * as myModule from "ipfs-http-client";

// http server config
const http = require("http");
const url = require("url");

const host = "0.0.0.0";
const port = 8952;

function prettyJSONString(inputString) {
  return JSON.stringify(JSON.parse(inputString), null, 2);
}

let identity = "Org1 Admin";
let networkConnections = {};
let gateway = null;
let network = null;
let contract = null;

// Defining the key options here
const keyOptions = [
  {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  },
  {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  },
];

// Deconstructing the Public and Private key pairs
const [
  { publicKey: publicKeyBuyer, privateKey: privateKeyBuyer },
  { publicKey: publicKeySeller, privateKey: privateKeySeller },
] = keyOptions.map((options) => crypto.generateKeyPairSync("rsa", options));
// Setup done for the public an private key
console.log(publicKeyBuyer);
var MFS_path = "/hyperledger-ipfs";
// Message that should be used to go through the message
client.files
  .write(
    MFS_path,
    new TextEncoder().encode(
      "This is a new purchase deal between Robert and Jackson about the T3 model BMW!"
    ),
    { create: true }
  )
  .then(async (r) => {
    // Setting the IPFS client.
    client.files.stat(MFS_path, { hash: true }).then(async (r) => {
      let ipfsAddr = r.cid.toString();
      console.log("added file ipfs:", ipfsAddr);
      // console.log("created message on IPFS:", cid);
      const resp = await client.cat(ipfsAddr);
      let content = [];
      for await (const chunk of resp) {
        content = [...content, ...chunk];
        const raw = Buffer.from(content).toString("utf8");
        // console.log(JSON.parse(raw))
        console.log(raw);
        // Defining the Signature buyer for Digital Certificate
        const signature_buyer = crypto.sign("sha256", Buffer.from(raw), {
          key: privateKeyBuyer,
          padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        });
        // Signature of the seller for Digital Certificate
        const signature_seller = crypto.sign("sha256", Buffer.from(raw), {
          key: privateKeySeller,
          padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        });

        console.log(signature_seller.toString("base64"));
        console.log(signature_buyer.toString("base64"));
        // Creating the smart contract for Buyer and the Seller
        await createAsset_024("Seller1", signature_seller.toString("base64"));
        await createAsset_024("Buyer1", signature_buyer.toString("base64"));
        // Reading the assets from the smart contract
        let buyer_digest_from_hyperledger = await readAsset_024("Buyer1");
        let seller_digest_from_hyperledger = await readAsset_024("Seller1");
        // Checking using the Buyer public key for the sha265
        const isVerified = crypto.verify(
          "sha256",
          raw,
          {
            key: publicKeyBuyer,
            padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
          },
          Buffer.from(buyer_digest_from_hyperledger, "base64")
        );

        // isVerified should be `true` if the signature is valid
        console.log(
          "Verifing signature from the IPFS file and matching it with the smart contract returned signature for the Buyer"
        );
        console.log("signature verified status for buyer : ", isVerified);

        // Verifying the Digital Signature for Seller to check authneticity
        const signature = crypto.sign("sha256", Buffer.from(raw), {
          key: privateKeySeller,
          padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        });
        console.log(signature.toString("base64"));

        // To verify the data, we provide the same hashing algorithm and
        // padding scheme we provided to generate the signature, along
        // with the signature itself, the data that we want to
        // verify against the signature, and the public key
        const isVerified_ = crypto.verify(
          "sha256",
          Buffer.from(raw),
          {
            key: publicKeySeller,
            padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
          },
          seller_digest_from_hyperledger
        );

        // isVerified should be `true` if the signature is valid
        console.log("signature verified for seller: ", isVerified_);
        // console.log(content.toString());
      }

      // The signature method takes the data we want to sign, the
      // hashing algorithm, and the padding scheme, and generates
      // a signature in the form of bytes
    });
  })
  .catch((e) => {
    console.log(e);
  });

async function initializeHyperledgerNetowrk() {
  try {
    // build an in memory object with the network configuration (also known as a connection profile)
    const ccp = AppUtil.buildJunglekidsOrg1();

    // build an instance of the fabric ca services client based on
    // the information in the network configuration
    // const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');

    // setup the wallet to hold the credentials of the application user
    const wallet = await buildWallet(Wallets, walletPath);
    if (gateway == null) gateway = new Gateway();

    if (network == null) {
      // console.log("Build a network instance");
      await gateway.connect(ccp, {
        wallet,
        identity: identity,
        // clientTlsIdentity:'actorfsmmodeladmin',
        // tlsInfo: {
        // 	certificate: "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUI0RENDQVlhZ0F3SUJBZ0lRT1BVMG4yZWNzZEtWeUJ6K2M3b1NvekFLQmdncWhrak9QUVFEQWpBYk1Sa3cKRndZRFZRUURFeEJoWTNSdmNtWnpiVzF2WkdWc0lFTkJNQjRYRFRJeE1EY3hPREUwTURnd04xb1hEVE14TURjeApOakUwTURnd04xb3dMakVPTUF3R0ExVUVDeE1GWVdSdGFXNHhIREFhQmdOVkJBTVRFMkZqZEc5eVpuTnRiVzlrClpXd2dRV1J0YVc0d1dUQVRCZ2NxaGtqT1BRSUJCZ2dxaGtqT1BRTUJCd05DQUFRNTYzaWgrMHN0dUlMUzVMWDQKY0VWWERhSnM5a2JQYUgrYTdPeWMvMEhYREtOZWpuMEFmeDA4SkcvaG4xanliRjIyK3Q5Wmd4LzBYZ1JsZ3RBQwpUZzFDbzRHWU1JR1ZNQTRHQTFVZER3RUIvd1FFQXdJRm9EQWRCZ05WSFNVRUZqQVVCZ2dyQmdFRkJRY0RBZ1lJCkt3WUJCUVVIQXdFd0RBWURWUjBUQVFIL0JBSXdBREFwQmdOVkhRNEVJZ1FnalViWnVmSS82SlJkWDFKUDdKMEYKMkk0cm5ZU0JMbjlpaGI2cjN1dURDMUV3S3dZRFZSMGpCQ1F3SW9BZ25aaERTK1B3czNvQXB5RmFyVzc2eXdiNwozRTBYb2RtNVExcjhaeng5eGRjd0NnWUlLb1pJemowRUF3SURTQUF3UlFJaEFPdUNTSjhTSFA3UFJWSU9sc2RxCnZRNWVwdklxYllSbUhmMURWRzU4NkYxQ0FpQUU0QmxhcVhTdEZPRU1WRHFzSmxoRzQ1aGRuL0F2MGI2SVlRNVYKU0JCQ2Z3PT0KLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQo=",

        // 	key: "LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1JR0hBZ0VBTUJNR0J5cUdTTTQ5QWdFR0NDcUdTTTQ5QXdFSEJHMHdhd0lCQVFRZ3FXUmphNGgyd3FveWxYYmYKUC9WZHNycHY0RHE0SWVZaWYveThOZ3FnZFVHaFJBTkNBQVE1NjNpaCswc3R1SUxTNUxYNGNFVlhEYUpzOWtiUAphSCthN095Yy8wSFhES05lam4wQWZ4MDhKRy9objFqeWJGMjIrdDlaZ3gvMFhnUmxndEFDVGcxQwotLS0tLUVORCBQUklWQVRFIEtFWS0tLS0tCg==",

        // },
        discovery: { enabled: true, asLocalhost: false }, // using asLocalhost as this gateway is using a fabric network deployed locally
      });
    }
  } catch (error) {
    console.error(`******** getHyperledgerGateway: ${error}`);
  }
}

async function initializeHyperledgerContract() {
  try {
    // build an in memory object with the network configuration (also known as a connection profile)
    // const ccp = AppUtil.buildJunglekidsOrg1();

    // Build a network instance based on the channel where the smart contract is deployed
    // console.log(
    //   "Build a network instance based on the channel where the smart contract is deployed"
    // );
    network = await gateway.getNetwork("channel1");

    // Get the contract from the network.
    // console.log("Get the contract from the network.", network);
    contract = network.getContract("hyperledger-ipfs");

    // console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');
    // await contract.submitTransaction('InitLedger', 'nonPrivateData');
    // console.log('*** Result: committed');

    networkConnections["hyperledger-ipfs"] = contract;
    return contract;
  } catch (error) {
    console.error(`******** getHyperledgerGateway: ${error}`);
  }
}

async function getActorConnection() {
  if (!networkConnections["hyperledger-ipfs"]) {
    await initializeHyperledgerContract();
  }
  return networkConnections["hyperledger-ipfs"];
}

async function createAsset_024(subject, value) {
  let contract = await getActorConnection();
  let result = "";
  try {
    await contract.submitTransaction("writeSignature_024", subject, value);
    result = "asset " + subject + " was successfully created!";
    console.log(result);
  } catch (e) {
    console.log(e);
    result = e.message;
  }
  // console.log(`*** Result: ${result}`);
  return result;
}

// checkApproval

async function readAsset_024(subject) {
  console.log(
    '\n--> Evaluate Transaction: readAsset_024, function returns "asset1" attributes'
  );
  let contract = await getActorConnection();
  let result = "";
  try {
    result = await contract.evaluateTransaction("readSignature_024", subject);
  } catch (e) {
    console.log(e);
    result = e.message;
  }

  const resultJson = JSON.parse(result);
  // console.log(`*** Result: ${result}`);
  return result;
}

const requestListener = async function (req, res) {
  const queryObject = url.parse(req.url, true).query;

  console.log("req.url:", req.url);

  let result = "";
  let id = "";
  let value = "";
  res.setHeader("Content-Type", "application/json");

  if (req.url.startsWith("/read")) {
    subject = queryObject.subject;
    result = await readAsset_024(subject);
    res.writeHead(200);
    res.end(result);
  } else if (req.url.startsWith("/update")) {
    value = queryObject.value;
    id = queryObject.id;
    result = await updateAsset(id, value);
    res.writeHead(200);
    res.end(result);
  } else if (req.url.startsWith("/create")) {
    value = queryObject.value;
    subject = queryObject.subject;
    result = await createAsset_024(subject, value);
    res.writeHead(200);
    res.end(result);
  } else if (req.url.startsWith("/check-approval")) {
    value = queryObject.value;
    id = queryObject.id;
    result = await checkApproval(id, value);
    res.writeHead(200);
    res.end(result);
  } else if (req.url.startsWith("/delete")) {
    id = queryObject.id;
    result = await deleteAsset(id);
    res.writeHead(200);
    res.end(result);
  } else {
    res.writeHead(200);
    res.end("please specify create, update, read or delete operation...");
  }
};

const server = http.createServer(requestListener);
server.listen(port, host, async () => {
  await initializeHyperledgerNetowrk();
  console.log(`Server is running on http://${host}:${port}`);
});
