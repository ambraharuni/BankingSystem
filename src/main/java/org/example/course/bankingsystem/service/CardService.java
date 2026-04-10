package org.example.course.bankingsystem.service;

import jakarta.transaction.Transactional;
import org.example.course.bankingsystem.entity.*;
import org.example.course.bankingsystem.repository.BankAccountRepository;
import org.example.course.bankingsystem.repository.CardRepository;
import org.example.course.bankingsystem.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class CardService {
    private static final Logger logger = LoggerFactory.getLogger(CardService.class);

    private final CardRepository cards;
    private final BankAccountRepository accounts;
    private final UserRepository users;
    private final IbanGenerator iban;

    public CardService(CardRepository cards, BankAccountRepository accounts, UserRepository users, IbanGenerator iban) {
        this.cards = cards;
        this.accounts = accounts;
        this.users = users;
        this.iban = iban;
    }

    public Card requestDebit(String clientUsername, Long currentAccountId) {
        logger.info("Client {} requests debit card for account {}", clientUsername, currentAccountId);
        User client = users.findByUsername(clientUsername)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Client not found"));
        BankAccount acc = accounts.findById(currentAccountId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Account not found"));

        if (!acc.getOwner().getId().equals(client.getId()))
            throw new ApiException(HttpStatus.FORBIDDEN, "Not your account");
        if (acc.getStatus() != RequestStatus.ACTIVE || acc.getAccountType() != AccountType.CURRENT)
            throw new ApiException(HttpStatus.BAD_REQUEST, "Need ACTIVE CURRENT account");
        if (acc.getCard() != null)
            throw new ApiException(HttpStatus.BAD_REQUEST, "Account already has a card");

        Card c = new Card();
        c.setOwner(client);
        c.setCardType(CardType.DEBIT);
        c.setStatus(RequestStatus.ACTIVE); // debit direkt ACTIVE (thjeshtë për detyrë)
        c.setLinkedAccount(acc);
        return cards.save(c);
    }

    public Card requestCredit(String clientUsername, BigDecimal income) {
        logger.info("Client {} requests credit card with income={}", clientUsername, income);
        User client = users.findByUsername(clientUsername)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Client not found"));

        Card c = new Card();
        c.setOwner(client);
        c.setCardType(CardType.CREDIT);
        c.setMonthlyIncome(income);

        if (income == null || income.compareTo(new BigDecimal("500")) < 0) {
            c.setStatus(RequestStatus.REJECTED);
            return cards.save(c);
        }

        c.setStatus(RequestStatus.PENDING);
        return cards.save(c);
    }


    @Transactional
    public Card approveCredit(Long cardId, BigDecimal interestPercent) {
        logger.info("Approving credit card id={} interestPercent={}", cardId, interestPercent);
        Card c = cards.findById(cardId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Card not found"));
        if (c.getCardType() != CardType.CREDIT)
            throw new ApiException(HttpStatus.BAD_REQUEST, "Not a credit card");
        if (c.getStatus() != RequestStatus.PENDING)
            throw new ApiException(HttpStatus.BAD_REQUEST, "Credit card must be PENDING");

        BankAccount tech = new BankAccount();
        tech.setOwner(c.getOwner());
        tech.setCurrency("EUR");
        tech.setBalance(BigDecimal.ZERO);
        tech.setAccountType(AccountType.TECHNICAL);
        tech.setStatus(RequestStatus.ACTIVE);
        tech.setIban(iban.generateIban());
        tech.setInterestPercent(interestPercent == null ? BigDecimal.ZERO : interestPercent);

        accounts.save(tech);

        c.setLinkedAccount(tech);
        c.setStatus(RequestStatus.ACTIVE);
        return c;
    }

    public List<Card> clientCards(String clientUsername) {
        logger.info("Fetching cards for client={}", clientUsername);
        User client = users.findByUsername(clientUsername)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Client not found"));
        return cards.findByOwner(client);
    }

    public List<Card> allCards() {
        logger.info("Fetching all cards");
        return cards.findAll();
    }
}