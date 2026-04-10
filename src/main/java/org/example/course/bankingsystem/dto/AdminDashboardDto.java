package org.example.course.bankingsystem.dto;

import java.util.List;

public record AdminDashboardDto(
        AdminMetricsDto metrics,
        List<UserSummaryDto> tellers
) {
}
