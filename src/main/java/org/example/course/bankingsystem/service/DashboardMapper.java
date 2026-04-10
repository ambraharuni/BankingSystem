package org.example.course.bankingsystem.service;

import org.example.course.bankingsystem.dto.AccountSummaryDto;
import org.example.course.bankingsystem.dto.CardSummaryDto;
import org.example.course.bankingsystem.dto.TransactionSummaryDto;
import org.example.course.bankingsystem.dto.UserSummaryDto;
import org.example.course.bankingsystem.entity.BankAccount;
import org.example.course.bankingsystem.entity.Card;
import org.example.course.bankingsystem.entity.TransactionEntry;
import org.example.course.bankingsystem.entity.User;
import org.springframework.stereotype.Component;

@Component
public class DashboardMapper {

    public UserSummaryDto toUserSummary(User user) {
        return new UserSummaryDto(
                user.getId(),
                user.getUsername(),
                user.getRole().name(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getAddress(),
                user.getFirstName(),
                user.getLastName(),
                user.getBirthDate()
        );
    }

    public AccountSummaryDto toAccountSummary(BankAccount account) {
        return new AccountSummaryDto(
                account.getId(),
                account.getIban(),
                account.getCurrency(),
                account.getBalance(),
                account.getAccountType().name(),
                account.getStatus().name(),
                account.getInterestPercent(),
                account.getOwner().getUsername(),
                account.getCard() == null ? null : account.getCard().getId()
        );
    }

    public CardSummaryDto toCardSummary(Card card) {
        return new CardSummaryDto(
                card.getId(),
                card.getCardType().name(),
                card.getStatus().name(),
                card.getMonthlyIncome(),
                card.getLinkedAccount() == null ? null : card.getLinkedAccount().getId(),
                card.getLinkedAccount() == null ? null : card.getLinkedAccount().getIban(),
                card.getOwner().getUsername()
        );
    }

    public TransactionSummaryDto toTransactionSummary(TransactionEntry transaction) {
        return new TransactionSummaryDto(
                transaction.getId(),
                transaction.getBankAccount().getId(),
                transaction.getBankAccount().getIban(),
                transaction.getBankAccount().getCurrency(),
                transaction.getType().name(),
                transaction.getAmount(),
                transaction.getCreatedAt(),
                transaction.getCounterpartyIban(),
                transaction.getTransferRef(),
                transaction.getBankAccount().getOwner().getUsername()
        );
    }
}
