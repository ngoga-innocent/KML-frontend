export default function ClientStats({ clients }: any) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">

      <Card title="Total Clients" value={clients.length} />
      {/* <Card title="Active Loans" value="120" />
      <Card title="Total Disbursed" value="RWF 45M" />
      <Card title="Default Rate" value="2.3%" /> */}

    </div>
  )
}

function Card({ title, value }: any) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-xl font-bold mt-2">{value}</h2>
    </div>
  )
}