package org.example.course.bankingsystem.repository;

import org.example.course.bankingsystem.entity.Card;
import org.example.course.bankingsystem.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CardRepository extends JpaRepository<Card, Long> {
    List<Card> findByOwner(User owner);
}