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

  JavaMailSender mailSender;
//  org.thymeleaf.TemplateEngine templateEngine;
  @lombok.experimental.NonFinal
  @org.springframework.beans.factory.annotation.Value("${spring.mail.username}")
  String fromEmail;

  public void sendEmail(String toEmail, String token) {
      String verificationUrl = "http://localhost:3000/verify-email?token=" + token;

      SimpleMailMessage message = new SimpleMailMessage();
      message.setTo(toEmail);
      message.setSubject("Verify Email");
      message.setText("Click the link below to verify your email:\n" + verificationUrl);

      mailSender.send(message);
      log.info("Verification email sent to: {}", toEmail);
//    try {
//      String verificationUrl = "http://localhost:3000/verify-email?token=" + token;
//
//      org.thymeleaf.context.Context context = new org.thymeleaf.context.Context();
//      context.setVariable("name", toEmail); // Can replace with actual name if available
//      context.setVariable("verificationUrl", verificationUrl);
//
//      String htmlContent = templateEngine.process("email/verify-email", context);
//
//      jakarta.mail.internet.MimeMessage mimeMessage = mailSender.createMimeMessage();
//      org.springframework.mail.javamail.MimeMessageHelper helper = new org.springframework.mail.javamail.MimeMessageHelper(
//          mimeMessage, true, "UTF-8");
//
//      helper.setTo(toEmail);
//      helper.setSubject("Xác thực tài khoản - The IT Career Path VN");
//      helper.setText(htmlContent, true);
//
//      mailSender.send(mimeMessage);
//      log.info("Verification HTML email sent to: {}", toEmail);
//    } catch (jakarta.mail.MessagingException e) {
//      log.error("Failed to send verification email", e);
//      throw new RuntimeException("Failed to send email");
//    }
  }

  public void sendResetPasswordEmail(String toEmail, String token) {
//    try {
//      String resetPasswordUrl = "http://localhost:3000/reset-password?token=" + token;
//
//      org.thymeleaf.context.Context context = new org.thymeleaf.context.Context();
//      context.setVariable("name", toEmail);
//      context.setVariable("resetPasswordUrl", resetPasswordUrl);
//
//      String htmlContent = templateEngine.process("email/reset-password", context);
//
//      jakarta.mail.internet.MimeMessage mimeMessage = mailSender.createMimeMessage();
//      org.springframework.mail.javamail.MimeMessageHelper helper = new org.springframework.mail.javamail.MimeMessageHelper(
//          mimeMessage, true, "UTF-8");
//
//      helper.setTo(toEmail);
//      helper.setSubject("Đặt lại mật khẩu - The IT Career Path VN");
//      helper.setText(htmlContent, true);
//
//      mailSender.send(mimeMessage);
//      log.info("Reset password HTML email sent to: {}", toEmail);
//    } catch (jakarta.mail.MessagingException e) {
//      log.error("Failed to send reset password email", e);
//      throw new RuntimeException("Failed to send email");
//    }
      String verificationUrl =
              "http://localhost:3000/reset-password?token=" + token;
      SimpleMailMessage message = new SimpleMailMessage();
      message.setTo(toEmail);
      message.setSubject("Reset Password");
      message.setText("Click the link to reset your password:\n"
              + verificationUrl);

      mailSender.send(message);
      log.info("SEND MAIL TO = [{}]", toEmail);
  }
}
