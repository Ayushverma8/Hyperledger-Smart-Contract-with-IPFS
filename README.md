# Hyperledger-Smart-Contract-with-IPFS
 

Smart contract methods and their functionalities: 

1.	 readSignature: This smart contract is meant for reading the stored smart contract variable in the system. 

Input: 

 {
  "arg0": "SignatureOfTheBuyer"
  }



Output: 

 {
“arg1”: “ted7AyBFWgmx4qng59z+4taPB/ObG+NfdOm4ehrxQsdWaVGxsdUHdBCPjVuN4y9VWDaDlPpwgYaXB+nRiyHu5Kw92XlSRk2un6Mqz+XDMZnrfnpFJvKit68tI2Tt5Xf7FNVHankYRXu20qJfufeJbsVwfF6YEp+TRoz3uKcnD5WJgk4bdQF1Iyy7aUP0v8pYObi16vdmHVaRzPlP11KmPAKngFpC/7YQ5p3xGWF+ccxYXgZh5+9u25OvJDBstAdw/GkQwrlQSLadfrYG2T/dOfd0ZCtwu2/A+YXaRctNdLpICOFaRaH43nMD44XzmnD8iOBFafPKbeawQ==”
 }


2.	writeSignature : This function is meant for the writing the signature to the smart contract variable. For instance, you can pass the object like this 

Input: 

{
“arg0”: “SignatureOfTheSeller”,
“arg1”: “ted7AyBFWgmx4qng59z+4taPB/ObG+NfdOm4ehrxQsdWaVGxsdUHdBCPjVuN4y9VWDaDlPpwgYaXB+nRiyHu5Kw92XlSRk2un6Mqz+XDMZnrfnpFJvKit68tI2Tt5Xf7FNVHankYRXu20qJfufeJbsVwfF6YEp+TRoz3uKcnD5WJgk4bdQF1Iyy7aUP0v8pYObi16vdmHVaRzPlP11KmPAKngFpC/7YQ5p3xGWvfvfvfvF+ccxYXgZh5+9u25OvJDBstAdw/GkQwrlQSLadfrYG2T/dOfd0ZCtwu2/A+YXaRctNdLpICOFaRaH43nMD44XzmnD8iOBFafPKbeawQ==”
}





STEP 1: Start docker service and run microfab container: ![image](https://user-images.githubusercontent.com/15349623/184539608-3202b9a5-6ee6-4e43-a77a-49c294e92d65.png)


![image](https://user-images.githubusercontent.com/15349623/184539529-14961312-c983-4434-be59-2c0238b0d900.png)


STEP 2 :  Activate the IPFS service to start listening. This will enable us to create a file on the IPFS server.

 ![image](https://user-images.githubusercontent.com/15349623/184539602-66dfce0b-e6cd-44ad-af9d-f93c5eb86a75.png)


STEP 3 : 

Create the new Hyperledger folder with CRUD operations. You can deploy the package and test it. 
 ![image](https://user-images.githubusercontent.com/15349623/184539637-f3e2ad0e-d935-48e6-a49d-d2acb3f5a7f7.png)


 

STEP 4 : 

Now we need to create Hyperledger contract for this particular requirements. 

/*
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const { Contract } = require("fabric-contract-api");

class MyAssetContract extends Contract {
    async myAssetExists(ctx, myAssetId) {
        const buffer = await ctx.stub.getState(myAssetId);
        return !!buffer && buffer.length > 0;
    }

    async writeSignature(ctx, myAssetId, value) {
        const exists = await this.myAssetExists(ctx, myAssetId);
        if (exists) {
            throw new Error(`The my asset ${myAssetId} already exists`);
        }
        const asset = { value };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(myAssetId, buffer);
    }

    async readSignature(ctx, myAssetId) {
        const exists = await this.myAssetExists(ctx, myAssetId);
        if (!exists) {
            throw new Error(`The my asset ${myAssetId} does not exist`);
        }
        const buffer = await ctx.stub.getState(myAssetId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }
}

module.exports = MyAssetContract;


Once you deploy the smart contract, you have to export the wallet address to the Org1 directory and the JSON file from the VS Code extension. 

STEP 5 : 

Now we have second part of the coding, the Hyperledger REST platform which exposes the end points if required. 

![image](https://user-images.githubusercontent.com/15349623/184539658-22659334-28b7-4fa8-8f3b-3fb6c42bb53c.png)

        await createAsset("Seller1", signature_seller.toString("base64"));
        await createAsset("Buyer1", signature_buyer.toString("base64"));

        let buyer_digest_from_hyperledger = await readAsset("Buyer1");
        let seller_digest_from_hyperledger = await readAsset("Seller1");



To invoke the smart contract, we need to run the file in the Hyperledger REST folder. It will call the mapped smart contract and will make the necessary calls via RPC to invoke the required Smart contract in the IBM Hyperledger. 








Next thing I did is assigned the functions to the Digital Certificate Mechanism. 

 




RSA keys are also used for signing and verification. Signing is different from encryption, in that it enables you to assert authenticity, rather than confidentiality.

What this means is that instead of masking the contents of the original message (like what was done in encryption), a piece of data is generated from the message, called the “signature”.

Anyone who has the signature, the message, and the public key, can use RSA verification to make sure that the message actually came from the party by whom the public key is issued. If the data or signature don’t match, the verification process fails.










STEP 6 : 

Terminal and code snapshots : 

 ![image](https://user-images.githubusercontent.com/15349623/184539675-2d74a89c-2853-4769-a8c9-784a643df9b8.png)


Hyperledger REST Application :

 ![image](https://user-images.githubusercontent.com/15349623/184539678-2f40c705-c275-4cad-83fb-6d166772497b.png)


Hyperleder Smart contract : 

 ![image](https://user-images.githubusercontent.com/15349623/184539697-9eaf1fb8-62ad-4757-b20b-f2296a575802.png)

 
IPFS Document that is being considered as the genuine source of contract. 

 ![image](https://user-images.githubusercontent.com/15349623/184539690-08db97c6-7b7f-4bdb-8f7f-cdcc305fab30.png)


False case check with incorrect IPFS Message: 

![image](https://user-images.githubusercontent.com/15349623/184539764-007cf30c-ab1b-4639-9e3f-2972cf575f38.png)


 

