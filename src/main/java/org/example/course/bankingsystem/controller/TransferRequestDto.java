package org.example.course.bankingsystem.controller;

import java.math.BigDecimal;

public class TransferRequestDto {
    public Long fromAccountId;
    public String toIban;
    public BigDecimal amount;
}
