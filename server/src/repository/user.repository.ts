import { client } from '../config/db';
import { createUserInterface} from '../interfaces/userInterface';



const userRepository = {
  createUser: async (params: createUserInterface) => {
    const { id, email, password, first_Name, last_Name } = params;

    const query = `
      INSERT INTO users_table (id, email, password, first_name, last_name, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING *
    `;

    const values = [id, email, password, first_Name, last_Name];
    const result = await client.query(query, values);

    return result.rows[0];
  },
  findByEmail : async(email : string) => {

    const query = `
    SELECT * FROM users_table WHERE email = $1
    `;

    const result = await client.query(query, [email]);
    return result.rows[0] || null;
}
}


export { userRepository };
