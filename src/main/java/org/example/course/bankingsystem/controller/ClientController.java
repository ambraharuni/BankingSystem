package org.example.course.bankingsystem.controller;

import org.example.course.bankingsystem.entity.*;
import org.example.course.bankingsystem.service.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/client")
public class ClientController {
    private static final Logger logger = LoggerFactory.getLogger(ClientController.class);

    private final AccountService accountService;
    private final CardService cardService;
    private final TransactionService txnService;

    public ClientController(AccountService accountService, CardService cardService, TransactionService txnService) {
        this.accountService = accountService;
        this.cardService = cardService;
        this.txnService = txnService;
    }

    private String me(Authentication auth) { return auth.getName(); }

    @GetMapping("/accounts")
    public List<BankAccount> myAccounts(Authentication auth) {
        logger.info("Client {} fetches accounts", me(auth));
        return accountService.clientAccounts(me(auth));
    }

    @GetMapping("/cards")
    public List<Card> myCards(Authentication auth) {
        logger.info("Client {} fetches cards", me(auth));
        return cardService.clientCards(me(auth));
    }

    @GetMapping("/transactions")
    public List<TransactionEntry> myTxns(Authentication auth) {
        logger.info("Client {} fetches transactions", me(auth));
        return txnService.clientTransactions(me(auth));
    }

    @PostMapping("/accounts/request")
    public BankAccount requestCurrent(Authentication auth, @RequestBody RequestCurrentAccountDto dto) {
        logger.info("Client {} requests current account with currency={}", me(auth), dto.currency);
        return accountService.requestCurrent(me(auth), dto.currency);
    }

    @PostMapping("/cards/debit/request")
    public Card requestDebit(Authentication auth, @RequestBody DebitCardRequestDto dto) {
        logger.info("Client {} requests debit card for accountId={}", me(auth), dto.currentAccountId);
        return cardService.requestDebit(me(auth), dto.currentAccountId);
    }

    @PostMapping("/cards/credit/request")
    public Card requestCredit(Authentication auth, @RequestBody CreditCardRequestDto dto) {
        logger.info("Client {} requests credit card with income={}", me(auth), dto.monthlyIncome);
        return cardService.requestCredit(me(auth), dto.monthlyIncome);
    }

    @PostMapping("/transactions/transfer")
    public Map<String, Object> transfer(Authentication auth, @RequestBody TransferRequestDto dto) {
        logger.info("Client {} transfers {} from account {} to {}", me(auth), dto.amount, dto.fromAccountId, dto.toIban);
        UUID ref = txnService.transfer(me(auth), dto.fromAccountId, dto.toIban, dto.amount);
        logger.info("Client {} transfer completed ref={}", me(auth), ref);
        return Map.of("transferRef", ref.toString());
    }
}