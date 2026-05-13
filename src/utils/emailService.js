const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  await resend.emails.send({
    from: 'SecureVault <onboarding@resend.dev>',
    to: email,
    subject: 'SecureVault - Şifre Sıfırlama',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a1a; color: #fff; padding: 40px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #6366f1; font-size: 28px;">🔐 SecureVault</h1>
          <p style="color: rgba(255,255,255,0.6);">JWT Tabanlı API Güvenlik Sistemi</p>
        </div>
        <h2 style="color: #fff; margin-bottom: 16px;">Şifre Sıfırlama İsteği</h2>
        <p style="color: rgba(255,255,255,0.7); line-height: 1.6;">
          Hesabınız için şifre sıfırlama talebinde bulundunuz. Aşağıdaki butona tıklayarak yeni şifrenizi belirleyebilirsiniz.
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}" style="background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 16px;">
            Şifremi Sıfırla
          </a>
        </div>
        <p style="color: rgba(255,255,255,0.4); font-size: 13px;">
          Bu link 1 saat geçerlidir. Eğer bu isteği siz yapmadıysanız bu emaili görmezden gelebilirsiniz.
        </p>
        <hr style="border-color: rgba(255,255,255,0.1); margin: 24px 0;">
        <p style="color: rgba(255,255,255,0.3); font-size: 12px; text-align: center;">
          SecureVault API Güvenlik Sistemi
        </p>
      </div>
    `
  });
};

module.exports = { sendPasswordResetEmail };