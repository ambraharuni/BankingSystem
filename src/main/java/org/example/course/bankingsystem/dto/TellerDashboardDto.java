package org.example.course.bankingsystem.dto;

import java.util.List;

public record TellerDashboardDto(
        TellerMetricsDto metrics,
        List<UserSummaryDto> clients,
        List<AccountSummaryDto> accounts,
        List<AccountSummaryDto> pendingAccounts,
        List<CardSummaryDto> cards,
        List<CardSummaryDto> pendingCards,
        List<TransactionSummaryDto> recentTransactions
) {
}
