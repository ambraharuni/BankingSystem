package org.example.course.bankingsystem.dto;

public record AdminMetricsDto(
        long totalTellers,
        long totalClients,
        long totalAccounts,
        long totalCards,
        long totalTransactions
) {
}
