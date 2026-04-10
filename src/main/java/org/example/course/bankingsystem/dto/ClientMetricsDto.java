package org.example.course.bankingsystem.dto;

import java.math.BigDecimal;

public record ClientMetricsDto(
        BigDecimal totalBalance,
        long totalAccounts,
        long activeAccounts,
        long pendingAccounts,
        long activeCards,
        long pendingCards,
        long transactionCount
) {
}
