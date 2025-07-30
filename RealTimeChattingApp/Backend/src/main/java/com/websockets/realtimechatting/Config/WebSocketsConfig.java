package com.websockets.realtimechatting.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketsConfig implements WebSocketMessageBrokerConfigurer {
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        //all the urls staring with topic will be used for broker
        config.enableSimpleBroker("/topic");

        //all the urls staring with app will be used for sending data to the server
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // gs-guide-websocket will be used for the handshake
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:5173") // Exact origin
                .setAllowedOriginPatterns("*") // Fallback
                .withSockJS();

    }
}
