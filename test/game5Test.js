const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');
const { ethers } = require('hardhat');

describe('Game5', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5');
    const game = await Game.deploy();

    const newLessAddress = async () => {
      const threshold = 0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf;
      let smallerAddress;

      // Set a maximum number of attempts to prevent the loop from running indefinitely
      const maxAttempts = 1000;
      let attempts = 0;
      //using a loop to create and check for any wallet that will be lesser than threshold
      while (!smallerAddress && attempts < maxAttempts) {
        const newWallet = ethers.Wallet.createRandom().connect(ethers.provider);
        const newAddress = await newWallet.getAddress();

        if (newAddress < threshold) {
          smallerAddress = newAddress;
          console.log(`"Address : ${smallerAddress} found , In ${attempts} attempts`);
          const signer = await ethers.provider.getSigner();
          //sending gas to new wallet to cover for gas fee
          await signer.sendTransaction({
            to: smallerAddress,
            value: ethers.utils.parseEther("1.0"),
          });
          return newWallet || null;
        }

        attempts++;
      }
    }


    return { game, newLessAddress };
  }



  it('should be a winner', async function () {
    const { game, newLessAddress } = await loadFixture(deployContractAndSetVariables);

    // good luck
    const signer = await newLessAddress();
    await game.connect(signer).win();

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
