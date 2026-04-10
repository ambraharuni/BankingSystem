package org.example.course.bankingsystem.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "cards")
public class Card {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CardType cardType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status = RequestStatus.PENDING;


    @Column(precision = 19, scale = 2)
    private BigDecimal monthlyIncome;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private User owner;


    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "linked_account_id", unique = true)
    private BankAccount linkedAccount;


    public Long getId() { return id; }
    public CardType getCardType() { return cardType; }
    public RequestStatus getStatus() { return status; }
    public BigDecimal getMonthlyIncome() { return monthlyIncome; }
    public User getOwner() { return owner; }
    public BankAccount getLinkedAccount() { return linkedAccount; }

    public void setId(Long id) { this.id = id; }
    public void setCardType(CardType cardType) { this.cardType = cardType; }
    public void setStatus(RequestStatus status) { this.status = status; }
    public void setMonthlyIncome(BigDecimal monthlyIncome) { this.monthlyIncome = monthlyIncome; }
    public void setOwner(User owner) { this.owner = owner; }
    public void setLinkedAccount(BankAccount linkedAccount) { this.linkedAccount = linkedAccount; }
}
