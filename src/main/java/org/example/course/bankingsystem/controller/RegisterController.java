package org.example.course.bankingsystem.controller;

import org.example.course.bankingsystem.entity.Role;
import org.example.course.bankingsystem.entity.User;
import org.example.course.bankingsystem.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class RegisterController {
    private static final Logger logger = LoggerFactory.getLogger(RegisterController.class);

    private final UserService userService;

    public RegisterController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register-client")
    public User registerClient(@RequestBody CreateUserRequest req) {
        logger.info("Registering client username={}", req.username);
        return userService.create(Role.CLIENT, req.username, req.password);
    }
}