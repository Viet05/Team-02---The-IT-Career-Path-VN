package com.team02.backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmailService {

  JavaMailSender mailSender;
  TemplateEngine templateEngine;

  @NonFinal
  @Value("${spring.mail.username}")
  String fromEmail;

  public void sendEmail(String toEmail, String token) {
    try {
      String verificationUrl = "http://localhost:5173/auth/login?verified=1&token=" + token;

      Context context = new Context();
      context.setVariable("name", toEmail); // Can replace with actual name if available
      context.setVariable("verificationUrl", verificationUrl);

      String htmlContent = templateEngine.process("email/verify-email", context);

      MimeMessage mimeMessage = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(
          mimeMessage, true, "UTF-8");

      helper.setTo(toEmail);
      helper.setSubject("Xác thực tài khoản - The IT Career Path VN");
      helper.setText(htmlContent, true);

      mailSender.send(mimeMessage);
      log.info("Verification HTML email sent to: {}", toEmail);
    } catch (MessagingException e) {
      log.error("Failed to send verification email", e);
      throw new RuntimeException("Failed to send email");
    }
  }

  public void sendResetPasswordEmail(String toEmail, String token) {
    try {
      String resetPasswordUrl = "http://localhost:5173/reset-password?token=" + token;

      Context context = new Context();
      context.setVariable("name", toEmail);
      context.setVariable("resetPasswordUrl", resetPasswordUrl);

      String htmlContent = templateEngine.process("email/reset-password", context);

      MimeMessage mimeMessage = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(
          mimeMessage, true, "UTF-8");

      helper.setTo(toEmail);
      helper.setSubject("Đặt lại mật khẩu - The IT Career Path VN");
      helper.setText(htmlContent, true);

      mailSender.send(mimeMessage);
      log.info("Reset password HTML email sent to: {}", toEmail);
    } catch (MessagingException e) {
      log.error("Failed to send reset password email", e);
      throw new RuntimeException("Failed to send email");
    }
  }
}
