import { getAllRoomBeds, getRoomBedsById, manageRoomBeds } from "./rm.service.js";

export const roomBedsController = async (req, res) => {
    const {id} = req.params;

    try{
        switch(req.method){
            case "GET":
                if(id){
                    const roomBed = await getRoomBedsById(id);
                    return roomBed
                        ? res.status(200).json(roomBed)
                        : res.status(404).json({message: "Room Bed not found"});
                }
                const roomBeds = await getAllRoomBeds();
                return res.status(200).json(roomBeds);
            case "POST":
                const {room_id, bed_id, amount, state, iswifi, isac, istv} = req.body;
                if(!room_id || !bed_id || !amount || !state || !iswifi || !isac || !istv){
                    return res.status(400).json({error: "All fields are required"});
                }
                const createRes = await manageRoomBeds("CREATE", null, room_id, bed_id, amount, state, iswifi, isac, istv);
                return res.status(201).json(createRes);
            case "PUT":
                if(!id){
                    return res.status(400).json({error: "Room Bed ID required"});
                }
                const {room_id: uRoomId, bed_id: uBedId, amount: uAmount, state: uState, iswifi: uIswifi, isac: uIsac, istv: uIstv} = req.body;
                const updateRes = await manageRoomBeds("UPDATE", id, uRoomId, uBedId, uAmount, uState, uIswifi, uIsac, uIstv);
                return res.status(200).json(updateRes);
            case "DELETE":
                if(!id){
                    return res.status(400).json({error: "Room Bed ID required"});
                }
                const deleteRes = await manageRoomBeds("DELETE", id);
                return res.status(200).json(deleteRes);
        }
    }
    catch(err){
        return res.status(500).json({error: err.message});
    }
};

