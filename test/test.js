const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("DGSCreativeNFTContract", async function () {
  let DGSCreativeNFTContractFactory;
  let DGSCreativeNFTContract;
  let args = {
    mint_price: "20000000000000000",
    max_tokens: 3,
    base_uri:
      "https://ipfs.io/ipfs/bafkreidr5a7hvyiilxfug2yqpbkdowcahpbsw4jszstz6iur5ae5dx7b54",
    royaltyArtist: "0x94848CEe6eA7dBcc5322f0B13015A42ec63bC3BB",
    royaltyBasis: 500,
  };
  this.beforeEach(async function () {
    DGSCreativeNFTContractFactory = await ethers.getContractFactory(
      "DGSCreativeNFTContract"
    );
    DGSCreativeNFTContract = await DGSCreativeNFTContractFactory.deploy(
      args.mint_price,
      args.max_tokens,
      args.base_uri,
      args.royaltyArtist,
      args.royaltyBasis
    );
    await DGSCreativeNFTContract.waitForDeployment(
      args.mint_price,
      args.max_tokens,
      args.base_uri,
      args.royaltyArtist,
      args.royaltyBasis
    );
  });
  describe("construction and initialization", async function () {
    this.beforeEach(async function () {
      DGSCreativeNFTContractFactory = await ethers.getContractFactory(
        "DGSCreativeNFTContract"
      );
      DGSCreativeNFTContract = await DGSCreativeNFTContractFactory.deploy(
        args.mint_price,
        args.max_tokens,
        args.base_uri,
        args.royaltyArtist,
        args.royaltyBasis
      );
      await DGSCreativeNFTContract.waitForDeployment(
        args.mint_price,
        args.max_tokens,
        args.base_uri,
        args.royaltyArtist,
        args.royaltyBasis
      );
    });
    it("should be named DGSCreativeNFTContract", async function () {
      const expectedValue = "DGSCreativeNFTContract";
      const currentValue = await DGSCreativeNFTContract.name();
      assert.equal(currentValue.toString(), expectedValue);
    });
    it("should be have symbol DGS", async function () {
      const expectedValue = "DGS";
      const currentValue = await DGSCreativeNFTContract.symbol();
      assert.equal(currentValue.toString(), expectedValue);
    });
    it("should have a mint price set when constructed", async function () {
      const expectedValue = args.mint_price;
      const currentValue = await DGSCreativeNFTContract.getMintPrice();
      assert.equal(currentValue.toString(), expectedValue);
    });
    it("should have a max token supply set when constructed", async function () {
      const expectedValue = args.max_tokens;
      const currentValue = await DGSCreativeNFTContract.getMaxSupply();
      assert.equal(currentValue.toString(), expectedValue);
    });

    it("should have a base URI set when constructed", async function () {
      const expectedValue = args.base_uri;
      const currentValue = await DGSCreativeNFTContract.getBaseURI();
      assert.equal(currentValue.toString(), expectedValue);
    });

    it("should set roylaty artist when constructed", async function () {
      let tokenId = 1;
      const expectedValue = args.royaltyArtist;
      const currentValue = await DGSCreativeNFTContract.royaltyInfo(
        1,
        ethers.parseUnits("0.02", "ether")
      );
      assert.equal(currentValue[0].toString(), expectedValue);
    });

    it("should set roylaty share when constructed", async function () {
      const expectedValue = (args.royaltyBasis * args.mint_price) / 10000;
      const currentValue = await DGSCreativeNFTContract.royaltyInfo(
        1,
        ethers.parseUnits("0.02", "ether")
      );
      assert.equal(currentValue[1].toString(), expectedValue);
    });

    it("should set owner to the deployer's address when constucted", async function () {
      const expectedValue = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
      const currentValue = await DGSCreativeNFTContract.owner();
      assert.equal(currentValue.toString(), expectedValue);
    });
  });

  describe("receive function", async function () {
    this.beforeEach(async function () {
      DGSCreativeNFTContractFactory = await ethers.getContractFactory(
        "DGSCreativeNFTContract"
      );
      DGSCreativeNFTContract = await DGSCreativeNFTContractFactory.deploy(
        args.mint_price,
        args.max_tokens,
        args.base_uri,
        args.royaltyArtist,
        args.royaltyBasis
      );
      await DGSCreativeNFTContract.waitForDeployment(
        args.mint_price,
        args.max_tokens,
        args.base_uri,
        args.royaltyArtist,
        args.royaltyBasis
      );
    });

    it("should be called and revert if called from low-level transaction", async function () {
      let contractAddress = await DGSCreativeNFTContract.getAddress();
      const [owner, artist, buyer] = await ethers.getSigners();
      expect(
        buyer.sendTransaction({
          to: contractAddress,
          value: ethers.parseUnits("2.0", "ether"),
        })
      ).to.be.revertedWithCustomError;
    });
  });

  describe("fallback function", async function () {
    this.beforeEach(async function () {
      DGSCreativeNFTContractFactory = await ethers.getContractFactory(
        "DGSCreativeNFTContract"
      );
      DGSCreativeNFTContract = await DGSCreativeNFTContractFactory.deploy(
        args.mint_price,
        args.max_tokens,
        args.base_uri,
        args.royaltyArtist,
        args.royaltyBasis
      );
      await DGSCreativeNFTContract.waitForDeployment(
        args.mint_price,
        args.max_tokens,
        args.base_uri,
        args.royaltyArtist,
        args.royaltyBasis
      );
    });

    it("should be called and revert if called from low-level transaction with no data", async function () {
      let contractAddress = await DGSCreativeNFTContract.getAddress();
      const [owner, artist, buyer] = await ethers.getSigners();
      expect(buyer.sendTransaction({ to: contractAddress })).to.be
        .revertedWithCustomError;
    });
  });

  describe("mintTo function", async function () {
    this.beforeEach(async function () {
      DGSCreativeNFTContractFactory = await ethers.getContractFactory(
        "DGSCreativeNFTContract"
      );
      DGSCreativeNFTContract = await DGSCreativeNFTContractFactory.deploy(
        args.mint_price,
        args.max_tokens,
        args.base_uri,
        args.royaltyArtist,
        args.royaltyBasis
      );
      await DGSCreativeNFTContract.waitForDeployment(
        args.mint_price,
        args.max_tokens,
        args.base_uri,
        args.royaltyArtist,
        args.royaltyBasis
      );
    });

    it("should revert if called with no ether", async function () {
      const [owner, artist, buyer] = await ethers.getSigners();
      expect(
        DGSCreativeNFTContract.connect(buyer).mintTo(args.base_uri, {
          value: ethers.parseUnits("0.0", "ether"),
        })
      ).to.be.revertedWithCustomError;
    });

    it("should revert if called with too low amount of ether", async function () {
      const [owner, artist, buyer] = await ethers.getSigners();
      expect(
        DGSCreativeNFTContract.connect(buyer).mintTo(args.base_uri, {
          value: args.mint_price - 1,
        })
      ).to.be.revertedWithCustomError;
    });

    it("should revert if called with too high amount of ether", async function () {
      const [owner, artist, buyer] = await ethers.getSigners();
      expect(
        DGSCreativeNFTContract.connect(buyer).mintTo(args.base_uri, {
          value: args.mint_price + 1,
        })
      ).to.be.revertedWithCustomError;
    });

    it("should not revert if called with the correct amount of ether", async function () {
      const [owner, artist, buyer] = await ethers.getSigners();
      expect(
        DGSCreativeNFTContract.connect(buyer).mintTo(args.base_uri, {
          value: args.mint_price,
        })
      ).not.to.be.reverted;
    });

    it("should revert if called after all tokens are minted", async function () {
      const [owner, artist, buyer] = await ethers.getSigners();
      for (let i = 0; i < args.max_tokens; i++) {
        DGSCreativeNFTContract.connect(buyer).mintTo(args.base_uri, {
          value: args.mint_price,
        });
      }
      expect(
        DGSCreativeNFTContract.connect(buyer).mintTo(args.base_uri, {
          value: args.mint_price,
        })
      ).to.be.revertedWithCustomError;
    });

    it("should have a totalSupply = 1 with after first mint", async function () {
      const [owner, artist, buyer] = await ethers.getSigners();
      const expectedValue = 1;
      const mint1 = await DGSCreativeNFTContract.connect(buyer).mintTo(
        args.base_uri,
        { value: args.mint_price }
      );
      mint1.wait(1);
      const currentValue = await DGSCreativeNFTContract.totalSupply();
      assert.equal(currentValue.toString(), expectedValue);
    });

    it("should increase the totalSupply by 1 with with each mint", async function () {
      const [owner, artist, buyer] = await ethers.getSigners();
      const expectedValue = 2;
      const mint1 = await DGSCreativeNFTContract.connect(buyer).mintTo(
        args.base_uri,
        { value: args.mint_price }
      );
      mint1.wait(1);
      const mint2 = await DGSCreativeNFTContract.connect(buyer).mintTo(
        args.base_uri,
        { value: args.mint_price }
      );
      mint2.wait(1);
      const currentValue = await DGSCreativeNFTContract.totalSupply();
      assert.equal(currentValue.toString(), expectedValue);
    });

    it("should emit an event when minting is completed", async function () {
      const [owner, artist, buyer] = await ethers.getSigners();
      expect(
        DGSCreativeNFTContract.connect(buyer).mintTo(args.base_uri, {
          value: args.mint_price,
        })
      )
        .to.emit(DGSCreativeNFTContract, "MintingCompleted")
        .withArgs(1, owner);
    });

    it("should have set the token uri during minting function", async function () {
      const [owner, artist, buyer] = await ethers.getSigners();
      const uriString = "someString";
      const expectedValue = uriString;
      const mint1 = await DGSCreativeNFTContract.connect(buyer).mintTo(
        uriString,
        { value: args.mint_price }
      );
      mint1.wait(1);
      const currentValue = await DGSCreativeNFTContract.tokenURI(1);
      assert.equal(currentValue.toString(), expectedValue);
    });

    it("should have paid the owner the value that was sent", async function () {
      const [owner, artist, buyer] = await ethers.getSigners();
      const uriString = "someString";
      let bal = (await ethers.provider.getBalance(owner)).toString();
      let mint = args.mint_price;
      let expectedValue = (
        ethers.parseUnits(bal, 18) + ethers.parseUnits(mint, 18)
      ).toString();
      const mint1 = await DGSCreativeNFTContract.connect(buyer).mintTo(
        uriString,
        { value: args.mint_price }
      );
      mint1.wait(1);
      let currentValue = (await ethers.provider.getBalance(owner)).toString();
      currentValue = ethers.parseUnits(currentValue, 18);
      expect(currentValue).to.equal(expectedValue);
    });

    it("should have a balance of zero after minting", async function () {
      const expectedValue = 0;
      const [owner, artist, buyer] = await ethers.getSigners();
      const uriString = "someString";
      const mint1 = await DGSCreativeNFTContract.connect(buyer).mintTo(
        uriString,
        { value: args.mint_price }
      );
      mint1.wait(1);
      const currentValue = await ethers.provider.getBalance(
        DGSCreativeNFTContract
      );
      assert.equal(currentValue.toString(), expectedValue);
    });

    it("should emit an event after funds are distributed during mint", async function () {
      //      const owner = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
      const [owner, artist, buyer] = await ethers.getSigners();
      const uriString = "someString";
      expect(
        DGSCreativeNFTContract.connect(buyer).mintTo(uriString, {
          value: args.mint_price,
        })
      )
        .to.emit(DGSCreativeNFTContract, "FundsDistributed")
        .withArgs(owner, args.mint_price);
    });
  });

  describe("getter functions", async function () {
    this.beforeEach(async function () {
      DGSCreativeNFTContractFactory = await ethers.getContractFactory(
        "DGSCreativeNFTContract"
      );
      DGSCreativeNFTContract = await DGSCreativeNFTContractFactory.deploy(
        args.mint_price,
        args.max_tokens,
        args.base_uri,
        args.royaltyArtist,
        args.royaltyBasis
      );
      await DGSCreativeNFTContract.waitForDeployment(
        args.mint_price,
        args.max_tokens,
        args.base_uri,
        args.royaltyArtist,
        args.royaltyBasis
      );
    });

    it("getMaxSupply() should return the max number of tokens for this NFT", async function () {
      const expectedValue = args.max_tokens;
      const currentValue = await DGSCreativeNFTContract.getMaxSupply();
      assert.equal(currentValue.toString(), expectedValue);
    });

    it("getMintPrice() should return the purchase price of the NFT", async function () {
      const expectedValue = args.mint_price;
      const currentValue = await DGSCreativeNFTContract.getMintPrice();
      assert.equal(currentValue.toString(), expectedValue);
    });

    it("getBaseURI() should return the project URI string", async function () {
      const expectedValue = args.base_uri;
      const currentValue = await DGSCreativeNFTContract.getBaseURI();
      assert.equal(currentValue.toString(), expectedValue);
    });
  });
});
