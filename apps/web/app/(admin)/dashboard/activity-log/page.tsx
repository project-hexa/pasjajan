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
    time: "01 Juni 2024, 10:00:00",
    email: "user@example.com",
    type: "LOGIN",
    action: "User logged in",
    status: "active",
  },
  {
    id: 2,
    time: "01 Juni 2024, 10:15:23",
    email: "admin@example.com",
    type: "UPDATE",
    action: "Updated user profile",
    status: "active",
  },
  {
    id: 3,
    time: "01 Juni 2024, 10:30:45",
    email: "john.doe@example.com",
    type: "CREATE",
    action: "Created new document",
    status: "active",
  },
  {
    id: 4,
    time: "01 Juni 2024, 11:05:12",
    email: "sarah.smith@example.com",
    type: "DELETE",
    action: "Deleted old file",
    status: "inactive",
  },
  {
    id: 5,
    time: "01 Juni 2024, 11:20:38",
    email: "mike.johnson@example.com",
    type: "LOGIN",
    action: "User logged in",
    status: "active",
  },
  {
    id: 6,
    time: "01 Juni 2024, 11:45:55",
    email: "emily.davis@example.com",
    type: "LOGOUT",
    action: "User logged out",
    status: "inactive",
  },
  {
    id: 7,
    time: "01 Juni 2024, 12:10:22",
    email: "david.wilson@example.com",
    type: "UPDATE",
    action: "Modified settings configuration",
    status: "active",
  },
  {
    id: 8,
    time: "01 Juni 2024, 12:35:47",
    email: "lisa.anderson@example.com",
    type: "CREATE",
    action: "Added new team member",
    status: "active",
  },
  {
    id: 9,
    time: "01 Juni 2024, 13:00:15",
    email: "robert.brown@example.com",
    type: "LOGIN",
    action: "User logged in",
    status: "active",
  },
  {
    id: 10,
    time: "01 Juni 2024, 13:25:33",
    email: "jennifer.martinez@example.com",
    type: "UPDATE",
    action: "Changed password",
    status: "active",
  },
  {
    id: 11,
    time: "01 Juni 2024, 13:50:08",
    email: "william.garcia@example.com",
    type: "DELETE",
    action: "Removed outdated entry",
    status: "inactive",
  },
  {
    id: 12,
    time: "01 Juni 2024, 14:15:42",
    email: "mary.rodriguez@example.com",
    type: "CREATE",
    action: "Generated new report",
    status: "active",
  },
  {
    id: 13,
    time: "01 Juni 2024, 14:40:19",
    email: "james.hernandez@example.com",
    type: "LOGIN",
    action: "User logged in",
    status: "active",
  },
  {
    id: 14,
    time: "01 Juni 2024, 15:05:56",
    email: "patricia.lopez@example.com",
    type: "UPDATE",
    action: "Updated billing information",
    status: "active",
  },
  {
    id: 15,
    time: "01 Juni 2024, 15:30:27",
    email: "richard.gonzalez@example.com",
    type: "LOGOUT",
    action: "User logged out",
    status: "inactive",
  },
  {
    id: 16,
    time: "01 Juni 2024, 15:55:44",
    email: "barbara.wilson@example.com",
    type: "CREATE",
    action: "Created new project",
    status: "active",
  },
  {
    id: 17,
    time: "01 Juni 2024, 16:20:11",
    email: "thomas.moore@example.com",
    type: "DELETE",
    action: "Archived old records",
    status: "inactive",
  },
  {
    id: 18,
    time: "01 Juni 2024, 16:45:36",
    email: "susan.taylor@example.com",
    type: "UPDATE",
    action: "Modified user permissions",
    status: "active",
  },
  {
    id: 19,
    time: "01 Juni 2024, 17:10:52",
    email: "daniel.thomas@example.com",
    type: "LOGIN",
    action: "User logged in",
    status: "active",
  },
  {
    id: 20,
    time: "01 Juni 2024, 17:35:28",
    email: "nancy.jackson@example.com",
    type: "CREATE",
    action: "Added new dashboard widget",
    status: "active",
  },
  {
    id: 21,
    time: "01 Juni 2024, 18:00:15",
    email: "christopher.white@example.com",
    type: "UPDATE",
    action: "Updated system settings",
    status: "active",
  },
  {
    id: 22,
    time: "01 Juni 2024, 18:25:42",
    email: "karen.harris@example.com",
    type: "LOGIN",
    action: "User logged in",
    status: "active",
  },
  {
    id: 23,
    time: "01 Juni 2024, 18:50:19",
    email: "mark.clark@example.com",
    type: "DELETE",
    action: "Removed inactive users",
    status: "inactive",
  },
  {
    id: 24,
    time: "01 Juni 2024, 19:15:37",
    email: "betty.lewis@example.com",
    type: "CREATE",
    action: "Created backup file",
    status: "active",
  },
  {
    id: 25,
    time: "01 Juni 2024, 19:40:54",
    email: "george.robinson@example.com",
    type: "UPDATE",
    action: "Modified access controls",
    status: "active",
  },
  {
    id: 26,
    time: "01 Juni 2024, 20:05:21",
    email: "dorothy.walker@example.com",
    type: "LOGOUT",
    action: "User logged out",
    status: "inactive",
  },
  {
    id: 27,
    time: "01 Juni 2024, 20:30:48",
    email: "steven.hall@example.com",
    type: "LOGIN",
    action: "User logged in",
    status: "active",
  },
  {
    id: 28,
    time: "01 Juni 2024, 20:55:13",
    email: "helen.allen@example.com",
    type: "CREATE",
    action: "Generated analytics report",
    status: "active",
  },
  {
    id: 29,
    time: "01 Juni 2024, 21:20:39",
    email: "kevin.young@example.com",
    type: "UPDATE",
    action: "Updated notification preferences",
    status: "active",
  },
  {
    id: 30,
    time: "01 Juni 2024, 21:45:06",
    email: "sandra.king@example.com",
    type: "DELETE",
    action: "Cleared cache data",
    status: "inactive",
  },
  {
    id: 31,
    time: "01 Juni 2024, 22:10:32",
    email: "brian.wright@example.com",
    type: "LOGIN",
    action: "User logged in",
    status: "active",
  },
  {
    id: 32,
    time: "01 Juni 2024, 22:35:58",
    email: "donna.lopez@example.com",
    type: "CREATE",
    action: "Added new category",
    status: "active",
  },
  {
    id: 33,
    time: "01 Juni 2024, 23:00:24",
    email: "ronald.scott@example.com",
    type: "UPDATE",
    action: "Changed email preferences",
    status: "active",
  },
  {
    id: 34,
    time: "01 Juni 2024, 23:25:51",
    email: "carol.green@example.com",
    type: "LOGOUT",
    action: "User logged out",
    status: "inactive",
  },
  {
    id: 35,
    time: "01 Juni 2024, 23:50:17",
    email: "jason.adams@example.com",
    type: "LOGIN",
    action: "User logged in",
    status: "active",
  },
  {
    id: 36,
    time: "02 Juni 2024, 00:15:43",
    email: "sharon.baker@example.com",
    type: "CREATE",
    action: "Created new workflow",
    status: "active",
  },
  {
    id: 37,
    time: "02 Juni 2024, 00:40:09",
    email: "matthew.nelson@example.com",
    type: "DELETE",
    action: "Deleted temporary files",
    status: "inactive",
  },
  {
    id: 38,
    time: "02 Juni 2024, 01:05:36",
    email: "michelle.carter@example.com",
    type: "UPDATE",
    action: "Updated security settings",
    status: "active",
  },
  {
    id: 39,
    time: "02 Juni 2024, 01:30:02",
    email: "anthony.mitchell@example.com",
    type: "LOGIN",
    action: "User logged in",
    status: "active",
  },
  {
    id: 40,
    time: "02 Juni 2024, 01:55:28",
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
