package org.example.course.bankingsystem.auth;

import org.example.course.bankingsystem.entity.User;
import org.example.course.bankingsystem.service.ApiException;
import org.example.course.bankingsystem.repository.UserRepository;
import org.example.course.bankingsystem.security.JwtService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthController(UserRepository users, PasswordEncoder encoder, JwtService jwt) {
        this.users = users;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest req) {
        logger.info("Login attempt for username={}", req.username);
        User u = users.findByUsername(req.username)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        if (!encoder.matches(req.password, u.getPasswordHash())) {
            logger.warn("Failed login for username={}: password mismatch", req.username);
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        String token = jwt.generate(u);
        logger.info("Login successful for username={}", req.username);
        return new AuthResponse(token, u.getRole().name());
    }
}
