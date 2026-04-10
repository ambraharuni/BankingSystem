package org.example.course.bankingsystem.entity;
import jakarta.persistence.*;
import java.math.BigDecimal;
@Entity
@Table(name = "bank_accounts")
public class BankAccount {
    @Id @GeneratedValue(strategy =GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true, nullable=false)
    private String iban;
    @Column(nullable= false)
    private String currency;
    @Column(nullable=false ,precision=19, scale = 2)
    private BigDecimal balance=BigDecimal.ZERO;


    @Enumerated(EnumType.STRING)
    @Column(nullable= false)
    private AccountType accountType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status= RequestStatus.PENDING;

    @Column(nullable = false,precision = 5,scale=2)
    private BigDecimal interestPercent = BigDecimal.ZERO;

    @ManyToOne(optional = false , fetch=FetchType.LAZY)
    private User owner;

    @OneToOne(mappedBy = "linkedAccount" , fetch = FetchType.LAZY)
    private Card card;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIban() {
        return iban;
    }

    public void setIban(String iban) {
        this.iban = iban;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public AccountType getAccountType() {
        return accountType;
    }

    public void setAccountType(AccountType accountType) {
        this.accountType = accountType;
    }

    public RequestStatus getStatus() {
        return status;
    }

    public void setStatus(RequestStatus status) {
        this.status = status;
    }

    public BigDecimal getInterestPercent() {
        return interestPercent;
    }

    public void setInterestPercent(BigDecimal interestPercent) {
        this.interestPercent = interestPercent;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public Card getCard() {
        return card;
    }

    public void setCard(Card card) {
        this.card = card;
    }
}
