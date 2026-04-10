package org.example.course.bankingsystem.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record TransactionSummaryDto(
        Long id,
        Long accountId,
        String accountIban,
        String accountCurrency,
        String type,
        BigDecimal amount,
        Instant createdAt,
        String counterpartyIban,
        UUID transferRef,
        String ownerUsername
) {
}
