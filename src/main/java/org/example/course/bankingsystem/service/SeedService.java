package org.example.course.bankingsystem.service;

import org.example.course.bankingsystem.entity.Role;
import org.example.course.bankingsystem.entity.User;
import org.example.course.bankingsystem.repository.UserRepository;
import org.slf4j.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class SeedService implements CommandLineRunner {
    private static final Logger log = LoggerFactory.getLogger(SeedService.class);
    private final UserRepository users;
    private final PasswordEncoder encoder;

    public SeedService(UserRepository users, PasswordEncoder encoder) {
        this.users = users;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) {
        User u = users.findByUsername("admin").orElseGet(User::new);
        u.setUsername("admin");
        u.setPasswordHash(encoder.encode("admin123"));
        u.setRole(Role.ADMIN);
        users.save(u);
        log.info("Ensured default ADMIN: admin / admin123");
    }
}