package org.example.course.bankingsystem.dto;

import java.util.List;

public record ClientDashboardDto(
        String username,
        ClientMetricsDto metrics,
        List<AccountSummaryDto> accounts,
        List<CardSummaryDto> cards,
        List<TransactionSummaryDto> recentTransactions
) {
}
