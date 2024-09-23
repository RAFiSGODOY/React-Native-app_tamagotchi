import { SQLiteDatabase } from 'expo-sqlite';

export async function initDatabase(database: SQLiteDatabase) {
    try {
        await database.execAsync(`  
            CREATE TABLE IF NOT EXISTS todo (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                tipo TEXT NOT NULL, 
                coin INTEGER,
                name TEXT NOT NULL,
                hunger INTEGER,
                sleep INTEGER,
                fun INTEGER,
                status INTEGER,
                image TEXT NOT NULL 
            );
        `);
    } catch (error) {
        console.error("Erro ao criar a tabela ou verificar a estrutura:", error);
    }
}
