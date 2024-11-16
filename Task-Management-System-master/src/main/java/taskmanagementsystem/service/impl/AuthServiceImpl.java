package taskmanagementsystem.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import taskmanagementsystem.dto.Login;
import taskmanagementsystem.dto.Register;
import taskmanagementsystem.exception.ApiException;
import taskmanagementsystem.model.Role;
import taskmanagementsystem.model.User;
import taskmanagementsystem.repository.RoleRepository;
import taskmanagementsystem.repository.UserRepository;
import taskmanagementsystem.security.AuthResponse;
import taskmanagementsystem.service.AuthService;

import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    private RoleRepository roleRepository;

    public AuthServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public AuthResponse register(Register register) {
        if (userRepository.existsByEmail(register.getEmail())) throw new ApiException(HttpStatus.BAD_REQUEST, "Email has been already used.");
        if (userRepository.existsByUsername(register.getUsername())) throw new ApiException(HttpStatus.BAD_REQUEST, "Username already taken.");


        User user = buildUser(register);
        User savedUser = userRepository.save(user);

        return new AuthResponse(savedUser.getId(), savedUser.getUsername(), savedUser.getRole().getRole());
    }

    @Override
    public Optional<User> login(Login login) {
        return userRepository.findByUsernameOrEmail(login.getUsername(), login.getUsername())
                .filter(user -> passwordEncoder.matches(login.getPassword(), user.getPassword()));
    }

    private User buildUser(Register register){
        User user = new User();
        user.setFirstName(register.getFirstName());
        user.setLastName(register.getLastName());
        user.setEmail(register.getEmail());
        user.setUsername(register.getUsername());
        user.setPassword(passwordEncoder.encode(register.getPassword()));
        Role role = roleRepository.findByRole(register.getRole());
//        Role role = roleRepository.findByRole("CUSTOMER");
        role.setRole(register.getRole());
        user.setRole(role);

        return user;
    }
}