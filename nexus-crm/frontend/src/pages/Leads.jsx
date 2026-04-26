import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth, API } from "../context/AuthContext";
import LeadForm from "../components/LeadForm";
import { StatusBadge, getInitials } from "../components/Card";
import { useNavigate } from "react-router-dom";

export default function Leads() {
  const { showToast, authHeader, leads, setLeads, user } = useAuth();
  const [loading,   setLoading]   = useState(true);
  const [filter,    setFilter]    = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing,   setEditing]   = useState(null);

  const navigate = useNavigate();

  // Only redirect to login if user/token are missing, but never redirect
  // to dashboard from here. Stay on leads page after refresh if authenticated.
  useEffect(() => {
    const token = localStorage.getItem("token");
    // If not authenticated, redirect to login; else, do nothing (stay on leads)
    if (!user && !token) {
      navigate("/login");
    }
    // Do not navigate anywhere else!
    // eslint-disable-next-line
  }, [user, navigate]);

  // Fetch all leads from backend
  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/leads`, authHeader());
      setLeads(res.data);
    } catch (error) {
      console.error("Fetch Leads Error:", error);
      showToast("Failed to load leads", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
    // eslint-disable-next-line
  }, []);

  // Filtered list depending on status
  const filtered = leads.filter(
    (l) => filter === "all" || l.status === filter
  );

  // Modal helpers
  const openAdd  = ()     => { setEditing(null); setModalOpen(true); };
  const openEdit = (lead) => { setEditing(lead); setModalOpen(true); };

  // Create lead handler
  const handleCreate = async (form) => {
    try {
      if (
        !form.name ||
        !form.email ||
        !form.status
      ) {
        showToast("Please provide all required lead details.", "danger");
        return;
      }

      const createRes = await axios.post(
        `${API}/leads`,
        form,
        authHeader()
      );
      if (!createRes.data || !createRes.data._id) {
        throw new Error("No lead was created.");
      }

      await fetchLeads();

      setModalOpen(false);
      setEditing(null);

      showToast(
        "Lead added successfully!",
        "success"
      );
    } catch (error) {
      console.error("Create Lead Error:", error);

      if (error.response && error.response.data && error.response.data.message) {
        showToast(error.response.data.message, "danger");
      } else {
        showToast(
          error.message || "Failed to add lead",
          "danger"
        );
      }
    }
  };

  // Edit lead handler
  const handleEdit = async (form) => {
    try {
      if (!editing || !editing._id) {
        showToast("No lead selected for editing.", "danger");
        return;
      }

      const editRes = await axios.put(
        `${API}/leads/${editing._id}`,
        form,
        authHeader()
      );
      if (!editRes.data || !editRes.data._id) {
        throw new Error("Lead not updated in backend.");
      }

      await fetchLeads();

      setModalOpen(false);
      setEditing(null);

      showToast(
        "Lead updated successfully!",
        "success"
      );
    } catch (error) {
      console.error("Edit Lead Error:", error);

      if (error.response && error.response.data && error.response.data.message) {
        showToast(error.response.data.message, "danger");
      } else {
        showToast(
          error.message || "Failed to update lead",
          "danger"
        );
      }
    }
  };

  // Save router
  const handleSave = (form) => (editing ? handleEdit(form) : handleCreate(form));

  // Delete lead handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      const delRes = await axios.delete(`${API}/leads/${id}`, authHeader());
      await fetchLeads();
      showToast("Lead deleted successfully!", "success");
    } catch (error) {
      console.error("Delete Lead Error:", error);
      if (error.response && error.response.data && error.response.data.message) {
        showToast(error.response.data.message, "danger");
      } else {
        showToast("Failed to delete lead", "danger");
      }
    }
  };

  // Render
  return (
    <div style={{ padding: "30px", background: "#f5f8fc", minHeight: "100vh" }}>

      {/* HEADER */}
      <div className="section-header">
        <div className="section-title">Lead Management</div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Lead</button>
      </div>

      {/* FILTERS */}
      <div className="filters">
        {["all", "New", "Contacted", "Converted"].map((f) => (
          <div
            key={f}
            className={`filter-btn${filter === f ? " active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "All Leads" : f}
          </div>
        ))}
      </div>

      {/* TABLE */}
      <div className="table-wrap">
        {loading ? (
          <div className="empty-state">
            <div className="empty-text">Loading leads...</div>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Company</th>
                <th>Contact</th>
                <th>Source</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length ? (
                filtered.map((l) => (
                  <tr key={l._id}>

                    {/* NAME */}
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{
                          width: 30, height: 30, borderRadius: "50%",
                          background: "var(--blue-light)", color: "var(--blue)",
                          fontSize: 11, fontWeight: 700,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          {getInitials(l.name)}
                        </div>
                        <span className="td-name">{l.name}</span>
                      </div>
                    </td>

                    <td>{l.company || "—"}</td>

                    {/* CONTACT */}
                    <td>
                      <div style={{ fontSize: 12 }}>
                        {l.email || "—"}<br />
                        <span style={{ color: "var(--text-3)" }}>{l.phone || "—"}</span>
                      </div>
                    </td>

                    <td>{l.source || "—"}</td>
                    <td><StatusBadge status={l.status} /></td>

                    {/* ACTIONS */}
                    <td>
                      <div className="td-actions">
                        <button className="btn btn-outline btn-sm" onClick={() => openEdit(l)}>Edit</button>
                        <button className="btn btn-danger btn-sm"  onClick={() => handleDelete(l._id)}>Delete</button>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">
                    <div className="empty-state">
                      <div className="empty-icon">🎯</div>
                      <div className="empty-text">No leads found.</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL */}
      <LeadForm
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initial={editing}
      />
    </div>
  );
}