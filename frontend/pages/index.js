import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import logo from "../src/assets/logo.png";
import flow from "../src/assets/flow.png";
import title from "../src/assets/title.png";
import Link from "next/link";
import { useEffect } from "react";

import Prism from "prismjs";

import "prismjs/themes/prism-okaidia.css";
import "prismjs/components/prism-jsx.js";
import "prismjs/plugins/line-numbers/prism-line-numbers.js";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";

export default function Home() {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  const lending = `import FlowToken from 0xTokenAddress
  //Please replace "0xTokenAddress" with the actual address of the Flow token contract you want to use.
  
  // Contract definition for a liquidity pool
  pub contract LiquidityPool {
      // Initialize token
      pub var token: @FlowToken.Token
      pub var totalSupply: UFix64
  
      // The rate earned by the lender per second
      pub var lendRate: UFix64
      // The rate paid by the borrower per second
      pub var borrowRate: UFix64
  
      // Total amount currently lent in the pool
      pub var lendAmount: UFix64
  
      // Struct to store the amount and start time of borrowing or lending
      pub struct Amount {
          pub var amount: UFix64
          pub var start: UFix64
  
          // Initializer for the Amount struct
          init(amount: UFix64, start: UFix64) {
              self.amount = amount
              self.start = start
          }
      }
  
      // Mapping to track the amounts lent by each address
      pub var lendAmounts: {Address: Amount}
      // Mapping to track the interest earned by the lender
      pub var earnedInterest: {Address: UFix64}
  
      // Arrays to store the addresses of lenders and borrowers
      pub var lenders: {Address: Bool}
      pub var borrowers: {Address: Bool}
  
      // Mapping to track the amounts borrowed by each address
      pub var borrowAmount: {Address: Amount}
      // Mapping to track the interest to be paid by the borrower
      pub var payInterest: {Address: UFix64}
  
      // Events
  
      // Constructor function to initialize the contract
      init(tokenAddress: Address, amount: UFix64) {
          // Borrow the token capability from the given address
          self.token = getAccount(tokenAddress)
              .getCapability<&FlowToken.Token{FlowToken.Balance}>(FlowToken.BalancePath)
              .borrow() ?? panic("Could not borrow capability from token contract")
  
          // Set the initial supply and rates
          self.totalSupply = amount
          self.lendRate = 100.0
          self.borrowRate = 130.0
  
          // Initialize the lendAmount field to 0
          self.lendAmount = 0.0
      }
  
      /// Lend the specified amount to the liquidity pool
      pub fun lend(amount: UFix64) {
          // Ensure the amount is greater than 0
          assert(amount > UFix64(0), message: "Amount cannot be 0")
  
          // Transfer the tokens from the caller's account to the pool contract
          self.token.transfer(from: self.account, to: self.address, amount: amount)
  
          // Record the lending amount and start time for the caller
          self.lendAmounts[self.account] = Amount(amount: amount, start: getCurrentBlock().timestamp)
          self.lenders[self.account] = true
  
          // Update the total supply of the pool
          self.totalSupply = self.totalSupply + amount
      }
  
      /// Borrow the specified amount from the liquidity pool
      pub fun borrow(amount: UFix64) {
          // Ensure the amount is greater than 0
          assert(amount > UFix64(0), message: "Amount cannot be 0")
  
          // Record the borrowing amount and start time for the caller
          self.borrowAmount[self.account] = Amount(amount: amount, start: getCurrentBlock().timestamp)
  
          // Reduce the total supply of the pool by the borrowed amount
          self.totalSupply = self.totalSupply - amount
  
          // Transfer the borrowed tokens from the pool contract to the caller's account
          self.token.transfer(from: self.address, to: self.account, amount: amount)
          self.borrowers[self.account] = true
      }
  
      /// Repay the entire loan amount with interest
      pub fun repay() {
          // Check if the caller has an active loan
          assert(self.borrowers[self.account], message: "Not a borrower")
  
          // Retrieve the borrowed amount and start time for the caller
          let amount_ = self.borrowAmount[self.account]!
  
          // Calculate the time elapsed since borrowing
          let timeElapsed = getCurrentBlock().timestamp - amount_.start
  
          // Calculate the interest to be paid by the borrower
          let interest = (amount_.amount * timeElapsed * self.borrowRate) / self.totalSupply
  
          // Calculate the total amount to be repaid (principal + interest)
          let amountWithInterest = amount_.amount + interest
  
          // Ensure the total amount to be repaid is greater than 0
          assert(amountWithInterest > UFix64(0), message: "Amount cannot be 0")
  
          // Transfer the repayment amount (principal + interest) from the caller's account to the pool contract
          self.token.transfer(from: self.account, to: self.address, amount: amountWithInterest)
  
          // Remove the borrower's record and mark them as no longer a borrower
          self.borrowAmount.remove(key: self.account)
          self.borrowers[self.account] = false
  
          // Update the total supply of the pool by adding the repayment amount
          self.totalSupply = self.totalSupply + amountWithInterest
      }
  
      /// Withdraw the earned amount for the lender
      pub fun withdraw() {
          // Check if the caller is a lender
          assert(self.lenders[self.account], message: "You are not a lender")
  
          // Retrieve the lent amount and start time for the caller
          let amount_ = self.lendAmounts[self.account]!
  
          // Calculate the time elapsed since lending
          let timeElapsed = getCurrentBlock().timestamp - amount_.start
  
          // Calculate the interest earned by the lender
          let interest = (amount_.amount * timeElapsed * self.lendRate) / self.totalSupply
  
          // Calculate the total amount to be withdrawn (principal + interest)
          let amountWithInterest = amount_.amount + interest
  
          // Ensure the total amount to be withdrawn is greater than 0
          assert(amountWithInterest > UFix64(0), message: "Amount cannot be 0")
  
          // Remove the lender's record and mark them as no longer a lender
          self.lendAmounts.remove(key: self.account)
          self.lenders[self.account] = false
  
          // Update the total supply of the pool by deducting the withdrawn amount
          self.totalSupply = self.totalSupply - amountWithInterest
  
          // Transfer the withdrawn amount (principal + interest) from the pool contract to the caller's account
          self.token.transfer(from: self.address, to: self.account, amount: amountWithInterest)
      }
  }  
      `;

  const staking = `import FungibleToken from 0xTokenAddress
  //Please replace "0xTokenAddress" with the actual address of the Flow token contract you want to use.
  
  // Staking contract that allows users to stake tokens and earn rewards
  pub contract Staking {
      // Tokens initialized
      pub var rewardsToken: @FungibleToken.FungibleToken
      pub var stakingToken: @FungibleToken.FungibleToken
  
      // Reward rate and tracking variables
      pub var rewardRate: UFix64
      pub var lastUpdateTime: UFix64
      pub var rewardPerTokenStored: UFix64
  
      // Mapping for rewards for each user
      pub var rewards: {Address: UFix64}
  
      // Mapping for rewards per token paid to each user
      pub var rewardsPerTokenPaid: {Address: UFix64}
  
      // Mapping for staked amount by each user
      pub var staked: {Address: UFix64}
  
      // Total supply for the staked token in the contract
      pub var totalSupply: UFix64
  
      // Initialize the contract with staking and rewards tokens
      init(stakingToken: @FungibleToken.FungibleToken, rewardsToken: @FungibleToken.FungibleToken) {
          self.stakingToken = stakingToken
          self.rewardsToken = rewardsToken
  
          // Set the initial reward rate and tracking variables
          self.rewardRate = 100.0
          self.lastUpdateTime = getCurrentBlock().timestamp
          self.rewardPerTokenStored = 0.0
  
          // Initialize mappings to store user-specific data
          self.rewards = {}
          self.rewardsPerTokenPaid = {}
          self.staked = {}
  
          // Set the initial total supply of staked tokens to 0
          self.totalSupply = 0.0
      }
  
      // Calculate the amount of rewards per token staked at the current instance
      pub fun rewardPerToken(): UFix64 {
          // If there are no tokens staked, return the stored reward per token value
          if self.totalSupply == 0.0 {
              return self.rewardPerTokenStored
          }
  
          // Calculate the reward per token based on the elapsed time and total supply
          return self.rewardPerTokenStored +
              (((getCurrentBlock().timestamp - self.lastUpdateTime) * self.rewardRate * 1.0e18) /
                  self.totalSupply)
      }
  
      // Calculate the earned rewards for the token staked by an account
      pub fun earned(account: Address): UFix64 {
          // Get the reward per token, staked amount, and rewards per token paid for the account
          let rewardPerToken = self.rewardPerToken()
          let stakedAmount = self.staked[account] ?? 0.0
          let rewardsPerTokenPaid = self.rewardsPerTokenPaid[account] ?? 0.0
  
          // Calculate the earned rewards by multiplying the difference in reward per token and rewards per token paid
          let rewardsEarned = (stakedAmount * (rewardPerToken - rewardsPerTokenPaid)) / 1.0e18
  
          // Get the accumulated rewards for the account
          let rewardsAccumulated = self.rewards[account] ?? 0.0
  
          // Return the total earned rewards
          return rewardsEarned + rewardsAccumulated
      }
  
      // Modifier to update the rewards for an account
      pub fun updateReward(account: Address) {
          // Update the reward per token, last update time, and earned rewards for the account
          self.rewardPerTokenStored = self.rewardPerToken()
          self.lastUpdateTime = getCurrentBlock().timestamp
          let earnedRewards = self.earned(account)
          self.rewards[account] = earnedRewards
          self.rewardsPerTokenPaid[account] = self.rewardPerTokenStored
      }
  
      // Stake an amount of tokens
      pub fun stake(amount: UFix64) {
          assert(amount > 0.0, message: "Amount cannot be 0")
  
          // Transfer the staking tokens from the user to the contract
          self.stakingToken.transfer(from: self.account, to: self.address, amount: amount)
  
          // Update the staked amount and total supply, and update rewards for the user
          self.staked[self.account] = (self.staked[self.account] ?? 0.0) + amount
          self.totalSupply = self.totalSupply + amount
          self.updateReward(self.account)
      }
  
      // Withdraw a staked amount of tokens
      pub fun withdraw(amount: UFix64) {
          assert(amount > 0.0, message: "Amount cannot be 0")
          assert(amount <= self.staked[self.account] ?? 0.0, message: "Insufficient staked amount")
  
          // Transfer the staked tokens back to the user
          self.stakingToken.transfer(from: self.address, to: self.account, amount: amount)
  
          // Update the staked amount and total supply, and update rewards for the user
          self.staked[self.account] = (self.staked[self.account] ?? 0.0) - amount
          self.totalSupply = self.totalSupply - amount
          self.updateReward(self.account)
      }
  
      // Get the reward tokens
      pub fun getReward() {
          let rewardsEarned = self.rewards[self.account] ?? 0.0
          assert(rewardsEarned > 0.0, message: "No rewards to claim")
  
          // Transfer the earned rewards tokens to the user
          self.rewardsToken.transfer(from: self.address, to: self.account, amount: rewardsEarned)
  
          // Reset the rewards for the user to 0
          self.rewards[self.account] = 0.0
      }
  }
  `;

  const vault = `import FungibleToken from 0xTokenAddress
  //Please replace "0xTokenAddress" with the actual address of the Flow token contract you want to use.
  
  pub contract Vault {
      pub let token: @FungibleToken.FungibleToken
      pub var totalSupply: UInt64
      pub var balanceOf: {Address: UInt64}
  
      // replace the tokenAddress parameter in the init function with the address of your Fungible Token contract
      init(tokenAddress: Address) {
          self.token = getAccount(tokenAddress).getCapability<&FungibleToken.Vault{FungibleToken.Receiver}>(/public/fungibleTokenReceiver)
                              .borrow()
                              ?? panic("Could not borrow receiver reference to the Vault contract")
  
          self.totalSupply = 0
          self.balanceOf = {}
      }
  
      // Function to calculate shares based on the deposited amount
      pub fun calculateShares(amount: UInt64): UInt64 {
          if self.totalSupply == 0 {
              return amount
          } else {
              let balance = self.token.balanceOf(address: self)
              return (amount * UInt64(self.totalSupply)) / balance
          }
      }
  
      // Function to mint shares when the user deposits tokens
      pub fun mintShares(to: Address, shares: UInt64) {
          self.totalSupply = self.totalSupply + shares
          self.balanceOf[to] = self.balanceOf[to] + shares
      }
  
      // Function to burn shares when the user withdraws tokens
      pub fun burnShares(from: Address, shares: UInt64) {
          self.totalSupply = self.totalSupply - shares
          self.balanceOf[from] = self.balanceOf[from] - shares
      }
  
      // Function to deposit tokens and receive shares
      pub fun deposit(amount: UInt64) {
          let sender = getTransaction(signer: AuthAccount).address
  
          let shares = self.calculateShares(amount: amount)
          self.mintShares(to: sender, shares: shares)
  
          let vaultRef = getAccount(self.token).getCapability<&{FungibleToken.Balance}>(/public/fungibleTokenBalance)
                              .borrow()
                              ?? panic("Could not borrow balance reference to the Token contract")
  
          self.token.deposit(from: sender, amount: amount)
          vaultRef.deposit(amount: amount)
      }
  
      // Function to withdraw tokens using shares
      pub fun withdraw(shares: UInt64) {
          let sender = getTransaction(signer: AuthAccount).address
  
          let amount = (shares * UInt64(self.token.balanceOf(address: self))) / self.totalSupply
          self.burnShares(from: sender, shares: shares)
  
          let vaultRef = getAccount(self.token).getCapability<&{FungibleToken.Balance}>(/public/fungibleTokenBalance)
                              .borrow()
                              ?? panic("Could not borrow balance reference to the Token contract")
  
          vaultRef.withdraw(amount: amount)
          self.token.withdraw(recipient: sender, amount: amount)
      }
  }  
  `;

  return (
    <div className={styles.container}>
      <Head>
        <title>DeFi Flow</title>
        <meta name="description" content="This is a Collection of DEFI contracts like Lending pool, Vault and Staking to make the future of DEFI on Flow" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.title}>
          <Image src={title} />
        </div>
        <div className={styles.flow}>
          <Image src={flow} />
        </div>
        <p className={styles.about}>
          We have built a collection of DeFi Smart-Contracts for Flow blockchain
        </p>

        <h1 className={styles.contract}>Contracts</h1>
        <hr className={styles.hr} />
        <p id="lending" className={styles.contract}>
          Lending Contract
        </p>

        <span className={styles.features}>
          <ul>
            <li>Create a pool contract that accepts deposit from lenders and borrow money to the borrowers</li>
            <li>Lenders can lend any amount of money and earn some interest for it.</li>
            <li>User or borrower can borrow some amount of tokens (limited) , and pay back with interest for some time period.</li>
            <li>Interest is calculated according the interest rate and borrowing time peroid</li>
            <li>Lender can withdraw the amount later with extra interest earning</li>
            <li>Other functions can be called to determine the balance at any point of time , and the rewards earned</li>
          </ul>
        </span>
        <button className={styles.button}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/Mystical94/defi_flow/blob/master/contracts/Lending.cdc"
            className={styles.navlink}
          >
            View on GitHub ↗
          </a>
        </button>
        <span className={styles.code}>
          <pre className="line-numbers">
            <code className="language-jsx">{lending}</code>
          </pre>
        </span>

        <p id="staking" className={styles.contract}>
          Staking Contract
        </p>
         <span className={styles.features}>
         <ul>
            <li>Rewards user for staking their tokens in the contract</li>
            <li>User can withdraw and deposit at an point of time</li>
            <li>Tokens Earned can be withdrawed any time</li>
            <li>
              Rewards are calculated with reward rate and time period staked for
            </li>
            <li>
              The balance and reward earned can be checked at any point of time
            </li>
          </ul>
        </span>
        <button className={styles.button}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/Mystical94/defi_flow/blob/master/contracts/Staking.cdc"
            className={styles.navlink}
          >
            View on GitHub ↗
          </a>
        </button>

        <span className={styles.code}>
          <pre className="line-numbers">
            <code className="language-jsx">{staking}</code>
          </pre>
        </span>

        <p id="vault" className={styles.contract}>
          Vault Contract
        </p>
         <span className={styles.features}>
         <ul>
            <li> Sharing of Yield For the no. of shares owned</li>
            <li>User can deposit their money</li>
            <li>Some shares are minted according to the value deposited</li>
            <li>Vault generate some yield by a puropose and the value of share increases</li>
            <li>user can withdraw the amount by burning those share at any point of time .</li>
          </ul>
          
        </span>
        <button className={styles.button}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/Mystical94/defi_flow/blob/master/contracts/Vault.cdc"
            className={styles.navlink}
          >
            View on GitHub ↗
          </a>
        </button>
        <span className={styles.code}>
          <pre className="line-numbers">
            <code className="language-jsx">{vault}</code>
          </pre>
        </span>

        <p id="vault" className={styles.contract}>
          More Contracts Coming Soon...So Stay Tuned 😉
        </p>
        <p id="vault" className={styles.contract}>
          Flow with the Flow 😎
        </p>
      </main>
    </div>
  );
}
