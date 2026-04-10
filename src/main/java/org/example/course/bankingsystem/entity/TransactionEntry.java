package org.example.course.bankingsystem.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "transactions")
public class TransactionEntry {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private BankAccount bankAccount;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false)
    private String currency;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TxnType type;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    @Column(nullable = false)
    private UUID transferRef;

    @Column(nullable = false)
    private String counterpartyIban;

    public Long getId() { return id; }
    public BankAccount getBankAccount() { return bankAccount; }
    public BigDecimal getAmount() { return amount; }
    public String getCurrency() { return currency; }
    public TxnType getType() { return type; }
    public Instant getCreatedAt() { return createdAt; }
    public UUID getTransferRef() { return transferRef; }
    public String getCounterpartyIban() { return counterpartyIban; }

    public void setId(Long id) { this.id = id; }
    public void setBankAccount(BankAccount bankAccount) { this.bankAccount = bankAccount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public void setCurrency(String currency) { this.currency = currency; }
    public void setType(TxnType type) { this.type = type; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public void setTransferRef(UUID transferRef) { this.transferRef = transferRef; }
    public void setCounterpartyIban(String counterpartyIban) { this.counterpartyIban = counterpartyIban; }
}
