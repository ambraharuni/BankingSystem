package org.example.course.bankingsystem.service;

import org.example.course.bankingsystem.entity.Role;
import org.example.course.bankingsystem.entity.User;
import org.example.course.bankingsystem.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Locale;

@Service
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository users;
    private final PasswordEncoder encoder;

    public UserService(UserRepository users, PasswordEncoder encoder) {
        this.users = users;
        this.encoder = encoder;
    }

    public User create(Role role, String username, String password) {
        logger.info("Creating user role={} username={}", role, username);
        if (users.findByUsername(username).isPresent())
            throw new ApiException(HttpStatus.BAD_REQUEST, "Username already exists");

        User u = new User();
        u.setUsername(username);
        u.setPasswordHash(encoder.encode(password));
        u.setRole(role);
        return users.save(u);
    }

    public User createClient(String username, String password, String email, String phoneNumber, String address,
                             String firstName, String lastName, LocalDate birthDate) {
        logger.info("Creating client username={} email={}", username, email);
        return createProfiledUser(Role.CLIENT, username, password, email, phoneNumber, address, firstName, lastName, birthDate);
    }

    public User createTeller(String username, String password, String email, String phoneNumber, String address,
                             String firstName, String lastName, LocalDate birthDate) {
        logger.info("Creating teller username={} email={}", username, email);
        return createProfiledUser(Role.TELLER, username, password, email, phoneNumber, address, firstName, lastName, birthDate);
    }

    private User createProfiledUser(Role role, String username, String password, String email, String phoneNumber, String address,
                                    String firstName, String lastName, LocalDate birthDate) {
        if (username == null || username.isBlank() || password == null || password.isBlank())
            throw new ApiException(HttpStatus.BAD_REQUEST, "Username and password are required");
        if (email == null || email.isBlank() || phoneNumber == null || phoneNumber.isBlank()
                || address == null || address.isBlank() || firstName == null || firstName.isBlank()
                || lastName == null || lastName.isBlank() || birthDate == null)
            throw new ApiException(HttpStatus.BAD_REQUEST, "Profile fields are required");
        if (users.findByUsername(username).isPresent())
            throw new ApiException(HttpStatus.BAD_REQUEST, "Username already exists");

        String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);
        if (users.findByEmail(normalizedEmail).isPresent())
            throw new ApiException(HttpStatus.BAD_REQUEST, "Email already exists");

        User user = new User();
        user.setUsername(username.trim());
        user.setPasswordHash(encoder.encode(password));
        user.setRole(role);
        user.setEmail(normalizedEmail);
        user.setPhoneNumber(phoneNumber.trim());
        user.setAddress(address.trim());
        user.setFirstName(firstName.trim());
        user.setLastName(lastName.trim());
        user.setBirthDate(birthDate);
        return users.save(user);
    }

    public List<User> list(Role role) {
        logger.info("Listing users with role={}", role);
        return users.findByRole(role);
    }

    public User updatePassword(Long id, String newPassword) {
        logger.info("Updating password for user id={}", id);
        User u = users.findById(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
        u.setPasswordHash(encoder.encode(newPassword));
        return users.save(u);
    }

    public void delete(Long id) {
        logger.info("Deleting user id={}", id);
        if (!users.existsById(id)) throw new ApiException(HttpStatus.NOT_FOUND, "User not found");
        users.deleteById(id);
    }
}
