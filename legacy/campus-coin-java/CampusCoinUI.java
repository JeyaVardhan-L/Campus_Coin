package campuscoin.ui;

import campuscoin.*;

import javax.swing.*;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;
import java.awt.*;
import java.awt.event.*;
import java.util.Timer;
import java.util.TimerTask;
import java.util.Random;
import java.util.HashMap;
import java.util.Base64;

public class CampusCoinUI {
    private Blockchain campus;
    private HashMap<String, Wallet> walletMap; // Maps Address -> Wallet
    private DefaultListModel<String> walletListModel; // For the JList
    
    // UI Components
    private JTextArea logArea;
    private JLabel chainStatus;
    private JPanel chartPanel;
    private double price = 50.0;
    
    private JList<String> walletList;
    private JTextArea walletDetailsArea;
    private JComboBox<String> fromWalletCombo;
    private JComboBox<String> minerWalletCombo;
    private JTextArea chainViewArea;

    // Colors
    private final Color bgColor = new Color(25, 25, 30);
    private final Color panelColor = new Color(40, 40, 45);
    private final Color textColor = new Color(240, 240, 240);
    private final Color accentColor = new Color(0, 255, 140); // Green accent
    private final Color selectionColor = new Color(0, 150, 75);

    public CampusCoinUI() throws Exception {
        // --- Setup Backend ---
        campus = new Blockchain(4, 50.0);
        walletMap = new HashMap<>();
        walletListModel = new DefaultListModel<>();

        // --- Setup Look and Feel (Dark Mode) ---
        try {
            UIManager.setLookAndFeel("javax.swing.plaf.nimbus.NimbusLookAndFeel");
            UIManager.put("control", panelColor);
            UIManager.put("nimbusBase", bgColor);
            UIManager.put("nimbusFocus", accentColor);
            UIManager.put("nimbusLightBackground", panelColor);
            UIManager.put("text", textColor);
            UIManager.put("nimbusSelectedText", Color.WHITE);
            UIManager.put("nimbusSelectionBackground", selectionColor);
            UIManager.put("List.cellRenderer.background", panelColor);
            UIManager.put("List.background", panelColor);
            UIManager.put("TextArea.background", panelColor);
            UIManager.put("TextArea.foreground", textColor);
            UIManager.put("TextField.background", panelColor);
            UIManager.put("TextField.foreground", textColor);
            UIManager.put("ComboBox.background", panelColor);
            UIManager.put("ComboBox.foreground", textColor);
            UIManager.put("TabbedPane.background", bgColor);
            UIManager.put("TabbedPane.foreground", textColor);
        } catch (Exception e) {
            log("Could not set Nimbus L&F: " + e.getMessage());
        }

        // --- Frame setup ---
        JFrame frame = new JFrame("CampusCoin Dashboard 🪙");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setSize(1000, 700);
        frame.setLocationRelativeTo(null);
        frame.setLayout(new BorderLayout());
        frame.getContentPane().setBackground(bgColor);

        // --- Tabs ---
        JTabbedPane tabs = new JTabbedPane();
        tabs.setFont(new Font("Segoe UI", Font.BOLD, 14));
        
        // Initialize combo boxes that depend on wallets
        fromWalletCombo = new JComboBox<>();
        minerWalletCombo = new JComboBox<>();

        tabs.add("Wallets", walletPanel());
        tabs.add("Send Transaction", transactionPanel());
        tabs.add("Mine", miningPanel());
        tabs.add("Blockchain", blockchainPanel());
        tabs.add("Live Stats", statsPanel());

        // --- Log area ---
        logArea = new JTextArea(8, 40);
        logArea.setEditable(false);
        logArea.setBackground(new Color(30, 30, 30));
        logArea.setForeground(accentColor);
        logArea.setFont(new Font("Consolas", Font.PLAIN, 13));
        log("Welcome to CampusCoin. Create a wallet to begin.");

        frame.add(tabs, BorderLayout.CENTER);
        frame.add(new JScrollPane(logArea), BorderLayout.SOUTH);
        frame.setVisible(true);

        startPriceUpdater();
    }

