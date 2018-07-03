package com.biglabs.solo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestOperations;
import org.springframework.web.client.RestTemplate;

/**
 * Created by antt on 6/27/2018.
 */
@Configuration
public class RestTemplateConfiguration {
    @Bean
    public RestOperations restTemplate() {
        return new RestTemplate();
    }
}
