package org.example.course.bankingsystem.controller;
import org.example.course.bankingsystem.dto.AccountSummaryDto;
import org.example.course.bankingsystem.dto.CardSummaryDto;
import org.example.course.bankingsystem.dto.TellerDashboardDto;
import org.example.course.bankingsystem.dto.TellerMetricsDto;
import org.example.course.bankingsystem.dto.TransactionSummaryDto;
import org.example.course.bankingsystem.dto.UserSummaryDto;
import org.example.course.bankingsystem.entity.RequestStatus;
import org.example.course.bankingsystem.entity.Role;
import org.example.course.bankingsystem.service.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/teller")
public class TellerController {
    private final UserService userService;
    private final AccountService accountService;
    private final CardService cardService;
    private final TransactionService txnService;
    private final DashboardMapper mapper;

    public TellerController(UserService userService, AccountService accountService, CardService cardService, TransactionService txnService, DashboardMapper mapper) {
        this.userService = userService;
        this.accountService = accountService;
        this.cardService = cardService;
        this.txnService = txnService;
        this.mapper = mapper;
    }

    @GetMapping("/dashboard")
    public TellerDashboardDto dashboard() {
        List<UserSummaryDto> clients = userService.list(Role.CLIENT).stream()
                .map(mapper::toUserSummary)
                .toList();
        List<AccountSummaryDto> accounts = accountService.allAccounts().stream()
                .map(mapper::toAccountSummary)
                .toList();
        List<CardSummaryDto> cards = cardService.allCards().stream()
                .map(mapper::toCardSummary)
                .toList();
        List<TransactionSummaryDto> transactions = txnService.allTransactions().stream()
                .map(mapper::toTransactionSummary)
                .toList();

        TellerMetricsDto metrics = new TellerMetricsDto(
                clients.size(),
                accounts.size(),
                accounts.stream().filter(a -> RequestStatus.PENDING.name().equals(a.status())).count(),
                cards.size(),
                cards.stream().filter(c -> RequestStatus.PENDING.name().equals(c.status())).count(),
                transactions.size()
        );

        return new TellerDashboardDto(
                metrics,
                clients,
                accounts,
                accounts.stream().filter(a -> RequestStatus.PENDING.name().equals(a.status())).toList(),
                cards,
                cards.stream().filter(c -> RequestStatus.PENDING.name().equals(c.status())).toList(),
                transactions.stream().limit(12).toList()
        );
    }

    @PostMapping("/clients")
    public UserSummaryDto createClient(@RequestBody CreateUserRequest req) {
        return mapper.toUserSummary(userService.createClient(
                req.username,
                req.password,
                req.email,
                req.phoneNumber,
                req.address,
                req.firstName,
                req.lastName,
                req.birthDate
        ));
    }

    @GetMapping("/clients")
    public List<UserSummaryDto> listClients() {
        return userService.list(Role.CLIENT).stream()
                .map(mapper::toUserSummary)
                .toList();
    }

    @PutMapping("/clients/{id}/password")
    public UserSummaryDto updateClientPassword(@PathVariable Long id, @RequestBody CreateUserRequest req) {
        return mapper.toUserSummary(userService.updatePassword(id, req.password));
    }

    @DeleteMapping("/clients/{id}")
    public void deleteClient(@PathVariable Long id) { userService.delete(id); }


    @PostMapping("/accounts/{id}/approve")
    public AccountSummaryDto approveCurrent(@PathVariable Long id) {
        return mapper.toAccountSummary(accountService.approveCurrent(id));
    }

    @PostMapping("/accounts/{id}/reject")
    public AccountSummaryDto rejectAccount(@PathVariable Long id) {
        return mapper.toAccountSummary(accountService.reject(id));
    }

    @PostMapping("/cards/{id}/approve-debit")
    public CardSummaryDto approveDebit(@PathVariable Long id) {
        return mapper.toCardSummary(cardService.approveDebit(id));
    }


    @PostMapping("/cards/{id}/approve-credit")
    public CardSummaryDto approveCredit(@PathVariable Long id, @RequestBody ApproveCreditCardDto dto) {
        return mapper.toCardSummary(cardService.approveCredit(id, dto.interestPercent));
    }

    @PostMapping("/cards/{id}/reject")
    public CardSummaryDto rejectCard(@PathVariable Long id) {
        return mapper.toCardSummary(cardService.rejectCard(id));
    }


    @GetMapping("/accounts")
    public List<AccountSummaryDto> allAccounts() {
        return accountService.allAccounts().stream()
                .map(mapper::toAccountSummary)
                .toList();
    }

    @GetMapping("/transactions")
    public List<TransactionSummaryDto> allTransactions() {
        return txnService.allTransactions().stream()
                .map(mapper::toTransactionSummary)
                .toList();
    }
}
