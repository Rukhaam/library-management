import cron from 'node-cron';
import db from '../config/db.js';
import { sendEmail } from '../utils/sendEmail.js'; 
import { generateBookReminderTemplate } from '../utils/emailTemplates.js'; // 👈 Import here

export const startNotificationJob = () => {
    cron.schedule('* * * * *', async () => {
        try {
            console.log('📧 [CRON] Checking for due/overdue books...');
            
            const [rows] = await db.query(`
                SELECT u.email, u.name, b.title, br.due_date 
                FROM borrow_records br
                JOIN users u ON br.user_id = u.id
                JOIN books b ON br.book_id = b.id
                WHERE br.return_date IS NULL 
                AND (DATE(br.due_date) = CURDATE() + INTERVAL 1 DAY OR DATE(br.due_date) < CURDATE())
            `);

            if (rows.length === 0) return;

            for (const record of rows) {
                const isOverdue = new Date() > new Date(record.due_date);
                
                // 📝 Generate HTML using the template
                const htmlMessage = generateBookReminderTemplate(
                    record.name, 
                    record.title, 
                    record.due_date, 
                    isOverdue
                );

                const subject = isOverdue 
                    ? `🚨 Overdue Notice: ${record.title}` 
                    : `📅 Library Reminder: ${record.title} is due tomorrow`;

                console.log(`-> Notifying: ${record.email} (${isOverdue ? 'Overdue' : 'Reminder'})`);
                
                await sendEmail({
                    email: record.email,
                    subject: subject,
                    html: htmlMessage,
                });
            }
            console.log(`✅ [CRON] Processed ${rows.length} notifications.`);
            
        } catch (error) {
            console.error('❌ [CRON] Error:', error.message);
        }
    });
};