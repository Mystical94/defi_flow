import FungibleToken from 0xTokenAddress
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
