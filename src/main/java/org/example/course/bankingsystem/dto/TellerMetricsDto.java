package org.example.course.bankingsystem.dto;

public record TellerMetricsDto(
        long totalClients,
        long totalAccounts,
        long pendingAccounts,
        long totalCards,
        long pendingCards,
        long totalTransactions
) {
}
