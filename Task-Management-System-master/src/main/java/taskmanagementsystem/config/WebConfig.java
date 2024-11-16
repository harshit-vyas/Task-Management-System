package taskmanagementsystem.config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // Adjust to match your endpoint pattern
                .allowedOrigins("http://localhost:3000") // Allow your frontend origin
                .allowedMethods("GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS") // Include OPTIONS here
                .allowedHeaders("Authorization", "Content-Type") // Allow required headers
                .allowCredentials(true); // Include this if needed
    }
}
