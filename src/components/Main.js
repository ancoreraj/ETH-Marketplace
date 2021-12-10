import React from 'react'
import { useState } from 'react'

const Main = ({ createProduct, products, purchaseProduct }) => {

    const [name, setName] = useState('')
    const [price, setPrice] = useState('')


    return (
        <div id="content">
            <h1>Add Product</h1>
            <form onSubmit={(event) => {
                event.preventDefault()
                const productPrice = window.web3.utils.toWei(price.toString(), 'Ether')
                createProduct(name, productPrice)
            }}>
                <div className="form-group mr-sm-2">
                    <input
                        id="productName"
                        type="text"
                        onChange={e => setName(e.target.value)}
                        className="form-control"
                        placeholder="Product Name"
                        required />
                </div>
                <div className="form-group mr-sm-2">
                    <input
                        id="productPrice"
                        type="text"
                        onChange={e => setPrice(e.target.value)}
                        className="form-control"
                        placeholder="Product Price"
                        required />
                </div>
                <button type="submit" className="btn btn-primary">Add Product</button>
            </form>
            <p> </p>
            <h2>Buy Product</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Price</th>
                        <th scope="col">Owner</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody id="productList">
                    {products.map((product, key) => {
                        return (
                            <tr key={key}>
                                <th scope="row">{product.id.toString()}</th>
                                <td>{product.name}</td>
                                <td>{window.web3.utils.fromWei(product.price.toString(), 'Ether')} ETH</td>
                                <td>{product.owner}</td>
                                <td>{!product.purchased ? <button className="buyButton"
                                    name={product.id}
                                    value={product.price}
                                    onClick={
                                        (event) => {
                                            console.log(`clicked`);

                                            purchaseProduct(event.target.name, event.target.value)

                                        }
                                    }>Buy</button> :
                                    null}
                                </td>
                            </tr>

                        )
                    })}

                </tbody>
            </table>
        </div>
    )
}

export default Main
