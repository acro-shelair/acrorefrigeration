"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Pencil, Trash2, Search } from "lucide-react";

interface ActivityLog {
  id: string;
  user_email: string;
  action: "create" | "update" | "delete";
  table_name: string;
  details: string;
  created_at: string;
}

const ACTION_COLORS = {
  create: "default",
  update: "secondary",
  delete: "destructive",
} as const;

const ACTION_ICONS = {
  create: PlusCircle,
  update: Pencil,
  delete: Trash2,
};

const TABLE_LABELS: Record<string, string> = {
  posts: "Posts", services: "Services", industries: "Industries",
  brands: "Brands", other_brands: "Other Brands", testimonials: "Testimonials",
  users: "Users", projects: "Projects", faqs: "FAQs",
};

function formatRelative(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return "just now";
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7)   return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
}

export default function LogsClient({ logs }: { logs: ActivityLog[] }) {
  const [search, setSearch]       = useState("");
  const [filterAction, setFilterAction] = useState("all");
  const [filterTable, setFilterTable]   = useState("all");

  const tables = [...new Set(logs.map((l) => l.table_name))].sort();

  const filtered = logs.filter((log) => {
    if (filterAction !== "all" && log.action !== filterAction) return false;
    if (filterTable  !== "all" && log.table_name !== filterTable) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        log.details.toLowerCase().includes(q) ||
        log.user_email.toLowerCase().includes(q) ||
        log.table_name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Activity Logs</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Last 200 admin actions — create, update, and delete events.
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search logs…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={filterAction} onValueChange={setFilterAction}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Action" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="create">Create</SelectItem>
            <SelectItem value="update">Update</SelectItem>
            <SelectItem value="delete">Delete</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterTable} onValueChange={setFilterTable}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Table" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tables</SelectItem>
            {tables.map((t) => (
              <SelectItem key={t} value={t}>{TABLE_LABELS[t] ?? t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {(["create", "update", "delete"] as const).map((action) => {
          const count = logs.filter((l) => l.action === action).length;
          const Icon = ACTION_ICONS[action];
          return (
            <div key={action} className="bg-card border border-border rounded-xl px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-bold">{count}</p>
                <p className="text-xs text-muted-foreground capitalize">{action}s</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Log list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground text-sm">
          {logs.length === 0
            ? "No activity logged yet. Actions will appear here as you use the admin panel."
            : "No logs match your filters."}
        </div>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Action</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Table</th>
                <th className="text-left px-4 py-3 font-medium">Details</th>
                <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">User</th>
                <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">When</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log, i) => {
                const Icon = ACTION_ICONS[log.action] ?? Pencil;
                return (
                  <tr key={log.id} className={i < filtered.length - 1 ? "border-b border-border" : ""}>
                    <td className="px-4 py-3">
                      <Badge variant={ACTION_COLORS[log.action] ?? "secondary"} className="gap-1">
                        <Icon className="w-3 h-3" />
                        <span className="capitalize">{log.action}</span>
                      </Badge>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs font-medium bg-secondary px-2 py-1 rounded-md">
                        {TABLE_LABELS[log.table_name] ?? log.table_name}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-[240px] truncate text-muted-foreground">
                      {log.details}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell text-xs truncate max-w-[160px]">
                      {log.user_email}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell text-xs whitespace-nowrap">
                      {formatRelative(log.created_at)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="px-4 py-2 bg-secondary border-t border-border text-xs text-muted-foreground">
            Showing {filtered.length} of {logs.length} entries
          </div>
        </div>
      )}
    </div>
  );
}
