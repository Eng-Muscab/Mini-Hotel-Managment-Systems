export default function Dashboard() {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat bg-base-100 rounded-xl shadow">
          <div className="stat-title">Rooms</div>
          <div className="stat-value">—</div>
          <div className="stat-desc">Total rooms</div>
        </div>
        <div className="stat bg-base-100 rounded-xl shadow">
          <div className="stat-title">Bookings</div>
          <div className="stat-value">—</div>
          <div className="stat-desc">This month</div>
        </div>
        <div className="stat bg-base-100 rounded-xl shadow">
          <div className="stat-title">Revenue</div>
          <div className="stat-value">$ —</div>
          <div className="stat-desc">This month</div>
        </div>
      </div>
    </section>
  );
}
