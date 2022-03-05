import { decodeJwt } from "./helpers/jwt-helpers.js";
import { unbanUser } from "./helpers/user-helpers.js";

export async function handler(event, context) {
    if (event.httpMethod !== "GET") {
        return {
            statusCode: 405
        };
    }

    if (event.queryStringParameters.token !== undefined) {
        const unbanInfo = decodeJwt(event.queryStringParameters.token);
        if (unbanInfo.userId !== undefined) {
            try {
                await unbanUser(unbanInfo.userId, process.env.GUILD_ID, process.env.DISCORD_BOT_TOKEN);
                
                return {
                    statusCode: 303,
                    headers: {
                        "Location": `/success?msg=${encodeURIComponent("O usuário foi desbanido\nEntre em contato com ele e informe-o")}`
                    }
                };
            } catch (e) {
                return {
                    statusCode: 303,
                    headers: {
                        "Location": `/error?msg=${encodeURIComponent("Falha ao desbanir usuário\nPor favor, desbanir manualmente")}`
                    }
                };
            }
        }
    }

    return {
        statusCode: 400
    };
}
