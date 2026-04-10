package org.example.course.bankingsystem.controller;

import org.example.course.bankingsystem.entity.Role;
import org.example.course.bankingsystem.entity.User;
import org.example.course.bankingsystem.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {
    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    private final UserService userService;

    public AdminController(UserService userService) { this.userService = userService; }

    @PostMapping("/tellers")
    public User createTeller(@RequestBody CreateUserRequest req) {
        logger.info("Admin creates teller {}", req.username);
        return userService.create(Role.TELLER, req.username, req.password);
    }

    @GetMapping("/tellers")
    public List<User> listTellers() {
        logger.info("Admin requests list of tellers");
        return userService.list(Role.TELLER);
    }

    @PutMapping("/tellers/{id}/password")
    public User updateTellerPassword(@PathVariable Long id, @RequestBody CreateUserRequest req) {
        logger.info("Admin updates password for teller id={}", id);
        return userService.updatePassword(id, req.password);
    }

    @DeleteMapping("/tellers/{id}")
    public void deleteTeller(@PathVariable Long id) {
        logger.info("Admin deletes teller id={}", id);
        userService.delete(id);
    }
}
