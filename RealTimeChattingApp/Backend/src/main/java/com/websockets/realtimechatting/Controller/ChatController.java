package com.websockets.realtimechatting.Controller;

import com.websockets.realtimechatting.Model.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/chat")
    public ChatMessage SendMessage(@Payload  ChatMessage chatMessage) {
        return chatMessage;
    }

    @MessageMapping("/chat.joinChat")
    @SendTo("/topic/chat")
    public ChatMessage JoinChat(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        //@Payload confirms the conversion to POJOs before using it
        //metadata handler -> a helper class that gives access to session id, user information etc
        //headerAccessor.getSessionAttributes() returns a map
        //put() method stores username in this map which we can access later while the user
        //is still connected through get("username")
        if(headerAccessor.getSessionAttributes() != null){
            headerAccessor.getSessionAttributes().put("username",chatMessage.getSender());
        }

        chatMessage.setContent("JOINED THE CHAT");
        //Broadcast join message
        return chatMessage;
    }

    @MessageMapping("/chat.typing")
    @SendTo("/topic/chat/typing")
    public ChatMessage typingMessage(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor){

        String username = (String) headerAccessor.getSessionAttributes().get("username");
        chatMessage.setSender(username);

        return chatMessage;
    }
}
