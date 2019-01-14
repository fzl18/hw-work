const nodemailer = require('nodemailer');

class Notice {
    // 邮件通知
    static async mail(to, subject, content) {
        const transporter = nodemailer.createTransport({
            host: gConfig.mail.host,
            port: gConfig.mail.port,
            secure: true,
            auth: {
                user: gConfig.mail.user,
                pass: gConfig.mail.pass
            }
        });

        if (Object.prototype.toString.call(to) === '[object Array]') {
            to = to.join(',');
        }

        const mailOptions = {
            from: {
                name: gConfig.mail.name,
                address: gConfig.mail.user
            },
            to: to,
            subject: subject,
            html: content
        };

        let rst;
        try {
            rst = await transporter.sendMail(mailOptions);
        } catch (e) {
            rst = {};
            gLog.error(e);
        }
        return rst;
    }
}

module.exports = Notice;
