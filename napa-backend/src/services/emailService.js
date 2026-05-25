// src/services/emailService.js
import nodemailer from "nodemailer";
import { env } from "../config/env.js";
import i18next from "../i18n/index.js";
import logger from "../middleware/logger.js";

const transporter = nodemailer.createTransport({
  host: env.email.host,
  port: env.email.port,
  secure: env.email.port === 465,
  auth: { user: env.email.user, pass: env.email.pass },
});

// ── Templates ─────────────────────────────────────────────

const reservationEmailHTML = (reservation, t) => {
  const dateStr = new Date(reservation.date).toLocaleDateString();
  return `
  <!DOCTYPE html>
  <html>
  <body style="font-family: 'Georgia', serif; background:#faf5f5; color:#3a1a1a; padding:40px 0;">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(107,20,20,0.1)">
      <div style="background:#6b1414;padding:40px 32px;text-align:center;">
        <div style="width:80px;height:80px;background:#f5d5d5;border-radius:50%;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:900;color:#6b1414;line-height:80px;">N</div>
        <h1 style="color:#f5d5d5;margin:0;font-size:24px;letter-spacing:4px;">NAPA CHAPTER ONE</h1>
      </div>
      <div style="padding:40px 32px;">
        <h2 style="color:#6b1414;margin:0 0 8px;">${t("reservation.created")}</h2>
        <p style="margin:0 0 24px;color:#666;">Hello ${reservation.guestName},</p>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:10px 0;border-bottom:1px solid #f0e0e0;color:#888;width:140px;">Date</td><td style="padding:10px 0;border-bottom:1px solid #f0e0e0;font-weight:600;">${dateStr}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #f0e0e0;color:#888;">Time</td><td style="padding:10px 0;border-bottom:1px solid #f0e0e0;font-weight:600;">${reservation.timeSlot}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #f0e0e0;color:#888;">Guests</td><td style="padding:10px 0;border-bottom:1px solid #f0e0e0;font-weight:600;">${reservation.partySize}</td></tr>
          <tr><td style="padding:10px 0;color:#888;">Reference</td><td style="padding:10px 0;font-weight:600;color:#6b1414;">${reservation.confirmationCode}</td></tr>
        </table>
        ${reservation.specialRequests ? `<p style="margin:24px 0 0;padding:16px;background:#faf0f0;border-radius:8px;border-left:3px solid #6b1414;"><strong>Special requests:</strong><br>${reservation.specialRequests}</p>` : ""}
      </div>
      <div style="padding:24px 32px;background:#faf5f5;text-align:center;font-size:12px;color:#999;">
        <p style="margin:0;">NAPA Chapter One • To modify or cancel, reply to this email or use your confirmation code.</p>
      </div>
    </div>
  </body>
  </html>
  `;
};

// ── Public functions ──────────────────────────────────────

export const sendReservationConfirmation = async (reservation, language = "en") => {
  try {
    const t = (key, opts) => i18next.t(key, { lng: language, ...opts });
    const dateStr = new Date(reservation.date).toLocaleDateString();

    await transporter.sendMail({
      from: env.email.from,
      to: reservation.guestEmail,
      subject: t("email.reservationSubject", { date: dateStr }),
      html: reservationEmailHTML(reservation, t),
    });

    reservation.emailsSent.confirmation = true;
    await reservation.save();

    logger.info(`Confirmation email sent to ${reservation.guestEmail}`);
  } catch (err) {
    logger.error("Failed to send confirmation email:", err.message);
  }
};
