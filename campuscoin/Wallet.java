package campuscoin;

import java.security.*;
import java.util.Base64;

public class Wallet {
    private KeyPair keyPair;

    public Wallet() throws Exception {
        KeyPairGenerator keyGen = KeyPairGenerator.getInstance("EC");
        keyGen.initialize(256); // secp256r1 curve by default
        this.keyPair = keyGen.generateKeyPair();
    }

    public PublicKey getPublicKey() {
        return keyPair.getPublic();
    }

    public PrivateKey getPrivateKey() {
        return keyPair.getPrivate();
    }

    public String getAddress() {
        // return a short address derived from public key (SHA-256 hex head)
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(keyPair.getPublic().getEncoded());
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < 20 && i < hash.length; i++) { // take first bytes for brevity
                sb.append(String.format("%02x", hash[i]));
            }
            return sb.toString();
        } catch (Exception e) {
            return Base64.getEncoder().encodeToString(keyPair.getPublic().getEncoded());
        }
    }

    public byte[] sign(byte[] data) throws Exception {
        Signature ecdsa = Signature.getInstance("SHA256withECDSA");
        ecdsa.initSign(keyPair.getPrivate());
        ecdsa.update(data);
        return ecdsa.sign();
    }

    public static boolean verifySignature(PublicKey pubKey, byte[] data, byte[] signature) throws Exception {
        Signature ecdsa = Signature.getInstance("SHA256withECDSA");
        ecdsa.initVerify(pubKey);
        ecdsa.update(data);
        return ecdsa.verify(signature);
    }
}
