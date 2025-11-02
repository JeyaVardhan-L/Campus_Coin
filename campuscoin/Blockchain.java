package campuscoin;

import java.security.*;
import java.security.spec.*;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;

public class Blockchain {
    public ArrayList<Block> chain;
    public int difficulty;
    public ArrayList<Transaction> pendingTransactions;
    public double miningReward; // reward given to miner

    public Blockchain(int difficulty, double reward) {
        this.chain = new ArrayList<>();
        this.difficulty = difficulty;
        this.pendingTransactions = new ArrayList<>();
        this.miningReward = reward;
        // genesis:
        Block genesis = new Block("0");
        genesis.hash = genesis.calculateHash();
        chain.add(genesis);
    }

    public Block getLatestBlock() {
        return chain.get(chain.size() - 1);
    }

    public void createTransaction(Transaction tx) {
        pendingTransactions.add(tx);
    }

    public void minePendingTransactions(String minerAddress) {
        Block block = new Block(getLatestBlock().hash);
        for (Transaction t : pendingTransactions) block.addTransaction(t);
        block.mineBlock(difficulty);
        chain.add(block);
        // reward to miner as a transaction from "SYSTEM"
        Transaction rewardTx = new Transaction("SYSTEM", minerAddress, miningReward, new byte[0], new byte[0]);
        pendingTransactions = new ArrayList<>();
        pendingTransactions.add(rewardTx);
    }

    // compute balance by scanning all transactions in chain + pending (optional)
    public double getBalanceOfAddress(String address) {
        double balance = 0.0;
        for (Block b : chain) {
            for (Transaction t : b.transactions) {
                if (t.senderAddress.equals(address)) balance -= t.amount;
                if (t.receiverAddress.equals(address)) balance += t.amount;
            }
        }
        for (Transaction t : pendingTransactions) {
            if (t.senderAddress.equals(address)) balance -= t.amount;
            if (t.receiverAddress.equals(address)) balance += t.amount;
        }
        return balance;
    }

    public boolean isChainValid() {
        // Validate chain hashes and transaction signatures & balances
        for (int i = 1; i < chain.size(); i++) {
            Block current = chain.get(i);
            Block previous = chain.get(i - 1);
            if (!current.hash.equals(current.calculateHash())) {
                System.out.println("Invalid hash at block " + i);
                return false;
            }
            if (!current.previousHash.equals(previous.hash)) {
                System.out.println("Invalid previous hash at block " + i);
                return false;
            }
            // validate each transaction signature
            for (Transaction t : current.transactions) {
                if (t.senderAddress.equals("SYSTEM")) continue; // skip system reward
                try {
                    KeyFactory kf = KeyFactory.getInstance("EC");
                    X509EncodedKeySpec spec = new X509EncodedKeySpec(t.senderPublicKeyBytes);
                    PublicKey pub = kf.generatePublic(spec);
                    boolean ok = Wallet.verifySignature(pub, t.getContentBytes(), t.signature);
                    if (!ok) {
                        System.out.println("Invalid signature for tx: " + t);
                        return false;
                    }
                } catch (Exception e) {
                    System.out.println("Error verifying signature: " + e.getMessage());
                    return false;
                }
            }
        }
        return true;
    }
}
