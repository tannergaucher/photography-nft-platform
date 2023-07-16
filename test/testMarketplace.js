// SPDX-License-Identifier: MIT
const MarketplaceContract = artifacts.require("./TestMarketplace");
const PrintContract = artifacts.require("./TestPrint");
const truffleAssert = require("truffle-assertions");

contract("TestMarketplaceContract", (accounts) => {
  let marketplaceContract;
  let printContract;
  const TOKEN_ID = 1;
  const TOKEN_PRICE = 100;
  const owner = accounts[0];
  const seller = accounts[1];
  const buyer = accounts[2];

  beforeEach(async () => {
    // Deploy mock print contract before each test
    printContract = await PrintContract.new({ from: owner });

    // Mint an NFT for the seller and approve the marketplace contract to transfer it
    await printContract.mintPrint(seller, TOKEN_ID, { from: owner });
    await printContract.approve(printContract.address, TOKEN_ID, {
      from: seller,
    });

    // Deploy a new instance of the marketplace contract before each test
    marketplaceContract = await MarketplaceContract.new(printContract.address, {
      from: owner,
    });
  });

  it("should allow the seller to list a print for sale", async () => {
    await marketplaceContract.listPrintForSale(TOKEN_ID, TOKEN_PRICE, {
      from: seller,
    });

    const {
      seller: storedSeller,
      tokenId: storedTokenId,
      price: storedPrice,
    } = await marketplaceContract.listings(TOKEN_ID);

    assert.equal(
      storedSeller,
      seller,
      "Seller should have listed the NFT for sale"
    );
    assert.equal(
      storedTokenId.toNumber(),
      TOKEN_ID,
      "Stored token ID should be correct"
    );
    assert.equal(
      storedPrice.toNumber(),
      TOKEN_PRICE,
      "Stored token price should be correct"
    );
  });

  it("should allow the buyer to purchase a print", async () => {
    // List the Print for sale
    await marketplaceContract.listPrintForSale(TOKEN_ID, TOKEN_PRICE, {
      from: seller,
    });

    // Purchase the print
    const receipt = await marketplaceContract.buyPrint(TOKEN_ID, {
      from: buyer,
    });

    // Check if the NFT ownership is transferred to the buyer
    const newOwner = await printContract.ownerOf(TOKEN_ID);
    assert.equal(newOwner, buyer, "NFT should be owned by the buyer");

    // Check if the event is emitted correctly
    truffleAssert.eventEmitted(receipt, "PrintSold", (event) => {
      return (
        event.tokenId.toNumber() === TOKEN_ID &&
        event.price.toNumber() === TOKEN_PRICE &&
        event.buyer === buyer &&
        event.seller === seller
      );
    });
  });

  it("should not allow a buyer to purchase a print that is not listed for sale", async () => {
    // Unlist the print before the purchase attempt
    await marketplaceContract.listPrintForSale(TOKEN_ID, 0, { from: seller });

    // Attempt to purchase the unlisted print
    await truffleAssert.reverts(
      marketplaceContract.buyPrint(TOKEN_ID, { from: buyer }),
      "Print not listed for sale"
    );
  });
});
