import { createConfig, DatabaseService, UserEntity } from '@robo-cord/framework';
import type { DataSourceOptions } from 'typeorm';
import { z } from 'zod';

const ConfigSchema = z.object({
    ollamaUrl: z.url(),
});

const config = createConfig(ConfigSchema, {
    ollamaUrl: process.env.OLLAMA_URL || '',
});

async function testDatabaseConfiguration() {
    console.log('🔗 Testing database configuration and framework integration...');

    try {
        // Test 1: Verify config system provides database configuration
        console.log('📋 Testing config system integration...');
        const dbConfig = config.database;

        if (!dbConfig.host || !dbConfig.port || !dbConfig.database || !dbConfig.username || !dbConfig.password) {
            throw new Error('Database configuration is incomplete');
        }

        console.log('✅ Database configuration is complete');

        // Test 2: Create DataSource options from config
        const dataSourceOptions: DataSourceOptions = {
            type: 'postgres',
            host: dbConfig.host,
            port: dbConfig.port,
            database: dbConfig.database,
            username: dbConfig.username,
            password: dbConfig.password,
            synchronize: true, // Only for development - creates tables automatically
            logging: false, // Disable logging for tests
        };

        console.log('✅ DataSource options created from framework config');

        // Test 3: Initialize DatabaseService (without connecting)
        const databaseService = new DatabaseService(dataSourceOptions);
        console.log('✅ DatabaseService initialized successfully');

        // Test 4: Verify DataSource is accessible
        const dataSource = databaseService.dataSource;
        const options = dataSource.options as any; // Type assertion for PostgreSQL options
        console.log('✅ DataSource accessible:', {
            type: options.type,
            host: options.host,
            database: options.database,
            entitiesCount: options.entities?.length || 0,
        });

        // Test 5: Test creating entity instances (no DB required)
        const testUser = new UserEntity();
        testUser.id = '123456789012345678';
        testUser.username = 'test_user';
        testUser.isBot = false;
        testUser.isSystem = false;
        testUser.publicFlags = 0;

        console.log('✅ UserEntity instantiated successfully:', {
            id: testUser.id,
            username: testUser.username,
            isBot: testUser.isBot,
        });

        // Test 6: Verify framework exports are working
        console.log('✅ Framework exports working (DatabaseService, UserEntity imported successfully)');

        console.log('\n🎉 All database configuration tests passed!');
        console.log('📝 Framework database layer is ready for connection when PostgreSQL is available.');

        // Note about actual database connection
        console.log('\n💡 To test actual database connection:');
        console.log('   1. Start PostgreSQL: docker-compose up -d postgres');
        console.log('   2. Uncomment the database connection test below');
    } catch (error) {
        console.error('❌ Database configuration test failed:', error);
        process.exit(1);
    }
}

// Uncomment this function to test actual database connection when PostgreSQL is running
/*
async function testActualDatabaseConnection() {
    console.log('🔗 Testing actual database connection...');
    
    const dataSourceOptions: DataSourceOptions = {
        type: 'postgres',
        host: config.database.host,
        port: config.database.port,
        database: config.database.database,
        username: config.database.username,
        password: config.database.password,
        synchronize: true,
        logging: true,
    };

    const databaseService = new DatabaseService(dataSourceOptions);
    
    try {
        await databaseService.start();
        console.log('✅ Database connected successfully!');
        
        const userRepository = databaseService.dataSource.getRepository(UserEntity);
        console.log('✅ UserEntity repository available:', !!userRepository);
        
        await databaseService.stop();
        console.log('✅ Database connection closed successfully!');
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        throw error;
    }
}
*/

console.log('📋 Configuration loaded:', {
    ollamaUrl: config.ollamaUrl,
    database: {
        host: config.database.host,
        port: config.database.port,
        database: config.database.database,
        username: config.database.username,
        // Don't log password for security
        passwordProvided: !!config.database.password,
    },
});

// Run database configuration test
testDatabaseConfiguration().catch(console.error);
