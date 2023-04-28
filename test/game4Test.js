const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game4', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game4');
    const game = await Game.deploy();

    const signer1 = ethers.provider.getSigner(0);
    const signer2 = ethers.provider.getSigner(1);

    const address1 = await signer1.getAddress();
    const address2 = await signer2.getAddress();

    return { game, signer2, address1, address2 };
  }
  it('should be a winner', async function () {
    const { game, signer2, address1, address2 } = await loadFixture(deployContractAndSetVariables);

    // nested mappings are rough :}
    await game.write(address2);// signer1 is the default signer

    await game.connect(signer2).win(address1);
    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
