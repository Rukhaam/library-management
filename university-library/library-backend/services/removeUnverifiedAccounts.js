import cron from 'node-cron';
import db from '../config/db.js';

export const startAccountCleanupJob = () => {
    // Run every day at exactly midnight
    cron.schedule('0 8 * * *', async () => {
        try {
            console.log('🧹 [CRON] Running unverified accounts cleanup job...');
            
            const [result] = await db.query(
                'DELETE FROM users WHERE account_verified = false AND verification_code_expire < NOW()'
            );

            if (result.affectedRows > 0) {
                console.log(`✅ [CRON] Automatically deleted ${result.affectedRows} unverified accounts.`);
            }
        } catch (error) {
            console.error('❌ [CRON] Error during account cleanup:', error.message);
        }
    });
};