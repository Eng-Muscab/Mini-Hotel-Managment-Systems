import { getAllBeds, getBedById, manageBeds } from "./bed.service.js";

export const bedController = async (req, res) => {
  const { id } = req.params;

  try {
    switch (req.method) {
      case "GET":
        if (id) {
          const bed = await getBedById(id);
          return bed
            ? res.status(200).json(bed)
            : res.status(404).json({ message: "Bed not found" });
        }
        const beds = await getAllBeds();
        return res.status(200).json(beds);
      case "POST":
        const { name, type } = req.body;
        if (!name || !type) {
          return res.status(400).json({ error: "Name and type are required" });
        }
        const createRes = await manageBeds("CREATE", null, name, type);
        return res.status(201).json(createRes);
      case "PUT":
        if (!id) {
          return res.status(400).json({ error: "Bed ID required" });
        }
        const { name: uName, type: uType } = req.body;
        const updateRes = await manageBeds("UPDATE", id, uName, uType);
        return res.status(200).json(updateRes);
      case "DELETE":
        if (!id) {
          return res.status(400).json({ error: "Bed ID required" });
        }
        const deleteRes = await manageBeds("DELETE", id);
        return res.status(200).json(deleteRes);
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
