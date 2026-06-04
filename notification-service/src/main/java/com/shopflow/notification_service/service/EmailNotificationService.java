package com.shopflow.notification_service.service;

import com.shopflow.notification_service.event.OrderEvent;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.text.NumberFormat;
import java.util.Locale;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailNotificationService {

    private final JavaMailSender mailSender;

    @Value("${notification.mail.from}")
    private String fromEmail;

    // ── Escucha orden confirmada ──────────────────────────────────────────────
    @KafkaListener(
            topics = "order.confirmed",
            groupId = "notification-service-group",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void onOrderConfirmed(OrderEvent event) {
        log.info("Orden confirmada recibida: {}", event.getOrderId());
        try {
            sendOrderConfirmedEmail(event);
        } catch (Exception e) {
            log.error("Error enviando email de confirmación: {}", e.getMessage());
        }
    }

    // ── Escucha orden cancelada ───────────────────────────────────────────────
    @KafkaListener(
            topics = "order.cancelled",
            groupId = "notification-service-group",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void onOrderCancelled(OrderEvent event) {
        log.info("Orden cancelada recibida: {}", event.getOrderId());
        try {
            sendOrderCancelledEmail(event);
        } catch (Exception e) {
            log.error("Error enviando email de cancelación: {}", e.getMessage());
        }
    }

    // ── Email confirmación ────────────────────────────────────────────────────
    private void sendOrderConfirmedEmail(OrderEvent event) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(event.getUserEmail());
        helper.setSubject(" Tu orden #" + shortId(event.getOrderId()) + " fue confirmada");
        helper.setText(buildConfirmedHtml(event), true);

        mailSender.send(message);
        log.info("Email de confirmación enviado a {}", event.getUserEmail());
    }

    // ── Email cancelación ─────────────────────────────────────────────────────
    private void sendOrderCancelledEmail(OrderEvent event) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(event.getUserEmail());
        helper.setSubject(" Tu orden #" + shortId(event.getOrderId()) + " fue cancelada");
        helper.setText(buildCancelledHtml(event), true);

        mailSender.send(message);
        log.info("Email de cancelación enviado a {}", event.getUserEmail());
    }

    // ── HTML confirmación ─────────────────────────────────────────────────────
    private String buildConfirmedHtml(OrderEvent event) {
        StringBuilder items = new StringBuilder();
        if (event.getItems() != null) {
            for (OrderEvent.OrderItemEvent item : event.getItems()) {
                items.append("""
                    <tr>
                        <td style="padding:8px;border-bottom:1px solid #2a2a2a;color:#e5e5e5;">%s</td>
                        <td style="padding:8px;border-bottom:1px solid #2a2a2a;color:#e5e5e5;text-align:center;">%d</td>
                        <td style="padding:8px;border-bottom:1px solid #2a2a2a;color:#FF8C42;text-align:right;">%s</td>
                    </tr>
                """.formatted(
                        item.getProductName() != null ? item.getProductName() : item.getProductId(),
                        item.getQuantity(),
                        formatPrice(item.getUnitPrice() * item.getQuantity())
                ));
            }
        }

        return """
            <div style="font-family:Arial,sans-serif;background:#0a0a0a;padding:40px;max-width:600px;margin:auto;border-radius:16px;">
                <div style="text-align:center;margin-bottom:32px;">
                    <h1 style="color:#FF8C42;font-size:28px;margin:0;">ShopFlow</h1>
                    <p style="color:#71717a;margin:4px 0 0;">La nueva forma de comprar todo</p>
                </div>
                <div style="background:#111;border:1px solid #1f1f1f;border-radius:12px;padding:32px;margin-bottom:24px;">
                    <div style="text-align:center;margin-bottom:24px;">
                        <span style="font-size:48px;"></span>
                        <h2 style="color:#ffffff;margin:8px 0 4px;">¡Orden confirmada!</h2>
                        <p style="color:#71717a;margin:0;">Orden #%s</p>
                    </div>
                    <table style="width:100%%;border-collapse:collapse;margin-bottom:16px;">
                        <thead>
                            <tr style="background:#1a1a1a;">
                                <th style="padding:10px 8px;text-align:left;color:#71717a;font-size:12px;text-transform:uppercase;">Producto</th>
                                <th style="padding:10px 8px;text-align:center;color:#71717a;font-size:12px;text-transform:uppercase;">Cant.</th>
                                <th style="padding:10px 8px;text-align:right;color:#71717a;font-size:12px;text-transform:uppercase;">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>%s</tbody>
                    </table>
                    <div style="border-top:1px solid #2a2a2a;padding-top:16px;display:flex;justify-content:space-between;">
                        <span style="color:#ffffff;font-weight:bold;font-size:18px;">Total</span>
                        <span style="color:#FF8C42;font-weight:bold;font-size:18px;">%s</span>
                    </div>
                </div>
                <div style="background:#111;border:1px solid #1f1f1f;border-radius:12px;padding:20px;margin-bottom:24px;">
                    <p style="color:#71717a;margin:0 0 4px;font-size:12px;text-transform:uppercase;">Dirección de envío</p>
                    <p style="color:#e5e5e5;margin:0;">%s</p>
                </div>
                <p style="text-align:center;color:#71717a;font-size:12px;">
                    Gracias por comprar en ShopFlow 🧡
                </p>
            </div>
        """.formatted(
                shortId(event.getOrderId()),
                items.toString(),
                formatPrice(event.getTotalAmount()),
                event.getShippingAddress() != null ? event.getShippingAddress() : "—"
        );
    }

    // ── HTML cancelación ──────────────────────────────────────────────────────
    private String buildCancelledHtml(OrderEvent event) {
        return """
            <div style="font-family:Arial,sans-serif;background:#0a0a0a;padding:40px;max-width:600px;margin:auto;border-radius:16px;">
                <div style="text-align:center;margin-bottom:32px;">
                    <h1 style="color:#FF8C42;font-size:28px;margin:0;">ShopFlow</h1>
                    <p style="color:#71717a;margin:4px 0 0;">La nueva forma de comprar todo</p>
                </div>
                <div style="background:#111;border:1px solid #1f1f1f;border-radius:12px;padding:32px;margin-bottom:24px;text-align:center;">
                    <span style="font-size:48px;"></span>
                    <h2 style="color:#ffffff;margin:8px 0 4px;">Orden cancelada</h2>
                    <p style="color:#71717a;margin:0 0 16px;">Orden #%s</p>
                    <p style="color:#e5e5e5;margin:0;">
                        Tu pago no pudo procesarse. No se realizó ningún cargo.<br/>
                        Puedes intentarlo nuevamente cuando quieras.
                    </p>
                </div>
                <div style="text-align:center;">
                    <a href="http://localhost:5173/products"
                       style="background:linear-gradient(to right,#FF6B35,#FFB347);color:#000;font-weight:bold;padding:14px 32px;border-radius:12px;text-decoration:none;display:inline-block;">
                        Volver a la tienda
                    </a>
                </div>
                <p style="text-align:center;color:#71717a;font-size:12px;margin-top:24px;">
                    ¿Necesitas ayuda? Contáctanos en soporte@shopflow.com
                </p>
            </div>
        """.formatted(shortId(event.getOrderId()));
    }

    // ── Helpers ───────────────────────────────────────────────────────────────
    private String shortId(String id) {
        return id != null && id.length() > 8 ? id.substring(0, 8).toUpperCase() : id;
    }

    private String formatPrice(double price) {
        return NumberFormat.getCurrencyInstance(new Locale("es", "CO")).format(price);
    }
}