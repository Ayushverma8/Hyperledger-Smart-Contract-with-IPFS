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

  async writeSignature_024(ctx, myAssetId, value) {
    const exists = await this.myAssetExists(ctx, myAssetId);
    if (exists) {
      throw new Error(`The my asset ${myAssetId} already exists`);
    }
    const asset = { value };
    const buffer = Buffer.from(JSON.stringify(asset));
    await ctx.stub.putState(myAssetId, buffer);
  }

  async readSignature_024(ctx, myAssetId) {
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
