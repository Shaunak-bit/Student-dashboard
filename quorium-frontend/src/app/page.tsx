"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Student = {
  id: number;
  name: string;
  course: string;
  status: "Active" | "Inactive";
};

export default function Home() {
  const [students, setStudents] = useState<Student[]>([]);
  const [newStudent, setNewStudent] = useState({ name: "", course: "", status: "Active" });
  const [filter, setFilter] = useState<"All" | "Active" | "Inactive">("All");
  const [search, setSearch] = useState("");

  // Fetch initial students from API with deterministic status
  useEffect(() => {
    fetch("https://dummyjson.com/users")
      .then(res => res.json())
      .then(data => {
        const initialStudents = data.users.map((u: any) => ({
          id: u.id,
          name: `${u.firstName} ${u.lastName}`,
          course: u.university,
          status: u.id % 2 === 0 ? "Active" : "Inactive", // deterministic status
        }));
        setStudents(initialStudents);
      });
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewStudent(prev => ({ ...prev, [name]: value }));
  };

  const handleAddStudent = (e: FormEvent) => {
    e.preventDefault();
    if (!newStudent.name.trim() || !newStudent.course.trim()) return;
    const nextId = students.length ? Math.max(...students.map(s => s.id)) + 1 : 1;
    setStudents([...students, { id: nextId, ...newStudent }]);
    setNewStudent({ name: "", course: "", status: "Active" });
  };

  const filteredStudents = students.filter(
    s =>
      (filter === "All" || s.status === filter) &&
      (s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.course.toLowerCase().includes(search.toLowerCase()))
  );

  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === "Active").length;
  const inactiveStudents = students.filter(s => s.status === "Inactive").length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6 md:p-12">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 text-center md:text-left"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-2">
          Student Management System
        </h1>
        <p className="text-gray-600 text-lg">
          {/* Manage your students efficiently with style and animation */}
        </p>
        <div className="border-b border-gray-200 my-4"></div>
      </motion.header>

      {/* Stats Cards */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.2 } } }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        {[
          { title: "Total Students", value: totalStudents, color: "text-blue-600" },
          { title: "Active Students", value: activeStudents, color: "text-green-600" },
          { title: "Inactive Students", value: inactiveStudents, color: "text-red-600" }
        ].map((card, index) => (
          <motion.div
            key={index}
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:scale-105 transform transition duration-300"
          >
            <div className={`text-4xl font-bold mb-2 ${card.color}`}>{card.value}</div>
            <div className="text-gray-600 font-medium">{card.title}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add Student Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add New Student</h2>
          <form onSubmit={handleAddStudent} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student Name *</label>
              <input
                type="text"
                name="name"
                value={newStudent.name}
                onChange={handleInputChange}
                required
                placeholder="Enter student name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course *</label>
              <input
                type="text"
                name="course"
                value={newStudent.course}
                onChange={handleInputChange}
                required
                placeholder="Enter course name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={newStudent.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-md hover:from-blue-600 hover:to-blue-700 transition duration-200"
            >
              Add Student
            </button>
          </form>
        </motion.div>

        {/* Students List */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-2xl font-semibold text-gray-800">Students List</h2>
            <div className="flex gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search by name or course..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["ID", "Name", "Course", "Status"].map((col) => (
                    <th key={col} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <AnimatePresence>
                  {filteredStudents.map((s) => (
                    <motion.tr
                      key={s.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-gray-50 transition duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{s.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.course}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            s.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-8 text-gray-500">No students found matching your criteria</div>
          )}

          <div className="mt-4 text-sm text-gray-500">
            Showing {filteredStudents.length} of {students.length} students
          </div>
        </motion.div>
      </div>
    </div>
  );
}
