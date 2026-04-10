package org.example.course.bankingsystem.repository;

import org.example.course.bankingsystem.entity.BankAccount;
import org.example.course.bankingsystem.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BankAccountRepository extends JpaRepository<BankAccount, Long> {
    Optional<BankAccount> findByIban(String iban);
    List<BankAccount> findByOwner(User owner);
}
