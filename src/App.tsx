import { MetaMaskInpageProvider } from "@metamask/providers";
import { ethers, Contract } from "ethers";
import { useEffect, useState } from "react";
import marketplaceAddress from "./contractsData/Marketplace-address.json";
import marketplaceAbi from "./contractsData/Marketplace.json";
import nftAddress from "./contractsData/NFT-address.json";
import nftAbi from "./contractsData/NFT.json";
import "./App.scss";
import NavBar from "./components/NavBar";
import { Route, Routes } from "react-router-dom";
import Purchase from "./pages/Purchase";
import Listed from "./pages/Listed";
import Create from "./pages/Create";
import { Item } from "./types/contracts";
import Home from "./pages/Home";
declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider | any;
  }
}
interface Props {
  marketplace: ethers.Contract | null;
  nft: ethers.Contract | null;
}

function App() {
  const [account, setAccount] = useState(null);
  const [nftContract, setNftContract] = useState<Contract | null>(null);
  const [items, setItems] = useState<Item[]>();
  const [loading, setLoading] = useState(false);
  const [marketplaceContract, setMarketplaceContract] =
    useState<Contract | null>(null);

  async function web3Handler() {
    const accounts = await window.ethereum?.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    loadContracts(signer);
  }
  async function loadContracts(signer: ethers.providers.JsonRpcSigner) {
    const marketplace = new ethers.Contract(
      marketplaceAddress.address,
      marketplaceAbi.abi,
      signer
    );
    const nft = new ethers.Contract(nftAddress.address, nftAbi.abi, signer);

    setMarketplaceContract(marketplace);
    setNftContract(nft);
  }
  async function loadMarketplaceItems(
    marketplace: ethers.Contract,
    nft: ethers.Contract
  ) {
    const itemCount = await marketplace.itemCount();
    console.log("total items - ", parseInt(itemCount));
    const items: Item[] = [];
    for (let i = 1; i <= itemCount; i++) {
      const item = await marketplace.s_items(i);
      if (!item.sold) {
        const uri = await nft.tokenURI(item.tokenId);
        const res = await fetch(uri);
        const metadata = await res.json();
        // console.log(metadata);
        const totalPrice = await marketplace.getTotalPrice(item.itemId);
        items.push({
          totalPrice,
          itemId: item.itemId,
          seller: item.seller,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
        });
      }
    }
    console.log(items);
    setItems(items);
    setLoading(false);
  }
  async function purchaseItem(item: Item) {
    await (
      await marketplaceContract!.purchaseItem(item.itemId, {
        value: item.totalPrice,
      })
    ).wait();
    loadMarketplaceItems(marketplaceContract!, nftContract!);
  }

  useEffect(() => {
    if (account) {
      loadMarketplaceItems(marketplaceContract!, nftContract!);
    }
  }, [account]);

  return (
    <div className="App">
      <NavBar web3Handler={web3Handler} account={account} />
      <Routes>
        <Route path="/" element={<Home items={items!} />} />
        <Route path="/purchase" element={<Purchase />} />
        <Route path="/listed" element={<Listed />} />
        <Route
          path="/create"
          element={
            <Create nft={nftContract} marketplace={marketplaceContract} />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
