const Marketplace = artifacts.require("Marketplace")

module.exports = (deployer) =>{
    deployer.deploy(Marketplace)
}