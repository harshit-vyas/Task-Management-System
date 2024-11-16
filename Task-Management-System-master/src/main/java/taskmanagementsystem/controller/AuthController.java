package taskmanagementsystem.controller;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import taskmanagementsystem.dto.*;
import taskmanagementsystem.model.Role;
import taskmanagementsystem.model.User;
import taskmanagementsystem.repository.RoleRepository;
import taskmanagementsystem.repository.UserRepository;
import taskmanagementsystem.security.AuthResponse;
import taskmanagementsystem.service.AuthService;
import taskmanagementsystem.service.JwtService;

import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api/auth")
public class AuthController {
    private final AuthService authService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;


    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody Register register){
        System.out.println("register");
        return ResponseEntity.ok(authService.register(register));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody Login login){
        Optional<User> user = authService.login(login);
        if (user.isPresent()){
            System.out.println("login ");
            User presentUser = user.get();
            return ResponseEntity.ok(new AuthResponse(presentUser.getId(), presentUser.getUsername(), presentUser.getRole().getRole()));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }


    @PostMapping("/new")
    public String addNewUser(@RequestParam String password) {
        String encode = passwordEncoder.encode(password);
        System.out.println("encrypted password " + encode);
        return encode;
    }

    @PostMapping("/authenticate")
    public ApiResponseDto authenticateAndGetToken(@RequestBody AuthRequest authRequest) {
        try {
            AuthResponseDto authResponseDto = new AuthResponseDto();
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword()));
            if (authentication.isAuthenticated()) {
                String token = jwtService.generateToken(authRequest.getUsername());
                GrantedAuthority userrole = authentication.getAuthorities().stream().findFirst().get();
                Role role = roleRepository.findByRole(userrole.getAuthority());
                authResponseDto.setUsername(authRequest.getUsername());
                authResponseDto.setToken(token);
                authResponseDto.setRole(role.getRole());
                authResponseDto.setRoleId(role.getId());
                Optional<User> userFromDb = userRepository.findByUsername(authRequest.getUsername());
                authResponseDto.setUserId(userFromDb.get().getId());
                authResponseDto.setFirstName(userFromDb.get().getFirstName());
                authResponseDto.setLastName(userFromDb.get().getLastName());
                return ApiResponseDto.builder().message("Success").statusCode(200).data(authResponseDto).build();
            } else {
                throw new RuntimeException("Invalid Login Information !");
            }
        } catch (Exception e) {
            throw new RuntimeException("Invalid Login Information !");
        }
    }
}