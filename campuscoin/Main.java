package campuscoin;

import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) throws Exception {
        Scanner sc = new Scanner(System.in);
        Blockchain campus = new Blockchain(4, 50.0); // difficulty 4 leading zeros, reward 50
        System.out.println("=== CampusCoin (G-Coin) Simulator ===");

        Wallet w1 = null, w2 = null;
        // simple map-free: store two wallets for demo. You can create more.
        while (true) {
            System.out.println("\nMenu:");
            System.out.println("1) Create new wallet");
            System.out.println("2) Show wallet addresses");
            System.out.println("3) Create & sign transaction");
            System.out.println("4) Mine pending transactions");
            System.out.println("5) Show balances");
            System.out.println("6) Show blockchain");
            System.out.println("7) Validate chain");
            System.out.println("8) Exit");
            System.out.print("choice> ");
            int ch = Integer.parseInt(sc.nextLine().trim());

            if (ch == 1) {
                Wallet w = new Wallet();
                System.out.println("Created wallet address: " + w.getAddress());
                if (w1 == null) { w1 = w; System.out.println("Stored as wallet1"); }
                else if (w2 == null) { w2 = w; System.out.println("Stored as wallet2"); }
                else System.out.println("You already have wallet1 & wallet2 stored. Restart app to reset or expand code.");
            } else if (ch == 2) {
                System.out.println("Wallet1: " + (w1 == null ? "(none)" : w1.getAddress()));
                System.out.println("Wallet2: " + (w2 == null ? "(none)" : w2.getAddress()));
            } else if (ch == 3) {
                System.out.print("From (1 or 2): ");
                int from = Integer.parseInt(sc.nextLine().trim());
                Wallet sender = (from == 1 ? w1 : w2);
                if (sender == null) { System.out.println("Set up that wallet first."); continue; }
                System.out.print("To Address (paste receiver address): ");
                String to = sc.nextLine().trim();
                System.out.print("Amount: ");
                double amt = Double.parseDouble(sc.nextLine().trim());
                double bal = campus.getBalanceOfAddress(sender.getAddress());
                System.out.println("Sender balance approx: " + bal);
                if (bal < amt) { System.out.println("Insufficient funds (note: reward only after mining)."); continue; }
                byte[] content = (sender.getAddress() + "|" + to + "|" + Double.toString(amt)).getBytes();
                byte[] sig = sender.sign(content);
                byte[] pubBytes = sender.getPublicKey().getEncoded();
                Transaction tx = new Transaction(sender.getAddress(), to, amt, sig, pubBytes);
                campus.createTransaction(tx);
                System.out.println("Transaction created & added to pending. Sig: " + tx.shortSig());
            } else if (ch == 4) {
                System.out.print("Miner address to receive reward (paste address): ");
                String minerAddr = sc.nextLine().trim();
                System.out.println("Mining pending transactions... (this will show mined block hash)");
                campus.minePendingTransactions(minerAddr);
            } else if (ch == 5) {
                System.out.println("Wallet1: " + (w1 == null ? "(none)" : campus.getBalanceOfAddress(w1.getAddress())));
                System.out.println("Wallet2: " + (w2 == null ? "(none)" : campus.getBalanceOfAddress(w2.getAddress())));
            } else if (ch == 6) {
                System.out.println("Blockchain:");
                int idx = 0;
                for (Block b : campus.chain) {
                    System.out.println("---- Block " + idx + " ----");
                    System.out.println("Hash: " + b.hash);
                    System.out.println("Prev: " + b.previousHash);
                    System.out.println("Tx count: " + b.transactions.size());
                    for (Transaction t : b.transactions) {
                        System.out.println("  " + t);
                    }
                    idx++;
                }
            } else if (ch == 7) {
                System.out.println("Chain valid? " + campus.isChainValid());
            } else if (ch == 8) {
                System.out.println("Exiting.");
                break;
            } else {
                System.out.println("Unknown choice.");
            }
        }
        sc.close();
    }
}
