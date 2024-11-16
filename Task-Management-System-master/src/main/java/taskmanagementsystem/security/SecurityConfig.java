package taskmanagementsystem.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
	@Autowired
	private JwtAuthFilter authFilter;
	
	@Autowired
	private CustomAuthenticationEntryPoint customAuthenticationEntryPoint;

	@Bean
	public UserDetailsService userDetailsService() {
		return new UserInfoUserDetailsService();
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		return http
				.csrf(AbstractHttpConfigurer::disable) // Disable CSRF
				.cors(cors -> cors.configurationSource(corsConfigurationSource())) // Configure CORS
				.authorizeHttpRequests(auth -> auth
						.requestMatchers("/api/auth/**","/api/auth/register","/api/auth/login","api/auth/authenticate","/api/auth/new").permitAll() // Permit access to "/register"
						.requestMatchers("/api/v1/tasks/**")
						.authenticated() // Require authentication for these paths
				)
				.exceptionHandling(exception -> exception
						.authenticationEntryPoint(customAuthenticationEntryPoint) // Handle authentication exceptions
				)
				.sessionManagement(session -> session
						.sessionCreationPolicy(SessionCreationPolicy.STATELESS) // Set session to stateless
				)
				.authenticationProvider(authenticationProvider()) // Configure the authentication provider
				.addFilterBefore(authFilter, UsernamePasswordAuthenticationFilter.class) // Add custom authentication filter
				.build();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOrigins(List.of("http://localhost:3000")); // Adjust with your allowed origins
		configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")); // Allowed HTTP methods
		configuration.setAllowedHeaders(List.of("Authorization", "Content-Type")); // Allowed headers
		configuration.setAllowCredentials(true);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}

	  @Bean
		public CorsFilter corsFilter() {
		    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		    CorsConfiguration config = new CorsConfiguration();
		    config.setAllowCredentials(true);
			config.setAllowedOrigins(
					List.of("http://localhost:4200", "http://ocr-frontent.s3-website.eu-west-2.amazonaws.com",
							"http://brightspeed-frontend.s3-website.eu-north-1.amazonaws.com"));
		    config.setAllowedHeaders(List.of("*"));
		    config.setAllowedMethods(List.of("*"));
		    source.registerCorsConfiguration("/**", config);
		    return new CorsFilter(source);
		}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public AuthenticationProvider authenticationProvider() {
		DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
		authenticationProvider.setUserDetailsService(userDetailsService());
		authenticationProvider.setPasswordEncoder(passwordEncoder());
		return authenticationProvider;
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
		return config.getAuthenticationManager();
	}

}
