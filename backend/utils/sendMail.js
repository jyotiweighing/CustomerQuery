const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTP = async (email, otp) => {
  await transporter.sendMail({
    from: `"Customer Query Portal" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Customer Query Portal | Password Reset OTP",

    html: `
<!DOCTYPE html>
<html>

<head>
<meta charset="UTF-8">
<title>Password Reset OTP</title>
</head>

<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:40px 0;">

<tr>
<td align="center">

<table width="620" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 5px 20px rgba(0,0,0,.08);">

<!-- Header -->

<tr>

<td align="center"
style="background:linear-gradient(135deg,#2563eb,#4f46e5);padding:35px;">

<img
src="https://res.cloudinary.com/ndw6y55v/image/upload/f_auto,q_auto/Logo1_jmjrje"

width="160"
alt="Company Logo"
style="display:block;margin-bottom:20px;">

<h1 style="color:#ffffff;margin:0;font-size:28px;">
Customer Query Portal
</h1>

<p style="color:#dbeafe;margin-top:10px;font-size:15px;">
Secure Password Recovery
</p>

</td>

</tr>

<!-- Body -->

<tr>

<td style="padding:40px;">

<h2 style="color:#1e293b;margin-top:0;">
Hello,
</h2>

<p style="font-size:16px;color:#475569;line-height:28px;">

We received a request to reset your account password.

Please use the One-Time Password (OTP) below to verify your identity.

</p>

<div
style="
margin:35px auto;
background:#eef4ff;
border:2px dashed #2563eb;
border-radius:12px;
padding:25px;
text-align:center;
">

<p style="margin:0;color:#64748b;font-size:15px;">
Your Verification OTP
</p>

<h1
style="
font-size:42px;
letter-spacing:12px;
margin:15px 0;
color:#2563eb;
">
${otp}
</h1>

<p style="margin:0;color:#64748b;">
Valid for <strong>5 Minutes</strong>
</p>

</div>

<div
style="
background:#fff8e7;
border-left:5px solid #f59e0b;
padding:18px;
border-radius:8px;
margin-top:30px;
">

<h3 style="margin:0;color:#92400e;">
⚠ Security Notice
</h3>

<p style="margin-top:10px;color:#7c2d12;line-height:26px;">

Do <strong>NOT</strong> share this OTP with anyone.

Our support team will never ask for your OTP.

If you did not request a password reset, please ignore this email.

</p>

</div>

<h3 style="margin-top:40px;color:#1e293b;">
Keeping your account secure
</h3>

<ul style="color:#475569;line-height:28px;">

<li>Never share your OTP with anyone.</li>

<li>Use a strong password.</li>

<li>Change your password immediately if you suspect unauthorized access.</li>

<li>Always verify website URLs before logging in.</li>

</ul>

<p
style="
margin-top:40px;
font-size:15px;
color:#475569;
line-height:28px;
">

Thank you for using
<strong>Customer Query Portal.</strong>

</p>

</td>

</tr>

<!-- Footer -->

<tr>

<td
align="center"
style="
background:#f8fafc;
padding:30px;
border-top:1px solid #e2e8f0;
">

<p style="margin:0;color:#64748b;font-size:14px;">
© ${new Date().getFullYear()} Customer Query Portal
</p>

<p style="margin-top:10px;color:#94a3b8;font-size:13px;">
This is an automated email. Please do not reply.
</p>

</td>

</tr>

</table>

</td>

</tr>

</table>

</body>

</html>
`,
  });
};
module.exports = sendOTP;
