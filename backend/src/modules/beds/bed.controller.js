import * as bedService from "./bed.service.js";

export const getAllBeds = async (req, res) => {
  try {
    const beds = await bedService.getAllBeds();
    res.json({
      success: true,
      data: beds.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getBedById = async (req, res) => {
  try {
    const { id } = req.params;
    const bed = await bedService.getBedById(id);

    if (!bed) {
      return res.status(404).json({
        success: false,
        error: "Bed not found",
      });
    }

    res.json({
      success: true,
      data: bed,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const createBed = async (req, res) => {
  try {
    const { bed_serial, type } = req.body;

    if (!bed_serial || !type) {
      return res.status(400).json({
        success: false,
        error: "Bed serial number and type are required",
      });
    }

    const bed = await bedService.createBed(bed_serial, type);
    res.json({
      success: true,
      data: bed,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const updateBed = async (req, res) => {
  try {
    const { id } = req.params;
    const { bed_serial, type, is_available } = req.body;

    const bed = await bedService.updateBed(
      id,
      bed_serial,
      type,
      is_available
    );
    res.json({
      success: true,
      data: bed,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const deleteBed = async (req, res) => {
  try {
    const { id } = req.params;
    const bed = await bedService.deleteBed(id);
    res.json({
      success: true,
      data: bed,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const updateBedStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const bed = await bedService.updateBedStatus(id, status);
    res.json({
      success: true,
      data: bed,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ✅ FIXED: Use the service layer properly
export const countBeds = async (req, res) => {
  try {
    const result = await bedService.countBeds();

    res.json({
      success: true,
      count: result.total, // Access the total count
      message: `Total beds: ${result.total}`,
      data: result,
    });
  } catch (error) {
    console.error("Count beds error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to count beds",
      details: error.message,
    });
  }
};
