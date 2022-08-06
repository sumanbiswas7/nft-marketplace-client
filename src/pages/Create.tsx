import { Contract, ethers } from "ethers";
import React, { useEffect, useState } from "react";
interface Props {
  nft: Contract | null;
  marketplace: Contract | null;
}

function Create({ marketplace, nft }: Props): JSX.Element {
  async function mintAndListNft() {
    const tokenURI =
      "https://ipfs.infura.io/ipfs/Qmdhb6XwYMDc4i2zazrf5j2iYVQD3kSEmd1meHEWeJFBz5?filename=1.json";

    const mintTx = await nft!.mint(tokenURI);
    await mintTx.wait();

    const tokenId = await nft!.s_tokenId();
    const approveTx = await nft!.setApprovalForAll(marketplace!.address, true);
    await approveTx.wait();

    const listingTx = await marketplace!.makeItem(
      nft?.address,
      tokenId,
      ethers.utils.parseEther("0.99")
    );
    listingTx.wait();
  }

  return (
    <>
      <h1>Create Nfts</h1>
      <button onClick={mintAndListNft}>Create NFT</button>
    </>
  );
}

export default Create;
