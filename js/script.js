document.addEventListener("DOMContentLoaded", function () {})

import { ethers } from "./ethers-5.2.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectBtn = document.getElementById("connectButton")
const fundBtn = document.getElementById("fundButton")

connectBtn.addEventListener("click", (e) => {
    e.preventDefault()
    connect()
})

fundBtn.addEventListener("click", (e) => {
    e.preventDefault()
    fund()
})

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" })
        } catch (error) {
            console.log(error)
        }
        connectBtn.innerHTML = "Connected"
        const accounts = await ethereum.request({ method: "eth_accounts" })
        console.log(accounts)
    } else {
        connectBtn.innerHTML = "Please install MetaMask!"
    }
}

async function fund(ethAmount) {
    console.log(`Funding with ${ethAmount}`)
    ethAmount = "1"

    if (typeof window.ethereum !== "undefined") {
        //provider / connection to the blockchain
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        //signer / wallet / someone with some gas
        const signer = provider.getSigner()
        console.log(signer)
        //contract that we are interacting with
        //^ABI & address
        const contract = new ethers.Contract(contractAddress, abi, signer)
        const transactionResponse = await contract.fund({
            value: ethers.utils.parseEther(ethAmount),
        })
    }
}
