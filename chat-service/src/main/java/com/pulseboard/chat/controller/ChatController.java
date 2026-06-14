package com.pulseboard.chat.controller;

import com.pulseboard.chat.dto.MessageRequest;
import com.pulseboard.chat.model.Message;
import com.pulseboard.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/send")
    public Message sendMessage(@RequestBody MessageRequest request, Principal principal) {
        request.setSenderId(principal.getName());
        return chatService.sendMessage(request, principal.getName());
    }

    @GetMapping("/history/{receiverId}")
    public List<Message> getHistory(@PathVariable String receiverId, Principal principal) {
        return chatService.getHistory(principal.getName(), receiverId);
    }

    @GetMapping("/conversations")
    public List<Message> getConversations(Principal principal) {
        return chatService.getConversations(principal.getName());
    }

    @MessageMapping("/chat.send")
    public void sendMessageWS(@Payload MessageRequest request, Principal principal) {
        request.setSenderId(principal.getName());
        chatService.sendMessage(request, principal.getName());
    }
}