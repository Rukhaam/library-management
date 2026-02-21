import cron from 'node-cron';
import db from '../config/db.js';
// import { sendEmail } from '../utils/sendEmail.js'; 

export const startNotificationJob = () => {
    // Run every day at 8:00 AM
    cron.schedule('0 8 * * *', async () => {
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

            if (rows.length === 0) return; // Exit quietly if nothing to do

            for (const record of rows) {
                const isOverdue = new Date() > new Date(record.due_date);
                console.log(`-> Sending ${isOverdue ? 'overdue' : 'reminder'} email to: ${record.email}`);
                
                // await sendEmail({ ... });
            }
            console.log(`✅ [CRON] Successfully processed ${rows.length} email reminders.`);
            
        } catch (error) {
            console.error('❌ [CRON] Error during email notifications:', error.message);
        }
    });
};