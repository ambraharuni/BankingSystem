package org.example.course.bankingsystem.dto;

import java.math.BigDecimal;

public record AccountSummaryDto(
        Long id,
        String iban,
        String currency,
        BigDecimal balance,
        String accountType,
        String status,
        BigDecimal interestPercent,
        String ownerUsername,
        Long linkedCardId
) {
}
