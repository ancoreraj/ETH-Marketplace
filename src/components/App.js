import React from 'react';
import Web3 from 'web3';
import { useState, useEffect } from 'react';
import Marketplace from '../abis/Marketplace.json'
import './App.css';

import Navbar from './Navbar'
import Main from './Main'

const App = () => {

  const [state, setState] = useState({
    account: '',
    productCount: 0,
    products: [],
    loading: true,
  })


  const [market, setMarket] = useState(null)

  useEffect(async () => {
    await componentWillMount()
    await loadBlockchainData()
  }, [])

  const componentWillMount = async () => {
    await loadWeb3()
  }

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  const loadBlockchainData = async () => {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()

    setState((prevState) => ({ ...prevState, account: accounts[0] }))

    const networkId = await web3.eth.net.getId()
    const networkData = Marketplace.networks[networkId]

    if (networkData) {
      const marketplace = web3.eth.Contract(Marketplace.abi, networkData.address)
      setMarket(marketplace)

      //To read the data
      const productCount = await marketplace.methods.productCount().call()
      setState((prevState) => ({ ...prevState, productCount: productCount }))

      for (var i = 1; i <= productCount; i++) {
        const product = await marketplace.methods.products(i).call()
        setState((prevState) => ({
          ...prevState, products: [...prevState.products, product]
        }))
      }

      setState((prevState) => ({ ...prevState, loading: false }))
    } else {
      window.alert('Marketplace contract not deployed to detected network.')

    }
  }

  const createProduct = (_name, _price) => {
    setState((prevState) => ({ ...prevState, loading: true }))


    market.methods.createProduct(_name, _price).send({ from: state.account, gas: 3000000 })
      .on("transactionHash", () => {
        console.log("Hash")
      })
      .on("receipt", () => {
        console.log("Receipt");
      })
      .on("confirmation", () => {
        console.log("Confirmed");
        setState((prevState) => ({ ...prevState, loading: false }))

      })
      .on("error", async (err) => {
        console.log("Error");
        setState((prevState) => ({ ...prevState, loading: false }))
        console.log(err.message);
      });
  }

  const purchaseProduct = (_id, _price) => {
    setState((prevState) => ({
      ...prevState, loading: true
    }))
    market.methods.purchaseProduct(_id).send({ from: state.account, value: _price, gas: 3000000 })
      .on("receipt", () => {
        console.log("Receipt");
      })
      .on("confirmation", () => {
        console.log("Confirmed");
        setState((prevState) => ({ ...prevState, loading: false }))
      })
      .on("error", async (err) => {
        alert('error')
        setState((prevState) => ({ ...prevState, loading: false }))
      });

  }

  return (
    <div>

      <Navbar state={state} />

      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex text-center">

            {state.loading ?
              <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
              :
              <Main
                createProduct={createProduct}
                purchaseProduct={purchaseProduct}
                products={state.products} />}

          </main>
        </div>
      </div>
    </div>
  );
}


export default App;
