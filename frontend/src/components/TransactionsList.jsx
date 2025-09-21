function Row({ t, onDelete }) {
  const dateStr = new Date(t.date).toLocaleDateString();
  return (
    <tr className="border-b">
      <td className="p-2">{dateStr}</td>
      <td className="p-2">{t.category}</td>
      <td className="p-2">{t.type}</td>
      <td className="p-2">₹{t.amount.toLocaleString()}</td>
      <td className="p-2">{t.notes}</td>
      <td className="p-2">
        <button
          onClick={() => onDelete(t._id)}
          className="text-sm px-2 py-1 bg-red-500 text-white rounded"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

export default function TransactionsList({ transactions = [], onDelete }) {
  if (!transactions.length)
    return <div className="p-2 text-sm text-gray-600">No transactions yet</div>;
  return (
    <div className="overflow-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Date</th>
            <th className="p-2">Category</th>
            <th className="p-2">Type</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Notes</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <Row key={t._id} t={t} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
