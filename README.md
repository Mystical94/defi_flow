# defi Flow

A collection of three DEFI contracts, namely Staking, Lending Pool, and Vault, which are required as the first step in developing a DEFI protocol.

### Lending Pool Contract

Create a pool contract that accepts deposit from lenders and borrow money to the borrowers

- Lenders can lend any amount of money and earn some interest for it.
- User or borrower can borrow some amount of tokens (limited) , and pay back with interest for some time period.
- Interest is calculated according the interest rate and borrowing time peroid
- Lender can withdraw the amount later with extra interest earning
- Other functions can be called to determine the balance at any point of time , and the rewards earned

### Vault Contract

Sharing of Yield For the no. of shares owned

- user can deposit their money
- Some shares are minted according to the value deposited
- Vault generate some yield by a puropose and the value of share increases
- user can withdraw the amount by burning those share at any point of time .

### Staking Contract

Rewards user for staking their tokens in the contract

- User can withdraw and deposit at an point of time
- Tokens Earned can be withdrawed any time
- Rewards are calculated with reward rate and time period staked for
- The balance and reward earned can be checked at any point of time

### 😎 Inspiration
- Flow is a blockchain focused on mainstream adoption, and we are developing DEFI contracts to elevate Flow's mission to the next level of DEFI. We hope to make this the best library for DEFI contracts on the Flow Blockchain.

### 📝 What it does
- The project aims to address the need for DEFI (Decentralized Finance) capabilities on the Flow blockchain platform. DEFI has gained significant popularity in the blockchain space, offering various financial services such as lending, borrowing, staking, and more, without the need for intermediaries.
- The importance of tackling this problem lies in the growing demand for DEFI services and the potential impact it can have on the blockchain ecosystem. DEFI provides financial inclusivity, accessibility, and transparency to individuals worldwide, empowering them to participate in decentralized financial activities.
- By developing a collection of DEFI contracts, including a lending pool, a vault, and staking, the project aims to provide the foundation for a robust DEFI ecosystem on Flow. This not only benefits existing developers and users but also attracts new participants to the Flow network, increasing its adoption and expanding its use cases.

### 💻 How we built it
- We used Cadence language to build the Smart Contracts. The frontend website is built with Next.js , CSS /HTML and Javascript to showcase our contracts to the users and devs building on Flow. New contracts will be added in the future.

### ⚔ Challenges we ran into
- To learn more about the Flow network and its applications. We encountered trouble establishing the contracts for Flow. We had to spend a lot of time on documentation because the Flow network was new for us to work with and get comfortable with.

### 💪 Accomplishments that we're proud of
- We are delighted to contribute to the Flow's mission for developing mainstream applications.

### 📖 What we learned
- Familiarity with the Flow Network: The project provided an opportunity to learn about the Flow blockchain network and its unique features. By working with the Flow platform, we gained a deeper understanding of its architecture, consensus mechanism, and how smart contracts are deployed and executed.
-Cadence Smart Contract Development: We learned how to develop smart contracts using the Cadence programming language specifically designed for the Flow network. 
- Documentation and Research: Given that the Flow network was new to the team, we had to invest time in researching and studying the available documentation. This learning process improved our ability to understand and work effectively with new blockchain platforms or technologies in the future.
- DEFI Protocols and Use Cases: Developing DEFI contracts for the Flow network exposed us to various DEFI protocols, such as lending pools, vaults, and staking mechanisms. They deepened our knowledge of how these protocols function and their importance in the DEFI ecosystem.

### 🌟 What's next for defi Flow
- Expansion of Contract Collection: The next step for DEFI Flow would be to continue adding more contracts to the existing collection. This expansion can include additional DEFI protocols such as decentralized exchanges, yield farming, or liquidity mining. By broadening the range of available contracts, DEFI Flow can cater to a wider array of use cases and attract more developers and users to the platform.


### 💻 Local Development

- Clone the repository

- Then move into the frontend folder

```sh
cd frontend
```

- install dependencies using **yarn** or **npm**

```sh
npm install

or

yarn
```

- start the development server
```sh
npm run dev

or

yarn dev
```

- build with production mode
```sh
npm run build

or

yarn build
```
