const web3 = require('../web3')
const SlimeRouterABI = require('./abi/SlimeRouter.abi.json')

const SlimeRouterAddress = '0xDb4016d6BC64C464dF3E77ce310f1106e095ed56'

const SlimeRouter = new web3.eth.Contract(SlimeRouterABI, SlimeRouterAddress)

module.exports = {
    SlimeRouterAddress,
    SlimeRouter,
}
