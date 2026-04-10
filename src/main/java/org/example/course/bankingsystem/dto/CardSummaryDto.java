package org.example.course.bankingsystem.dto;

import java.math.BigDecimal;

public record CardSummaryDto(
        Long id,
        String cardType,
        String status,
        BigDecimal monthlyIncome,
        Long linkedAccountId,
        String linkedAccountIban,
        String ownerUsername
) {
}