    // --- Wallets Tab ---
    private JPanel walletPanel() {
        JPanel panel = new JPanel(new BorderLayout(10, 10));
        panel.setBackground(bgColor);
        panel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

        // Button to create new wallets
        JButton createWalletBtn = new JButton("Create New Wallet");
        createWalletBtn.addActionListener(e -> createNewWallet());
        panel.add(createWalletBtn, BorderLayout.NORTH);

        // List of all created wallets
        walletList = new JList<>(walletListModel);
        walletList.setFont(new Font("Consolas", Font.PLAIN, 12));
        walletList.addListSelectionListener(e -> updateWalletDetails());
        JScrollPane listScroller = new JScrollPane(walletList);
        listScroller.setPreferredSize(new Dimension(300, 0));

        // Area to show details of selected wallet
        walletDetailsArea = new JTextArea("Select a wallet from the list to see details.");
        walletDetailsArea.setFont(new Font("Consolas", Font.PLAIN, 13));
        walletDetailsArea.setEditable(false);
        walletDetailsArea.setLineWrap(true);
        walletDetailsArea.setWrapStyleWord(true);
        JScrollPane detailsScroller = new JScrollPane(walletDetailsArea);

        // Split pane to hold list and details
        JSplitPane splitPane = new JSplitPane(JSplitPane.HORIZONTAL_SPLIT, listScroller, detailsScroller);
        splitPane.setDividerLocation(320);
        splitPane.setBorder(null);
        panel.add(splitPane, BorderLayout.CENTER);

        return panel;
    }

    // --- Transactions Tab ---
    private JPanel transactionPanel() {
        JPanel panel = new JPanel(new GridBagLayout());
        panel.setBackground(bgColor);
        panel.setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(5, 5, 5, 5);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        // Form fields
        JLabel fromLabel = new JLabel("From My Wallet:");
        fromLabel.setForeground(textColor);
        JLabel toLabel = new JLabel("To Address:");
        toLabel.setForeground(textColor);
        JLabel amtLabel = new JLabel("Amount (G₹):");
        amtLabel.setForeground(textColor);

        JTextField toField = new JTextField();
        JTextField amtField = new JTextField();
        JButton sendBtn = new JButton("Send Coins");
        
        // Layout with GridBagLayout
        gbc.gridx = 0; gbc.gridy = 0; gbc.anchor = GridBagConstraints.EAST;
        panel.add(fromLabel, gbc);
        gbc.gridx = 1; gbc.gridy = 0; gbc.weightx = 1.0; gbc.anchor = GridBagConstraints.WEST;
        panel.add(fromWalletCombo, gbc);

        gbc.gridx = 0; gbc.gridy = 1; gbc.anchor = GridBagConstraints.EAST;
        panel.add(toLabel, gbc);
        gbc.gridx = 1; gbc.gridy = 1; gbc.weightx = 1.0; gbc.anchor = GridBagConstraints.WEST;
        panel.add(toField, gbc);

        gbc.gridx = 0; gbc.gridy = 2; gbc.anchor = GridBagConstraints.EAST;
        panel.add(amtLabel, gbc);
        gbc.gridx = 1; gbc.gridy = 2; gbc.weightx = 1.0; gbc.anchor = GridBagConstraints.WEST;
        panel.add(amtField, gbc);
        
        gbc.gridx = 1; gbc.gridy = 3; gbc.weightx = 0; gbc.anchor = GridBagConstraints.EAST;
        panel.add(sendBtn, gbc);

        // Action for sending transaction
        sendBtn.addActionListener(e -> {
            try {
                String fromAddress = (String) fromWalletCombo.getSelectedItem();
                if (fromAddress == null) {
                    log("Error: No 'From' wallet selected.");
                    return;
                }
                Wallet sender = walletMap.get(fromAddress);
                String toAddr = toField.getText().trim();
                double amt = Double.parseDouble(amtField.getText().trim());

                double bal = campus.getBalanceOfAddress(sender.getAddress());
                if (bal < amt) {
                    log("Transaction Failed: Insufficient funds.");
                    return;
                }
                
                // Create and sign
                byte[] content = (sender.getAddress() + "|" + toAddr + "|" + amt).getBytes();
                byte[] sig = sender.sign(content);
                byte[] pub = sender.getPublicKey().getEncoded();
                
                // Submit
                Transaction tx = new Transaction(sender.getAddress(), toAddr, amt, sig, pub);
                campus.createTransaction(tx);
                
                log("Transaction created: " + amt + " G₹ from " + shortAddr(fromAddress) + " to " + shortAddr(toAddr));
                toField.setText("");
                amtField.setText("");
            } catch (Exception ex) {
                log("Transaction Failed: " + ex.getMessage());
            }
        });

        return panel;
    }

