package org.example.course.bankingsystem.service;

import jakarta.transaction.Transactional;
import org.example.course.bankingsystem.entity.*;
import org.example.course.bankingsystem.repository.BankAccountRepository;
import org.example.course.bankingsystem.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

@Service
public class AccountService {
    private static final Logger logger = LoggerFactory.getLogger(AccountService.class);

    private final BankAccountRepository accounts;
    private final UserRepository users;
    private final IbanGenerator iban;

    public AccountService(BankAccountRepository accounts, UserRepository users, IbanGenerator iban) {
        this.accounts = accounts;
        this.users = users;
        this.iban = iban;
    }

    public BankAccount requestCurrent(String clientUsername, String currency) {
        logger.info("Requesting current account for client={} currency={}", clientUsername, currency);
        User client = users.findByUsername(clientUsername)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Client not found"));
        if (currency == null || currency.isBlank())
            throw new ApiException(HttpStatus.BAD_REQUEST, "Currency is required");

        BankAccount acc = new BankAccount();
        acc.setOwner(client);
        acc.setCurrency(currency.trim().toUpperCase(Locale.ROOT));
        acc.setBalance(BigDecimal.ZERO);
        acc.setAccountType(AccountType.CURRENT);
        acc.setInterestPercent(BigDecimal.ZERO);
        acc.setStatus(RequestStatus.PENDING);
        acc.setIban(iban.generateIban());
        return accounts.save(acc);
    }

    @Transactional
    public BankAccount approveCurrent(Long accountId) {
        logger.info("Approving current account id={}", accountId);
        BankAccount acc = accounts.findById(accountId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Account not found"));
        if (acc.getAccountType() != AccountType.CURRENT)
            throw new ApiException(HttpStatus.BAD_REQUEST, "Only CURRENT accounts can be approved");
        acc.setStatus(RequestStatus.ACTIVE);
        return acc;
    }

    @Transactional
    public BankAccount reject(Long accountId) {
        logger.info("Rejecting account id={}", accountId);
        BankAccount acc = accounts.findById(accountId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Account not found"));
        acc.setStatus(RequestStatus.REJECTED);
        return acc;
    }

    public List<BankAccount> clientAccounts(String clientUsername) {
        logger.info("Fetching accounts for client={}", clientUsername);
        User client = users.findByUsername(clientUsername)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Client not found"));
        return accounts.findByOwner(client).stream()
                .sorted(Comparator.comparing(BankAccount::getId).reversed())
                .toList();
    }

    public List<BankAccount> allAccounts() {
        logger.info("Fetching all accounts");
        return accounts.findAll().stream()
                .sorted(Comparator.comparing(BankAccount::getId).reversed())
                .toList();
    }
}
