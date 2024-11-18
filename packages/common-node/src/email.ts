import nodemailer from 'nodemailer';
import { getConfig } from './config';
import { log } from '@mono/common';
const MAIL_HOST = getConfig("MAIL_HOST");
const MAIL_PORT = parseInt(getConfig("MAIL_PORT")!);
const MAIL_USER = getConfig("MAIL_USER");
const MAIL_PASS = getConfig("MAIL_PASS");
const MAIL_FROM = getConfig("MAIL_FROM");
if (!MAIL_HOST) {
    log("MAIL_HOST 配置无效")
}
if (!MAIL_USER) {
    log("MAIL_USER  配置无效");
}
if (!MAIL_PASS) {
    log("MAIL_PASS 配置无效");
}
if (!MAIL_FROM) {
    log("MAIL_FROM 配置无效");
}
// 创建邮件发送器
const transporter = nodemailer.createTransport({
    host: MAIL_HOST, // SMTP 服务器地址
    port: MAIL_PORT, // SMTP 端口号，通常是 465 或 587
    secure: true, // 使用 SSL 加密
    auth: {
        user: MAIL_USER, // 你的邮箱地址
        pass: MAIL_PASS // 你的邮箱密码或应用专用密码
    }
});

export async function sendEmail(email: string, msg: {
    /**
     * 标题
     */
    subject: string;
    text?: string;
    html?: string;
}) {
    const { subject, text, html } = msg;
    // 邮件选项
    const mailOptions = {
        from: MAIL_FROM, // 发件人地址和姓名
        to: email, // 收件人地址，可以是多个地址，用逗号分隔
        subject,
        text,
        html
    };
    //发送邮件
    const info = await transporter.sendMail(mailOptions);
    return info;
}