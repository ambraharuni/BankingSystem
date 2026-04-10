package org.example.course.bankingsystem.service;

import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class IbanGenerator {
    public String generateIban() {
        return "AL" + UUID.randomUUID().toString().replace("-", "").substring(0, 18).toUpperCase();
    }
}