    // --- Mining Tab ---
    private JPanel miningPanel() {
        JPanel panel = new JPanel(new BorderLayout(10, 10));
        panel.setBackground(bgColor);
        panel.setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));

        JPanel formPanel = new JPanel(new FlowLayout());
        formPanel.setBackground(bgColor);
        JLabel mineLabel = new JLabel("Select Wallet to Receive Reward:");
        mineLabel.setForeground(textColor);
        formPanel.add(mineLabel);
        formPanel.add(minerWalletCombo);
        
        JButton mineBtn = new JButton("Mine Pending Transactions");
        mineBtn.setFont(new Font("Segoe UI", Font.BOLD, 16));
        
        chainStatus = new JLabel("Chain valid: ✅", SwingConstants.CENTER);
        chainStatus.setForeground(accentColor);
        
        panel.add(formPanel, BorderLayout.NORTH);
        panel.add(mineBtn, BorderLayout.CENTER);
        panel.add(chainStatus, BorderLayout.SOUTH);

        mineBtn.addActionListener(e -> {
            String minerAddress = (String) minerWalletCombo.getSelectedItem();
            if (minerAddress == null) {
                log("Error: No miner wallet selected.");
                return;
            }
            
            log("Mining started for: " + shortAddr(minerAddress) + "...");
            
            // Run mining in a separate thread to avoid freezing the UI
            new Thread(() -> {
                campus.minePendingTransactions(minerAddress);
                SwingUtilities.invokeLater(() -> {
                    log("Mining complete! Reward sent to " + shortAddr(minerAddress));
                    boolean isValid = campus.isChainValid();
                    chainStatus.setText("Chain valid: " + (isValid ? "✅" : "❌"));
                    chainStatus.setForeground(isValid ? accentColor : Color.RED);
                    updateWalletDetails(); // Update balance
                    updateChainView(); // Update blockchain display
                });
            }).start();
        });

        return panel;
    }

    // --- Blockchain Viewer Tab (New) ---
    private JPanel blockchainPanel() {
        JPanel panel = new JPanel(new BorderLayout(10, 10));
        panel.setBackground(bgColor);
        panel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));
        
        JButton refreshBtn = new JButton("Refresh Chain View");
        refreshBtn.addActionListener(e -> updateChainView());
        panel.add(refreshBtn, BorderLayout.NORTH);
        
        chainViewArea = new JTextArea();
        chainViewArea.setFont(new Font("Consolas", Font.PLAIN, 12));
        chainViewArea.setEditable(false);
        panel.add(new JScrollPane(chainViewArea), BorderLayout.CENTER);
        
        updateChainView(); // Initial load
        return panel;
    }

    // --- Stats Tab (Same as original) ---
    private JPanel statsPanel() {
        chartPanel = new JPanel() {
            protected void paintComponent(Graphics g) {
                super.paintComponent(g);
                Graphics2D g2 = (Graphics2D) g;
                g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                
                g2.setColor(accentColor);
                g2.setFont(new Font("Segoe UI", Font.BOLD, 18));
                g2.drawString("CampusCoin Price: " + String.format("%.2f G₹", price), 20, 30);
                
                int baseY = 200;
                g2.setColor(textColor);
                g2.drawLine(30, baseY, getWidth() - 30, baseY); // X-axis
                
                g2.setColor(accentColor);
                g2.setStroke(new BasicStroke(2));
                for (int i = 0; i < 20; i++) {
                    int x1 = 30 + i * ((getWidth()-60)/20);
                    int y1 = (int) (baseY - (Math.sin(i / 2.0) * 20 + price / 2));
                    int x2 = 30 + (i + 1) * ((getWidth()-60)/20);
                    int y2 = (int) (baseY - (Math.sin((i + 1) / 2.0) * 20 + price / 2));
                    g2.drawLine(x1, y1, x2, y2);
                }
            }
        };
        chartPanel.setBackground(bgColor);
        return chartPanel;
    }

    // --- Helper Methods ---

    private void createNewWallet() {
        try {
            Wallet w = new Wallet();
            String address = w.getAddress();
            walletMap.put(address, w);
            walletListModel.addElement(address);
            fromWalletCombo.addItem(address);
            minerWalletCombo.addItem(address);
            
            walletList.setSelectedValue(address, true);
            log("Wallet created: " + address);
        } catch (Exception ex) {
            log("Error creating wallet: " + ex.getMessage());
        }
    }
    
    private void updateWalletDetails() {
        String selectedAddress = walletList.getSelectedValue();
        if (selectedAddress == null) {
            walletDetailsArea.setText("Select a wallet from the list to see details.");
            return;
        }
        
        Wallet w = walletMap.get(selectedAddress);
        if (w == null) return;
        
        double balance = campus.getBalanceOfAddress(w.getAddress());
        String pubKey = Base64.getEncoder().encodeToString(w.getPublicKey().getEncoded());
        String privKey = Base64.getEncoder().encodeToString(w.getPrivateKey().getEncoded());
        
        StringBuilder sb = new StringBuilder();
        sb.append("ADDRESS:\n").append(selectedAddress).append("\n\n");
        sb.append("BALANCE:\n").append(String.format("%.2f G₹", balance)).append("\n\n");
        sb.append("PUBLIC KEY (Base64):\n").append(pubKey).append("\n\n");
        sb.append("--- WARNING: DO NOT SHARE ---").append("\n");
        sb.append("PRIVATE KEY (Base64):\n").append(privKey).append("\n");
        
        walletDetailsArea.setText(sb.toString());
        walletDetailsArea.setCaretPosition(0); // Scroll to top
    }

    private void updateChainView() {
        StringBuilder sb = new StringBuilder();
        int idx = 0;
        for (Block b : campus.chain) {
            sb.append("---- Block ").append(idx).append(" ----\n");
            sb.append("Hash: ").append(b.hash).append("\n");
            sb.append("Prev: ").append(b.previousHash).append("\n");
            sb.append("Nonce: ").append(b.nonce).append("\n");
            sb.append("Transactions (").append(b.transactions.size()).append("):\n");
            for (Transaction t : b.transactions) {
                sb.append("  ").append(t).append("\n");
            }
            sb.append("\n");
            idx++;
        }
        chainViewArea.setText(sb.toString());
        chainViewArea.setCaretPosition(0);
    }
    
    private void log(String msg) {
        logArea.append("• " + msg + "\n");
        logArea.setCaretPosition(logArea.getDocument().getLength());
    }
    
    private String shortAddr(String fullAddr) {
        return fullAddr.substring(0, 6) + "..." + fullAddr.substring(fullAddr.length() - 4);
    }

    private void startPriceUpdater() {
        Timer t = new Timer();
        Random r = new Random();
        t.schedule(new TimerTask() {
            public void run() {
                price += (r.nextDouble() - 0.5) * 2;
                if (price < 10) price = 10;
                if (chartPanel != null) chartPanel.repaint();
            }
        }, 1000, 2000);
    }

    public static void main(String[] args) throws Exception {
        // We set the L&F inside the constructor now
        new CampusCoinUI();
    }
}