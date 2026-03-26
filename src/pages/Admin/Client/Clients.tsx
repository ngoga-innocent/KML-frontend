import { useState,useEffect } from "react";
import { useGetClientsQuery } from "../../../api/clientApi";

import ClientStats from "./ClientStats";
import ClientFilters from "./ClientFilters";
import ClientTable from "./ClientTable";
import ClientDrawer from "./ClientDrawer";

export default function Clients() {
  const { data: clients = [], isLoading,refetch } = useGetClientsQuery();
  useEffect(() => {
  refetch();
}, []);
  console.log(clients);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("");

const filteredClients = clients.filter((c: any) => {
  const searchLower = search.toLowerCase();

  const matchesSearch =
    c.names?.toLowerCase().includes(searchLower) ||
    c.phone?.includes(search);

  const matchesDistrict =
    !district ||
    c.district?.toLowerCase() === district.toLowerCase();

  return matchesSearch && matchesDistrict;
});
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* STATS */}
      <ClientStats clients={clients} />

      {/* FILTERS */}
      {/* <ClientFilters
        search={search}
        setSearch={setSearch}
        onAdd={() => {
          setSelected(null)
          setOpen(true)
        }}
      /> */}
      <ClientFilters
        search={search}
        setSearch={setSearch}
        district={district}
        setDistrict={setDistrict}
        clients={clients}
        onAdd={() => {
          setSelected(null);
          setOpen(true);
        }}
      />

      {/* <ClientTable clients={filteredClients} /> */}

      {/* TABLE */}

      <ClientTable
        clients={filteredClients}
        isLoading={isLoading}
        onEdit={(c: any) => {
          setSelected(c);
          setOpen(true);
        }}
      />

      {/* DRAWER */}
      <ClientDrawer
        open={open}
        onClose={() => setOpen(false)}
        client={selected}
      />
    </div>
  );
}
