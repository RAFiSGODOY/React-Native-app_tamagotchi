import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";

export type ProductDatabase = {
  id: number;
  tipo: string;
  coin: number;
  name: string;
  hunger: number;
  sleep: number;
  fun: number;
  status: number;
  image: string;
};

export function useProductDatabase() {
  const database = useSQLiteContext();

  const retryAsync = async <T>(fn: (...args: any[]) => Promise<T>, ...args: any[]): Promise<T> => {
    try {
      return await fn(...args);
    } catch (error: any) {
      if (error.message.includes("database is locked")) {
        console.log("Database is locked, retrying...");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return retryAsync(fn, ...args);
      }
      throw error;
    }
  };

  async function createTodo(data: Omit<ProductDatabase, "id">) {
    const statement = await database.prepareAsync(
      `INSERT INTO todo (tipo, coin, name, hunger, sleep, fun, status, image) VALUES ($tipo, $coin, $name, $hunger, $sleep, $fun, $status, $image)`
    );

    return await retryAsync(async () => {
      try {
        const result = await statement.executeAsync({
          $tipo: data.tipo,
          $coin: data.coin,
          $name: data.name,
          $hunger: data.hunger,
          $sleep: data.sleep,
          $fun: data.fun,
          $status: data.status,
          $image: data.image,
        });
        const insertedRowId = result.lastInsertRowId.toLocaleString();
        return { insertedRowId };
      } catch (error) {
        console.error('Erro ao criar o Todo:', error);
        throw error;
      } finally {
        await statement.finalizeAsync();
      }
    });
  }

  async function getId() {
    return await retryAsync(async () => {
      const data = await database.getAllAsync(`SELECT id FROM todo LIMIT 1`);
      if (data) {
        return data.values;
      } else {
        console.log('Nenhum registro encontrado na tabela todo.');
        return null;
      }
    });
  }

  async function getName() {
    return await retryAsync(async () => {
      const data = await database.getAllAsync(`SELECT name FROM todo`);
      return data;
    });
  }

  async function getIdAll() {
    return await retryAsync(async () => {
      const data = await database.getFirstAsync<ProductDatabase>(`SELECT * FROM todo WHERE id = 1`);
      return data;
    });
  }

  async function getAllData() {
    return await retryAsync(async () => {
      const data = await database.getAllAsync(`SELECT * FROM todo`);
      return data;
    });
  }

  async function deleteAllData() {
    return await retryAsync(async () => {
      await database.runAsync(`DROP TABLE todo`);
    });
  }

  async function getTamagotchiById(id: number) {
    return await retryAsync(async () => {
      const data = await database.getFirstAsync<ProductDatabase>(`SELECT * FROM todo WHERE id = ?`, [id]);
      if (data) {
        return data;
      } else {
        console.log(`Nenhum registro encontrado com o ID ${id}.`);
        return null;
      }
    });
  }

  async function updateTamagotchi(id: number, data: Partial<ProductDatabase>) {
    const statement = await database.prepareAsync(
      `UPDATE todo SET 
        coin = $coin,
        hunger = $hunger,
        sleep = $sleep,
        fun = $fun, 
        status = $status
      WHERE id = $id`
    );

    return await retryAsync(async () => {
      try {
        await statement.executeAsync({
          $id: id,
          $coin: data.coin !== undefined ? data.coin : null,
          $hunger: data.hunger !== undefined ? data.hunger : 0,
          $sleep: data.sleep !== undefined ? data.sleep : 0,
          $fun: data.fun !== undefined ? data.fun : 0,
          $status: data.status !== undefined ? data.status : 0,
        });
      } catch (error) {
        console.error('Erro ao atualizar o Tamagotchi:', error);
        throw error;
      } finally {
        await statement.finalizeAsync();
      }
    });
  }

  async function deleteTamagotchiById(id: number) {
    return await retryAsync(async () => {
      await database.runAsync(`DELETE FROM todo WHERE id = ?`, [id]);
    });
  }

  async function deleteTamagotchiByName(name: string) {
    return await retryAsync(async () => {
      const tamagotchi = await database.getFirstAsync<ProductDatabase>(`SELECT id FROM todo WHERE name = ?`, [name]);
  
      if (tamagotchi) {
        await database.runAsync(`DELETE FROM todo WHERE id = ?`, [tamagotchi.id]);
        console.log(`Tamagotchi com o nome "${name}" deletado com sucesso.`);
      } else {
        console.log(`Nenhum registro encontrado com o nome "${name}".`);
      }
    });
  }

  return {
    createTodo,
    getId,
    getName,
    getAllData,
    deleteAllData,
    getIdAll,
    getTamagotchiById,
    updateTamagotchi,
    deleteTamagotchiById,
    deleteTamagotchiByName
  };
}
