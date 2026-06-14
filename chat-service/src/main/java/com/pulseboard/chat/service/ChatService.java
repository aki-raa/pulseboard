package com.pulseboard.chat.service;

import com.pulseboard.chat.dto.MessageRequest;
import com.pulseboard.chat.model.Message;
import com.pulseboard.chat.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final MessageRepository messageRepository;
//    private final KafkaProducerService kafkaProducerService;
    private final SimpMessagingTemplate messagingTemplate;

    public Message sendMessage(MessageRequest request, String senderEmail) {
        Message message = Message.builder()
                .senderId(senderEmail)
                .receiverId(request.getReceiverId())
                .content(request.getContent())
                .status(Message.MessageStatus.SENT)
                .timestamp(LocalDateTime.now())
                .build();

        messageRepository.save(message);
//        kafkaProducerService.sendMessage(message);

        // WebSocket push to receiver
        messagingTemplate.convertAndSendToUser(
                request.getReceiverId(),
                "/queue/messages",
                message
        );

        return message;
    }

    public List<Message> getHistory(String senderId, String receiverId) {
        return messageRepository.findConversation(senderId, receiverId);
    }

    public List<Message> getConversations(String userId) {
        return messageRepository.findByUserInvolved(userId);
    }
}