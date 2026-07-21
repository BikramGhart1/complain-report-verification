// ── USER DASHBOARD & COMPLAINTS ───────────────────────────────────────────────
import { toast } from "react-toastify";
import axiosInstance from "../api/axiosInstance";

export const getUserDashboardStats = async () => {
  const { data } = await axiosInstance.get("/complaints/stats/user/");
  // Expected: { total, underReview, forwarded, closed }
  return data;
};

export const getUserComplaints = async ({
  page = 1,
  limit = 10,
  status = "",
  search = "",
} = {}) => {
  const params = new URLSearchParams({ page, limit });
  if (status) params.append("status", status);
  if (search) params.append("search", search);
  // const { data } = await axiosInstance.get(`/complaints/my?${params}/`);
  const { data } = await axiosInstance.get(`/complaints/`);
  // Expected: { complaints: [...], total, page, limit }
  return data;
};

export const getComplaintById = async (id) => {
  const { data } = await axiosInstance.get(`/complaints/${id}/`);
  return data;
};

export const submitComplaint = async (form, evidenceFile) => {
  const fd = new FormData();

  fd.append("title", form.title);
  fd.append("description", form.description);
  fd.append("incident_date", form.incidentDate);
  fd.append("is_self_accused", form.isVictim);
  fd.append("is_anonymous", form.keepConfidential);

  fd.append("victim_first_name", form.victimFirstName);
  fd.append("victim_middle_name", form.victimMiddleName);
  fd.append("victim_last_name", form.victimLastName);
  fd.append("victim_phone_number", form.victimPhone);

  fd.append("perpetrator_first_name", form.suspectName);
  fd.append(
    "crime_location",
    `${form.suspectPlatform} — ${form.suspectProfileUrl}`.trim(),
  );

  // tags is ManyToMany — send as multiple entries
  if (form.tagIds?.length) {
    form.tagIds.forEach((id) => fd.append("tags", id));
  }

  if (evidenceFile) {
    fd.append("evidence_image", evidenceFile);
  }

  const { data } = await axiosInstance.post("/complaints/", fd);
  return data;
};

export const getTags = async () => {
  const { data } = await axiosInstance.get("/complaints/tags/");
  return data; // [{ id, name }, ...]
};

// ── ADMIN DASHBOARD & COMPLAINTS ──────────────────────────────────────────────

export const getAdminDashboardStats = async () => {
  const { data } = await axiosInstance.get("/admin/complaints/stats/");
  // Expected: { total, underReview, forwarded, closed }
  return data;
};

export const getAdminComplaints = async ({
  page = 1,
  limit = 30,
  status = "",
  category = "",
  fromDate = "",
  toDate = "",
  search = "",
} = {}) => {
  const params = new URLSearchParams({ page, limit });
  if (status) params.append("status", status);
  if (category) params.append("category", category);
  if (fromDate) params.append("fromDate", fromDate);
  if (toDate) params.append("toDate", toDate);
  if (search) params.append("search", search);
  const { data } = await axiosInstance.get(`/complaints?${params}/`);
  // Expected: { complaints: [...], total, page, limit }
  return data;
};

export const updateComplaintStatus = async (id, status) => {
  const { data } = await axiosInstance.patch(`/complaints/${id}/status/`, {
    status, // "approved" | "rejected"
  });
  return data;
};

export const addComplaintComment = async (id, body) => {
  const { data } = await axiosInstance.post(`/complaints/${id}/comments/`, {
    body,
  });
  return data;
};

export const reviewComplaint = async (id, { decision, remarks }) => {
  const status = decision === "approve" ? "approved" : "rejected";

  await updateComplaintStatus(id, status);
  try {
    await addComplaintComment(id, remarks);
  } catch (err) {
    toast.error("Status updated, but failed to save remarks. Please add them manually.");
    throw err;
  }
};

// export const reviewComplaint = async (id, { decision, remarks }) => {
//   const { data } = await axiosInstance.post(`/admin/complaints/${id}/review/`, {
//     decision, // 'approve' | 'reject'
//     remarks,
//   });
//   return data;
// };

// ── REPORT ────────────────────────────────────────────────────────────────────

export const downloadComplaintReport = async (id) => {
  const response = await axiosInstance.get(`/complaints/${id}/report/`, {
    responseType: "blob",
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `complaint-report-${id}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
