package org.example.course.bankingsystem.dto;

import java.time.LocalDate;

public record UserSummaryDto(
        Long id,
        String username,
        String role,
        String email,
        String phoneNumber,
        String address,
        String firstName,
        String lastName,
        LocalDate birthDate
) {
}
