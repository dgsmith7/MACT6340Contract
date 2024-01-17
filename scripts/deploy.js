// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { hre, ethers, run, network } = require("hardhat");

async function main() {
  const args = {
    // define arguments for deployment constructor call
    mint_price: "20000000000000000", // .02 MATIC
    max_tokens: 3,
    base_uri:
      "https://ipfs.io/ipfs/QmTwiGMeNjhrECN5tHkSEN7jHDEQ3tvFzeCXF4f3EhZJzv",
    royaltyArtist: process.env.STUNT_WALLET_ADDRESS,
    royaltyBasis: 500,
  };
  const DGSCreativeNFTContractFactory = await ethers.getContractFactory(
    "DGSCreativeNFTContract"
  );
  // deploy
  const DGSCreativeNFTContract = await DGSCreativeNFTContractFactory.deploy(
    args.mint_price,
    args.max_tokens,
    args.base_uri,
    args.royaltyArtist,
    args.royaltyBasis
  );
  console.log("Deploying...");
  await DGSCreativeNFTContract.waitForDeployment(
    args.mint_price,
    args.max_tokens,
    args.base_uri,
    args.royaltyArtist,
    args.royaltyBasis
  );
  console.log("Waiting for block verifications...");
  await DGSCreativeNFTContract.deploymentTransaction().wait(15);
  let contractAddress = await DGSCreativeNFTContract.getAddress();
  console.log(`Contract deployed to ${contractAddress}`);
  // verify
  if (
    // we are on a live testnet and have the correct api key
    (network.config.chainId === 80001 && process.env.POLYGONSCAN_API_KEY) ||
    (network.config.chainId === 1115511 && process.env.ETHERSCAN_API_KEY)
  ) {
    console.log("Verifying...");
    await verify(contractAddress, [
      args.mint_price,
      args.max_tokens,
      args.base_uri,
      args.royaltyArtist,
      args.royaltyBasis,
    ]);
    console.log("Completed.");
  } else {
    console.log("No verification available for hardhat network.");
  }
  // mint 3
  const ipfs = [
    "https://ipfs.io/ipfs/QmdKR2UxXcSLVptr6ggziRG4EKUYNSiS2AFEy3wUAHVqUt",
    "https://ipfs.io/ipfs/QmQnABgoMhgP1t1gyopTS4EmsaPUZ6dwufpq1QWBZg4RyD",
    "https://ipfs.io/ipfs/QmfKLqTkMSNiC3Kc7unLctWkJREWFv4gF8Cknhkdej3snb",
  ];
  console.log("Minting 3 tokens...");
  for (let i = 0; i < 3; i++) {
    const transactionResponse = await DGSCreativeNFTContract.mintTo(ipfs[i], {
      value: args.mint_price,
    });
    await transactionResponse.wait(3);
    console.log(`Token ${i + 1} completed.`);
  }
}

async function verify(contractAddress, args) {
  console.log("verifying contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (err) {
    if (err.message.toLowerCase().includes("already verified")) {
      console.log("Already verified");
    } else {
      console.log(err);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
