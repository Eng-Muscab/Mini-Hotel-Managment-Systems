import api from "./api";

export const fetchRooms = async () => {
  const { data } = await api.get("/api/rooms");
  return data;
};

export const createRoom = async (payload) => {
  const { data } = await api.post("/api/rooms", payload);
  return data;
};

export const updateRoom = async (id, payload) => {
  const { data } = await api.put(`/api/rooms/${id}`, payload);
  return data;
};

export const deleteRoom = async (id) => {
  const { data } = await api.delete(`/api/rooms/${id}`);
  return data;
};
