package campuscoin;

import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.Base64;

public class Block {
    public final long timestamp;
    public final ArrayList<Transaction> transactions;
    public final String previousHash;
    public long nonce;
    public String hash;

    public Block(String previousHash) {
        this.timestamp = System.currentTimeMillis();
        this.transactions = new ArrayList<>();
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = calculateHash();
    }

    public void addTransaction(Transaction tx) {
        transactions.add(tx);
    }

    public String calculateHash() {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            StringBuilder sb = new StringBuilder();
            sb.append(previousHash == null ? "0" : previousHash);
            sb.append(Long.toString(timestamp));
            sb.append(Long.toString(nonce));
            for (Transaction t : transactions) {
                sb.append(t.senderAddress).append(t.receiverAddress).append(t.amount).append(Base64.getEncoder().encodeToString(t.signature));
            }
            byte[] h = digest.digest(sb.toString().getBytes("UTF-8"));
            StringBuilder hex = new StringBuilder();
            for (byte b : h) hex.append(String.format("%02x", b));
            return hex.toString();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void mineBlock(int difficulty) {
        String target = new String(new char[difficulty]).replace('\0', '0');
        while (!hash.substring(0, difficulty).equals(target)) {
            nonce++;
            hash = calculateHash();
        }
        System.out.println("Mined block: " + hash + " (nonce=" + nonce + ")");
    }
}
