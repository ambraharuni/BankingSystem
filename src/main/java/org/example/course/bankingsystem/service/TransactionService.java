package org.example.course.bankingsystem.service;

import jakarta.transaction.Transactional;
import org.example.course.bankingsystem.entity.*;
import org.example.course.bankingsystem.repository.BankAccountRepository;
import org.example.course.bankingsystem.repository.TransactionRepository;
import org.example.course.bankingsystem.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
public class TransactionService {
    private static final Logger logger = LoggerFactory.getLogger(TransactionService.class);

    private final TransactionRepository txns;
    private final BankAccountRepository accounts;
    private final UserRepository users;

    public TransactionService(TransactionRepository txns, BankAccountRepository accounts, UserRepository users) {
        this.txns = txns;
        this.accounts = accounts;
        this.users = users;
    }

    @Transactional
    public UUID transfer(String clientUsername, Long fromAccountId, String toIban, BigDecimal amount) {
        logger.info("Transfer request client={} fromAccount={} toIban={} amount={}", clientUsername, fromAccountId, toIban, amount);
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0)
            throw new ApiException(HttpStatus.BAD_REQUEST, "Amount must be > 0");

        User client = users.findByUsername(clientUsername)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Client not found"));

        BankAccount from = accounts.findById(fromAccountId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "From account not found"));
        if (!from.getOwner().getId().equals(client.getId()))
            throw new ApiException(HttpStatus.FORBIDDEN, "Not your account");
        if (from.getStatus() != RequestStatus.ACTIVE)
            throw new ApiException(HttpStatus.BAD_REQUEST, "From account must be ACTIVE");

        BankAccount to = accounts.findByIban(toIban)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Destination IBAN not found"));
        if (to.getStatus() != RequestStatus.ACTIVE)
            throw new ApiException(HttpStatus.BAD_REQUEST, "Destination account must be ACTIVE");
        if (!from.getCurrency().equalsIgnoreCase(to.getCurrency()))
            throw new ApiException(HttpStatus.BAD_REQUEST, "Cross-currency transfers are not supported");
        if (from.getIban().equalsIgnoreCase(to.getIban()))
            throw new ApiException(HttpStatus.BAD_REQUEST, "Source and destination accounts must differ");


        BigDecimal debitTotal = amount;

        if (from.getAccountType() == AccountType.TECHNICAL) {
            BigDecimal p = from.getInterestPercent() == null ? BigDecimal.ZERO : from.getInterestPercent();
            BigDecimal interest = amount.multiply(p).divide(new BigDecimal("100"));
            debitTotal = amount.add(interest);

        } else {

            if (from.getBalance().compareTo(amount) < 0)
                throw new ApiException(HttpStatus.BAD_REQUEST, "Insufficient funds (CURRENT)");
        }

        from.setBalance(from.getBalance().subtract(debitTotal));
        to.setBalance(to.getBalance().add(amount));

        UUID ref = UUID.randomUUID();

        TransactionEntry debit = new TransactionEntry();
        debit.setBankAccount(from);
        debit.setAmount(debitTotal);
        debit.setCurrency(from.getCurrency());
        debit.setType(TxnType.DEBIT);
        debit.setTransferRef(ref);
        debit.setCounterpartyIban(to.getIban());

        TransactionEntry credit = new TransactionEntry();
        credit.setBankAccount(to);
        credit.setAmount(amount);
        credit.setCurrency(to.getCurrency());
        credit.setType(TxnType.CREDIT);
        credit.setTransferRef(ref);
        credit.setCounterpartyIban(from.getIban());

        txns.save(debit);
        txns.save(credit);

        logger.info("Transfer completed client={} ref={}", clientUsername, ref);
        return ref;
    }

    public List<TransactionEntry> allTransactions() {
        logger.info("Fetching all transactions");
        return txns.findAll().stream()
                .sorted(Comparator.comparing(TransactionEntry::getCreatedAt).reversed())
                .toList();
    }

    public List<TransactionEntry> clientTransactions(String clientUsername) {
        logger.info("Fetching transactions for client={}", clientUsername);
        User client = users.findByUsername(clientUsername)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Client not found"));
        return accounts.findByOwner(client).stream()
                .flatMap(a -> txns.findByBankAccount(a).stream())
                .sorted(Comparator.comparing(TransactionEntry::getCreatedAt).reversed())
                .toList();
    }
}
