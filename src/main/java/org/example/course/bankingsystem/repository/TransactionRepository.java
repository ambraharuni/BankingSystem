package org.example.course.bankingsystem.repository;

import org.example.course.bankingsystem.entity.BankAccount;
import org.example.course.bankingsystem.entity.TransactionEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<TransactionEntry, Long> {
    List<TransactionEntry> findByBankAccount(BankAccount account);
}