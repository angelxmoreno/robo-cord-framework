import { DatabaseService, UserEntity } from '@robo-cord/framework';
import { config } from './config.ts';

(async () => {
    try {
        const dbService = new DatabaseService(config);
        await dbService.start();
        const users = await dbService.dataSource.getRepository(UserEntity).find();
        console.log({ users });
        await dbService.stop();
    } catch (error) {
        console.error('❌ Database configuration test failed:', error);
    }
})()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(() => {
        process.exit(0);
    });
