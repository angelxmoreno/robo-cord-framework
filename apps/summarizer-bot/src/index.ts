import { DatabaseService, UserEntity } from '@robo-cord/framework';
import { config } from './config.ts';

(async () => {
    let dbService: DatabaseService | undefined;
    try {
        dbService = new DatabaseService(config);
        await dbService.start();
        const users = await dbService.dataSource.getRepository(UserEntity).find();
        console.log({ users });
    } catch (error) {
        console.error('❌ Database configuration test failed:', error);
        throw error; // Rethrow to outer catch
    } finally {
        if (dbService) {
            await dbService.stop();
        }
    }
})().catch((error) => {
    console.error(error);
    process.exit(1);
});
