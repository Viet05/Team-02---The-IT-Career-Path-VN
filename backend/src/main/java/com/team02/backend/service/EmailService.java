package com.team02.backend.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmailService {

  private final JavaMailSender mailSender;

  public void sendEmail(String toEmail, String token) {

    String verificationUrl = "http://localhost:3000/verify-email?token=" + token;

    SimpleMailMessage message = new SimpleMailMessage();
    message.setTo(toEmail);
    message.setSubject("Verify Email");
    message.setText("Click the link below to verify your email:\n" + verificationUrl);

    mailSender.send(message);
    log.info("Verification email sent to: {}", toEmail);
  }
}
