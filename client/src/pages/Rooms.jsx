import { useEffect, useState } from "react";
import {
  fetchRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} from "../services/rooms";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({ name: "", type: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchRooms();
      setRooms(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.type) return;

    if (editingId) {
      await updateRoom(editingId, { name: form.name, type: form.type });
    } else {
      await createRoom({ name: form.name, type: form.type });
    }
    setForm({ name: "", type: "" });
    setEditingId(null);
    loadData();
  };

  const startEdit = (room) => {
    setEditingId(room.r_id);
    setForm({ name: room.name, type: room.type });
  };

  const remove = async (id) => {
    if (confirm("Delete this room?")) {
      await deleteRoom(id);
      loadData();
    }
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Rooms</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="overflow-x-auto bg-base-100 rounded-xl shadow">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-10">
                      Loading…
                    </td>
                  </tr>
                ) : rooms.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-10">
                      No rooms
                    </td>
                  </tr>
                ) : (
                  rooms.map((r, i) => (
                    <tr key={r.r_id}>
                      <td>{i + 1}</td>
                      <td>{r.name}</td>
                      <td>{r.type}</td>
                      <td className="text-right space-x-2">
                        <button
                          className="btn btn-sm"
                          onClick={() => startEdit(r)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-error"
                          onClick={() => remove(r.r_id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-base-100 rounded-xl shadow p-4">
          <h3 className="font-semibold mb-3">
            {editingId ? "Update Room" : "Add Room"}
          </h3>
          <form onSubmit={submit} className="space-y-3">
            <input
              className="input input-bordered w-full"
              placeholder="Room name/number"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="input input-bordered w-full"
              placeholder="Type (Single, Double, Suite)"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            />
            <button className="btn btn-primary w-full" type="submit">
              {editingId ? "Update" : "Create"}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-ghost w-full"
                onClick={() => {
                  setEditingId(null);
                  setForm({ name: "", type: "" });
                }}
              >
                Cancel
              </button>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
