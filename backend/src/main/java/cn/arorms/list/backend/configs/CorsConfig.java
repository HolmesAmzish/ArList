package cn.arorms.list.backend.configs;

import org.springframework.context.annotation.Configuration;

/**
 * CorsConfig
 * @version 1.0 2025-07-04
 * @author Cacciatore
 */
@Configuration
public class CorsConfig implements org.springframework.web.servlet.config.annotation.WebMvcConfigurer {

    @Override
    public void addCorsMappings(org.springframework.web.servlet.config.annotation.CorsRegistry registry) {
        registry.addMapping("/**") // Apply to all endpoints
                .allowedOrigins("http://localhost:5173", "http://192.168.0.110:5173", "http://list.arorms.cn")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600); // Cache the preflight response for 1 hour
    }
}
