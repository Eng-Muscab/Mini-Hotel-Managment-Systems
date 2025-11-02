import sydClass from "../../core/sydClass.js";


const syd = new sydClass();


export const getAllBeds = async () => {
    return await syd.search("SELECT * FROM beds ORDER BY b_id ASC");
};

export const getBedById = async (id) => {
    const result = await syd.search("SELECT * FROM beds WHERE b_id = $1", [id]);
    return result[0] || null;
};

export const manageBeds = async (action, id = null, bed_seriel_number = null, type = null) => {
    return await syd.operation("SELECT bed_manage($1, $2, $3)", [action, id, bed_seriel_number, type]);
};