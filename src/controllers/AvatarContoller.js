const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage");

class UserAvatarControler {
    async update(request, response){
        const {id, table} = request.body;
        const avatarFileName = request.file.filename;
        const diskStorage = new DiskStorage();

        const record = await knex(table)
        .where({id: id}).first();

        if(record.avatar){
            await diskStorage.deleteFile(record.avatar);
        }

        const fileName = await diskStorage.saveFile(avatarFileName);
        record.avatar = fileName;

        await knex(table).update(record).where({ id: id });

        return response.json(record);
    }
}

module.exports = UserAvatarControler;