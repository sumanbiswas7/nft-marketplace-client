import { ethers } from "ethers";
import React from "react";
interface Props {
  marketplace: ethers.Contract | null;
  nft: ethers.Contract | null;
}

function Create({ marketplace, nft }: Props): JSX.Element {
  return (
    <>
      <h1>Create Nfts</h1>
    </>
  );
}

export default Create;
