import { client } from '../config/db';
import { createUserInterface} from '../interfaces/userInterface';



const userRepository = {
  createUser: async (params: createUserInterface) => {
    const { id, email, password, first_name, last_name, alpha_api_key, google_id, oauth_provider} = params;

    const query = `
      INSERT INTO users_table (id, email, password, first_name, last_name, alpha_api_key, google_id, oauth_provider, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      RETURNING *
    `;

    const values = [id, email, password, first_name, last_name, alpha_api_key, google_id || null, oauth_provider || null];
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
