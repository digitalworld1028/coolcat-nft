import React, { useEffect, useState }  from "react";

import "./header.css";

import { BsFileMinusFill, BsFilePlusFill } from 'react-icons/bs';

import { useDispatch, useSelector } from "react-redux";
import { connect } from "../../redux/blockchain/blockchainActions";
import { fetchData } from "../../redux/data/dataActions";
function Header() {
    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const data = useSelector((state) => state.data);
    const [feedback, setFeedback] = useState("");
    const [claimingNft, setClaimingNft] = useState(false);
    const [mintNum, setMintNum] = useState(0)
    const claimNFTs = (_amount) => {
        _amount = document.getElementById("inputBox").textContent;
        if (_amount <= 0) {
            return;
        }
        setFeedback("Minting your Official BooCrew NFT...");
        setClaimingNft(true);
        blockchain.smartContract.methods
            .mint(blockchain.account, _amount)
            // ********
            // You can change the line above to
            // .whiteListMint(blockchain.account, _amount) if you want only whitelisted
            // users to be able to mint through your website!
            // And after you're done with whitelisted users buying from your website,
            // You can switch it back to .mint(blockchain.account, _amount).
            // ********
            .send({
                gasLimit: 285000 * _amount,
                to: "0x8815e06FC5b57Bd4d5590977a697582f19d2330e", // the address of your contract
                from: blockchain.account,
                value: blockchain.web3.utils.toWei((0.035 * _amount).toString(), "ether"),
            })
            .once("error", (err) => {
                console.log(err);
                setFeedback("Sorry, something went wrong. Check your transaction on Etherscan to find out what happened!");
                setClaimingNft(false);
            })
            .then((receipt) => {
                setFeedback(
                    "Your BooCrew NFT has been successfully minted!"
                );
                setClaimingNft(false);
                dispatch(fetchData(blockchain.account));
            });
    };

    const getData = () => {
        if (blockchain.account !== "" && blockchain.smartContract !== null) {
            dispatch(fetchData(blockchain.account));
        }
    };

    useEffect(() => {
        getData();
    }, [blockchain.account]);

    const plus_num = () =>{
        // const {mintNum} = this.state;
        setMintNum(mintNum +1);
    }
    const minus_num = () =>{
        // const {mintNum} = this.state;
        if ( mintNum ==0)return;
        setMintNum(mintNum -1)
    }
    // render(){
        return(
            <section className="info info--left info--grey">
                <div className="inner-container text-and-image">
                    <div className="text">
                        <h3> What are Cool Cats?</h3>
                        <p>
                        Cool Cats are a collection of programmatically, randomly generated NFTs on the Ethereum blockchain. The 1st generation consists of 10,000 randomly assembled cats from over 300k total options. Cool Cats that have a variety of outfits, faces and colors - all cats are cool, but completed outfit cats are the coolest. Each Cool Cat is comprised of a unique body, hat, face and outfit - the possibilities are endless!
                        </p>
                    </div>
                    <div className="image"><img alt="" src="https://www.coolcatsnft.com/static/media/cool-cats.f7654eb6.png"/></div>
                </div>
                <div className="inner-mint">
                    <div className="mint-button-img">
                            <img className="vision-img" src="https://www.coolcatsnft.com/static/media/cool-cats.f7654eb6.png" alt="Metatraveler"/>
                        </div>
                    <div className="mint-button g-flex-justify-center">
                        <p style={{color:"black"}}>
                        Let's mint some tokens here.
                        </p>
                        <div className='number-control'>
                            <BsFileMinusFill color='black' size={40} onClick = {()=> minus_num()}/>
                            <span id = "inputBox">{mintNum}</span>
                            <BsFilePlusFill color='black' size={40} onClick = {() => plus_num()}/>
                        </div>
                        {
                        blockchain.account === "" || blockchain.smartContract === null ? 
                        <div className="mint-flex-column">
                            <button className='ybutton' 
                            onClick={(e) => {
                                console.log("--------")
                                e.preventDefault();
                                dispatch(connect());
                                getData();
                            }}>Connect</button>
                            {blockchain.errorMsg !== "" ? (
                                <div style={{ textAlign: "center", fontSize: 20, color: "black"}}>
                                        {blockchain.errorMsg}
                                    </div>
                                
                            ) : null}
                        </div>
                        :<div className="mint-flex-column">
                            <button className='ybutton'
                            onClick={(e) => {
                                e.preventDefault();
                                claimNFTs(1);
                                getData();
                            }}>{claimingNft ? "BUSY" : "MINT"}</button>
                            </div>
                        }
                    </div>
                </div>
            </section>
        )
    // }
}
export default Header;