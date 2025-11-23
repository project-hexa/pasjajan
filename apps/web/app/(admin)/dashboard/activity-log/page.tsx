import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";

const logs = [
  {
    id: 1,
    time: "2024-06-01T10:00:00Z",
    email: "user@example.com",
    type: "LOGIN",
    action: "User logged in",
    status: "active",
  },
  {
    id: 2,
    time: "2024-06-01T10:15:23Z",
    email: "admin@example.com",
    type: "UPDATE",
    action: "Updated user profile",
    status: "active",
  },
  {
    id: 3,
    time: "2024-06-01T10:30:45Z",
    email: "john.doe@example.com",
    type: "CREATE",
    action: "Created new document",
    status: "active",
  },
  {
    id: 4,
    time: "2024-06-01T11:05:12Z",
    email: "sarah.smith@example.com",
    type: "DELETE",
    action: "Deleted old file",
    status: "inactive",
  },
  {
    id: 5,
    time: "2024-06-01T11:20:38Z",
    email: "mike.johnson@example.com",
    type: "LOGIN",
    action: "User logged in",
    status: "active",
  },
  {
    id: 6,
    time: "2024-06-01T11:45:55Z",
    email: "emily.davis@example.com",
    type: "LOGOUT",
    action: "User logged out",
    status: "inactive",
  },
  {
    id: 7,
    time: "2024-06-01T12:10:22Z",
    email: "david.wilson@example.com",
    type: "UPDATE",
    action: "Modified settings configuration",
    status: "active",
  },
  {
    id: 8,
    time: "2024-06-01T12:35:47Z",
    email: "lisa.anderson@example.com",
    type: "CREATE",
    action: "Added new team member",
    status: "active",
  },
  {
    id: 9,
    time: "2024-06-01T13:00:15Z",
    email: "robert.brown@example.com",
    type: "LOGIN",
    action: "User logged in",
    status: "active",
  },
  {
    id: 10,
    time: "2024-06-01T13:25:33Z",
    email: "jennifer.martinez@example.com",
    type: "UPDATE",
    action: "Changed password",
    status: "active",
  },
  {
    id: 11,
    time: "2024-06-01T13:50:08Z",
    email: "william.garcia@example.com",
    type: "DELETE",
    action: "Removed outdated entry",
    status: "inactive",
  },
  {
    id: 12,
    time: "2024-06-01T14:15:42Z",
    email: "mary.rodriguez@example.com",
    type: "CREATE",
    action: "Generated new report",
    status: "active",
  },
  {
    id: 13,
    time: "2024-06-01T14:40:19Z",
    email: "james.hernandez@example.com",
    type: "LOGIN",
    action: "User logged in",
    status: "active",
  },
  {
    id: 14,
    time: "2024-06-01T15:05:56Z",
    email: "patricia.lopez@example.com",
    type: "UPDATE",
    action: "Updated billing information",
    status: "active",
  },
  {
    id: 15,
    time: "2024-06-01T15:30:27Z",
    email: "richard.gonzalez@example.com",
    type: "LOGOUT",
    action: "User logged out",
    status: "inactive",
  },
  {
    id: 16,
    time: "2024-06-01T15:55:44Z",
    email: "barbara.wilson@example.com",
    type: "CREATE",
    action: "Created new project",
    status: "active",
  },
  {
    id: 17,
    time: "2024-06-01T16:20:11Z",
    email: "thomas.moore@example.com",
    type: "DELETE",
    action: "Archived old records",
    status: "inactive",
  },
  {
    id: 18,
    time: "2024-06-01T16:45:36Z",
    email: "susan.taylor@example.com",
    type: "UPDATE",
    action: "Modified user permissions",
    status: "active",
  },
  {
    id: 19,
    time: "2024-06-01T17:10:52Z",
    email: "daniel.thomas@example.com",
    type: "LOGIN",
    action: "User logged in",
    status: "active",
  },
  {
    id: 20,
    time: "2024-06-01T17:35:28Z",
    email: "nancy.jackson@example.com",
    type: "CREATE",
    action: "Added new dashboard widget",
    status: "active",
  },
  {
    id: 21,
    time: "2024-06-01T18:00:15Z",
    email: "christopher.white@example.com",
    type: "UPDATE",
    action: "Updated system settings",
    status: "active",
  },
  {
    id: 22,
    time: "2024-06-01T18:25:42Z",
    email: "karen.harris@example.com",
    type: "LOGIN",
    action: "User logged in",
    status: "active",
  },
  {
    id: 23,
    time: "2024-06-01T18:50:19Z",
    email: "mark.clark@example.com",
    type: "DELETE",
    action: "Removed inactive users",
    status: "inactive",
  },
  {
    id: 24,
    time: "2024-06-01T19:15:37Z",
    email: "betty.lewis@example.com",
    type: "CREATE",
    action: "Created backup file",
    status: "active",
  },
  {
    id: 25,
    time: "2024-06-01T19:40:54Z",
    email: "george.robinson@example.com",
    type: "UPDATE",
    action: "Modified access controls",
    status: "active",
  },
  {
    id: 26,
    time: "2024-06-01T20:05:21Z",
    email: "dorothy.walker@example.com",
    type: "LOGOUT",
    action: "User logged out",
    status: "inactive",
  },
  {
    id: 27,
    time: "2024-06-01T20:30:48Z",
    email: "steven.hall@example.com",
    type: "LOGIN",
    action: "User logged in",
    status: "active",
  },
  {
    id: 28,
    time: "2024-06-01T20:55:13Z",
    email: "helen.allen@example.com",
    type: "CREATE",
    action: "Generated analytics report",
    status: "active",
  },
  {
    id: 29,
    time: "2024-06-01T21:20:39Z",
    email: "kevin.young@example.com",
    type: "UPDATE",
    action: "Updated notification preferences",
    status: "active",
  },
  {
    id: 30,
    time: "2024-06-01T21:45:06Z",
    email: "sandra.king@example.com",
    type: "DELETE",
    action: "Cleared cache data",
    status: "inactive",
  },
  {
    id: 31,
    time: "2024-06-01T22:10:32Z",
    email: "brian.wright@example.com",
    type: "LOGIN",
    action: "User logged in",
    status: "active",
  },
  {
    id: 32,
    time: "2024-06-01T22:35:58Z",
    email: "donna.lopez@example.com",
    type: "CREATE",
    action: "Added new category",
    status: "active",
  },
  {
    id: 33,
    time: "2024-06-01T23:00:24Z",
    email: "ronald.scott@example.com",
    type: "UPDATE",
    action: "Changed email preferences",
    status: "active",
  },
  {
    id: 34,
    time: "2024-06-01T23:25:51Z",
    email: "carol.green@example.com",
    type: "LOGOUT",
    action: "User logged out",
    status: "inactive",
  },
  {
    id: 35,
    time: "2024-06-01T23:50:17Z",
    email: "jason.adams@example.com",
    type: "LOGIN",
    action: "User logged in",
    status: "active",
  },
  {
    id: 36,
    time: "2024-06-02T00:15:43Z",
    email: "sharon.baker@example.com",
    type: "CREATE",
    action: "Created new workflow",
    status: "active",
  },
  {
    id: 37,
    time: "2024-06-02T00:40:09Z",
    email: "matthew.nelson@example.com",
    type: "DELETE",
    action: "Deleted temporary files",
    status: "inactive",
  },
  {
    id: 38,
    time: "2024-06-02T01:05:36Z",
    email: "michelle.carter@example.com",
    type: "UPDATE",
    action: "Updated security settings",
    status: "active",
  },
  {
    id: 39,
    time: "2024-06-02T01:30:02Z",
    email: "anthony.mitchell@example.com",
    type: "LOGIN",
    action: "User logged in",
    status: "active",
  },
  {
    id: 40,
    time: "2024-06-02T01:55:28Z",
    email: "laura.perez@example.com",
    type: "CREATE",
    action: "Added new integration",
    status: "active",
  },
];

export default function ActivityLog() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Log Aktivitas</h2>
      <Table className="overflow-clip rounded-2xl bg-[#F7FFFB]">
        <TableHeader>
          <TableRow className="bg-[#B9DCCC]">
            <TableHead className="pl-8">Waktu Aktivitas</TableHead>
            <TableHead>Informasi Pengguna</TableHead>
            <TableHead>Tipe Aktivitas</TableHead>
            <TableHead>Aksi</TableHead>
            <TableHead className="pr-8">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="pl-8">{log.time}</TableCell>
              <TableCell>{log.email}</TableCell>
              <TableCell>{log.type}</TableCell>
              <TableCell>{log.action}</TableCell>
              <TableCell className="pr-8">{log.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
