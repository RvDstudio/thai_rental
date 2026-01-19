import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { count, desc, eq } from "drizzle-orm";
import {
  Users,
  Building,
  FileText,
  TrendingUp,
  UserPlus,
  Activity,
} from "lucide-react";

async function getDashboardStats() {
  const [userCount] = await db.select({ count: count() }).from(user);
  const [adminCount] = await db
    .select({ count: count() })
    .from(user)
    .where(eq(user.role, "admin"));

  const recentUsers = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      role: user.role,
    })
    .from(user)
    .orderBy(desc(user.createdAt))
    .limit(5);

  return {
    totalUsers: userCount.count,
    totalAdmins: adminCount.count,
    recentUsers,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-blue-500",
      change: "+12%",
    },
    {
      label: "Admin Users",
      value: stats.totalAdmins,
      icon: UserPlus,
      color: "bg-purple-500",
      change: null,
    },
    {
      label: "Properties",
      value: 24,
      icon: Building,
      color: "bg-green-500",
      change: "+5%",
    },
    {
      label: "Active Rentals",
      value: 18,
      icon: FileText,
      color: "bg-amber-500",
      change: "+8%",
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#122B45]">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Welcome back! Here&apos;s what&apos;s happening with your platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}
              >
                <stat.icon size={24} className="text-white" />
              </div>
              {stat.change && (
                <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
                  <TrendingUp size={16} />
                  {stat.change}
                </span>
              )}
            </div>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Users */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Users</h2>
            <a
              href="/admin/users"
              className="text-sm text-[#122B45] hover:underline"
            >
              View all
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    User
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Role
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.recentUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-gray-50 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#122B45] flex items-center justify-center text-white font-medium">
                          {u.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {u.name || "Unnamed"}
                          </p>
                          <p className="text-sm text-gray-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          u.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {u.role || "user"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Unknown"}
                    </td>
                  </tr>
                ))}
                {stats.recentUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="py-8 text-center text-gray-500"
                    >
                      No users yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Activity */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Activity size={20} className="text-[#122B45]" />
            <h2 className="text-lg font-semibold text-gray-900">
              Quick Actions
            </h2>
          </div>

          <div className="space-y-3">
            <a
              href="/admin/users"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Users size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Manage Users</p>
                <p className="text-sm text-gray-500">View and edit users</p>
              </div>
            </a>

            <a
              href="/admin/properties"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <Building size={20} className="text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Add Property</p>
                <p className="text-sm text-gray-500">List a new property</p>
              </div>
            </a>

            <a
              href="/admin/rentals"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                <FileText size={20} className="text-amber-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">View Rentals</p>
                <p className="text-sm text-gray-500">Manage rental agreements</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
