import * as roomService from './room.service.js';

export const getAllRooms = async (req, res) => {
  try {
    const rooms = await roomService.getAllRooms();
    res.json({ 
      success: true, 
      data: rooms
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await roomService.getRoomById(id);
    
    if (!room) {
      return res.status(404).json({ 
        success: false, 
        error: "Room not found" 
      });
    }
    
    res.json({ 
      success: true, 
      data: room 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

export const createRoom = async (req, res) => {
  try {
    const { name, type } = req.body;
    
    if (!name || !type) {
      return res.status(400).json({ 
        success: false, 
        error: "Room name and type are required" 
      });
    }
    
    const room = await roomService.createRoom(name, type);
    res.json({ 
      success: true, 
      data: room 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, is_active } = req.body;
    
    const room = await roomService.updateRoom(id, name, type, is_active);
    res.json({ 
      success: true, 
      data: room 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await roomService.deleteRoom(id);
    res.json({ 
      success: true, 
      data: room 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

export const updateRoomStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const room = await roomService.updateRoomStatus(id, status);
    res.json({ 
      success: true, 
      data: room 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

export const countRooms = async (req, res) => {
  try {
    const result = await roomService.countRooms();
    
    res.json({ 
      success: true, 
      count: result.total,
      message: `Total rooms: ${result.total}`,
      data: result
    });
  } catch (error) {
    console.error('Count rooms error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to count rooms',
      details: error.message 
    });
  }
};