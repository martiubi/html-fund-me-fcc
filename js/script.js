document.addEventListener("DOMContentLoaded", function () {})

import { ethers } from "./ethers-5.2.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectBtn = document.getElementById("connectButton")
const fundBtn = document.getElementById("fundButton")
const eth = document.getElementById("ethAmount")
const balanceBtn = document.getElementById("balanceButton")
const withdrawBtn = document.getElementById("withdrawButton")

connectBtn.addEventListener("click", (e) => {
    e.preventDefault()
    connect()
})

fundBtn.addEventListener("click", (e) => {
    e.preventDefault()
    fund()
})

balanceBtn.addEventListener("click", (e) => {
    e.preventDefault()
    getBalance()
})

withdrawBtn.addEventListener("click", (e) => {
    e.preventDefault()
    withdraw()
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
    ethAmount = eth.value
    console.log(`Funding with ${ethAmount}ETH`)
    if (typeof window.ethereum !== "undefined") {
        //provider / connection to the blockchain
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        //signer / wallet / someone with some gas
        const signer = provider.getSigner()
        console.log(signer)
        const contract = new ethers.Contract(contractAddress, abi, signer)
        //contract that we are interacting with
        //^ABI & address
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            //wait for the transaction to finish
            await listenForTransactionMine(transactionResponse, provider)
            console.log("Done!")
        } catch (error) {
            console.log(error)
        }
    }
}

async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}

async function withdraw() {
    if (typeof window.ethereum !== "undefined") {
        console.log("Withdrawing...")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.withdraw()
            //wait for the transaction to finish
            await listenForTransactionMine(transactionResponse, provider)
            console.log("Done!")
        } catch (error) {
            console.log(error)
        }
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`)
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmations`
            )
            resolve()
        })
    })
}
