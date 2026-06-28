import React, { useState, useEffect, useRef } from "react";
import apiClient from "../api/apiClient";
import { useAuth } from "../context/AuthContext";
import {
  Search,
  Loader2,
  UserCheck,
  CheckCircle,
  XCircle,
  MessageSquare,
  Clock,
  Send,
  AlertCircle
} from "lucide-react";

interface SupportMessageType {
  id: number;
  message: string | null;
  is_admin: boolean;
  created_at: string;
  user?: {
    name: string;
  };
  media?: Array<{
    id: number;
    url: string;
    mime_type: string;
  }>;
}

interface SupportTicketType {
  id: number;
  ticket_number: string;
  subject: string;
  status: string;
  priority: string;
  category: string;
  created_at: string;
  customer?: {
    id: number;
    name: string;
    email: string;
  };
  assigned_admin?: {
    id: number;
    name: string;
    email: string;
  };
  conversation?: SupportMessageType[];
}

export const AdminTicketsPage = () => {
  const { user } = useAuth();
  
  const [tickets, setTickets] = useState<SupportTicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTicket, setActiveTicket] = useState<SupportTicketType | null>(null);
  const [messagesLoading, setMessagesLoading] = useState(false);

  // Filters State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  // Custom Dropdowns State
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
  
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Input reply
  const [replyMessage, setReplyMessage] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/admin/support/tickets", {
        params: {
          search: debouncedSearch || undefined,
          status: statusFilter || undefined,
          priority: priorityFilter || undefined,
        },
      });
      // Collection lists tickets in response.data.data
      setTickets(response.data.data || []);
    } catch (err) {
      console.error("Failed to load tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [debouncedSearch, statusFilter, priorityFilter]);

  const loadTicketDetails = async (ticketId: number) => {
    setMessagesLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/admin/support/tickets/${ticketId}`);
      if (response.data.success) {
        const ticketData = response.data.data;
        const messages = ticketData.conversation || [];
        
        setActiveTicket({
          ...ticketData,
          conversation: messages
        });
      }
    } catch (err) {
      console.error("Failed to load ticket details:", err);
    } finally {
      setMessagesLoading(false);
    }
  };

  useEffect(() => {
    if (activeTicket) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeTicket?.conversation]);

  const handleAssignToMe = async () => {
    if (!activeTicket || !user) return;
    try {
      const response = await apiClient.patch(`/admin/support/tickets/${activeTicket.id}/assign`, {
        assigned_to: user.id,
      });
      if (response.data.success) {
        const updatedTicket = response.data.data;
        setActiveTicket({
          ...updatedTicket,
          conversation: activeTicket.conversation
        });
        // Update item in local list
        setTickets(tickets.map((t) => (t.id === activeTicket.id ? updatedTicket : t)));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to assign ticket.");
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!activeTicket) return;
    try {
      const response = await apiClient.patch(`/admin/support/tickets/${activeTicket.id}/status`, {
        status: newStatus,
      });
      if (response.data.success) {
        const updatedTicket = response.data.data;
        setActiveTicket({
          ...updatedTicket,
          conversation: activeTicket.conversation
        });
        // Update item in local list
        setTickets(tickets.map((t) => (t.id === activeTicket.id ? updatedTicket : t)));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Status transition not allowed.");
    }
  };

  const handlePostReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket || !replyMessage.trim()) return;

    setSubmittingReply(true);
    setError(null);

    try {
      const response = await apiClient.post(`/admin/support/tickets/${activeTicket.id}/reply`, {
        message: replyMessage,
      });

      if (response.data.success) {
        const newMsg = response.data.data;
        const updatedMessages = [...(activeTicket.conversation || []), newMsg];
        
        setActiveTicket({
          ...activeTicket,
          status: "in_progress",
          conversation: updatedMessages,
        });

        setReplyMessage("");
        fetchTickets();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to post reply.");
    } finally {
      setSubmittingReply(false);
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-[#EF4444]/10 text-[#EF4444]";
      case "medium":
        return "bg-[#F59E0B]/10 text-[#F59E0B]";
      default:
        return "bg-[#10B981]/10 text-[#10B981]";
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "bg-[#10B981]/10 text-[#10B981]";
      case "assigned":
        return "bg-[#3B82F6]/10 text-[#3B82F6]";
      case "in_progress":
        return "bg-[#B98EA7]/15 text-[#B98EA7]";
      case "resolved":
        return "bg-[#10B981]/25 text-[#10B981]";
      default:
        return "bg-[#666666]/10 text-[#666666]";
    }
  };

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto w-full flex flex-col h-[calc(100vh-140px)] gap-6 animate-fade-in select-none">
      
      {/* Page Header */}
      <div className="pb-3 border-b border-[#28273F]/5 flex justify-between items-center shrink-0">
        <div>
          <h1 className="font-heading text-2xl text-[#28273F] tracking-wide">
            Support Workspace
          </h1>
          <p className="font-body text-xs text-[#666666] tracking-wide mt-1">
            Resolve incoming queries, assign issues, and trace user support history.
          </p>
        </div>
      </div>

      {/* Main split-pane workspace layout */}
      <div className="flex-grow flex flex-col md:flex-row gap-6 min-h-0">
        
        {/* Left Side: Tickets Inbox List */}
        <div className="w-full md:w-80 shrink-0 bg-white border border-[#28273F]/5 rounded-[24px] flex flex-col shadow-[0_8px_30px_rgba(40,39,63,0.005)] overflow-hidden">
          {/* Header filters */}
          <div className="p-4 border-b border-[#28273F]/5 space-y-3 shrink-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Search ticket, name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: "36px" }}
                className="w-full pr-4 py-2 bg-[#FAF8F5] border border-[#28273F]/10 rounded-[12px] font-body text-xs text-[#28273F] focus:outline-none"
              />
              <Search className="w-4 h-4 text-[#28273F]/40 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Status filter dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsStatusDropdownOpen(!isStatusDropdownOpen);
                    setIsPriorityDropdownOpen(false);
                  }}
                  className="flex items-center justify-between w-full px-2.5 py-1.5 bg-[#FAF8F5] border border-[#28273F]/10 rounded-[10px] font-body text-[10px] text-[#28273F] font-semibold hover:border-[#9D6C76] focus:outline-none transition-all duration-300 cursor-pointer select-none"
                >
                  <span className="truncate">
                    {statusFilter ? statusFilter.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()) : "All Statuses"}
                  </span>
                  <ChevronDown className={`w-3 h-3 text-[#9D6C76] shrink-0 ml-1 transition-transform duration-300 ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isStatusDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setIsStatusDropdownOpen(false)} />
                    <div className="absolute left-0 mt-1 w-36 bg-white border border-[#28273F]/5 rounded-[12px] shadow-[0_8px_30px_rgba(40,39,63,0.08)] p-1.5 z-40 animate-fade-in">
                      {[
                        { label: "All Statuses", value: "" },
                        { label: "Open", value: "open" },
                        { label: "Assigned", value: "assigned" },
                        { label: "In Progress", value: "in_progress" },
                        { label: "Resolved", value: "resolved" },
                        { label: "Closed", value: "closed" }
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setStatusFilter(opt.value);
                            setIsStatusDropdownOpen(false);
                          }}
                          className={`w-full text-left px-2 py-1 rounded-[6px] font-body text-[10px] transition-colors duration-150 ${
                            statusFilter === opt.value
                              ? "bg-[#9D6C76]/10 text-[#9D6C76] font-semibold"
                              : "text-[#28273F] hover:bg-[#FAF8F5]"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Priority filter dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsPriorityDropdownOpen(!isPriorityDropdownOpen);
                    setIsStatusDropdownOpen(false);
                  }}
                  className="flex items-center justify-between w-full px-2.5 py-1.5 bg-[#FAF8F5] border border-[#28273F]/10 rounded-[10px] font-body text-[10px] text-[#28273F] font-semibold hover:border-[#9D6C76] focus:outline-none transition-all duration-300 cursor-pointer select-none"
                >
                  <span className="truncate">
                    {priorityFilter ? priorityFilter.charAt(0).toUpperCase() + priorityFilter.slice(1) : "All Priorities"}
                  </span>
                  <ChevronDown className={`w-3 h-3 text-[#9D6C76] shrink-0 ml-1 transition-transform duration-300 ${isPriorityDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isPriorityDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setIsPriorityDropdownOpen(false)} />
                    <div className="absolute right-0 mt-1 w-36 bg-white border border-[#28273F]/5 rounded-[12px] shadow-[0_8px_30px_rgba(40,39,63,0.08)] p-1.5 z-40 animate-fade-in">
                      {[
                        { label: "All Priorities", value: "" },
                        { label: "Low", value: "low" },
                        { label: "Medium", value: "medium" },
                        { label: "High", value: "high" }
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setPriorityFilter(opt.value);
                            setIsPriorityDropdownOpen(false);
                          }}
                          className={`w-full text-left px-2 py-1 rounded-[6px] font-body text-[10px] transition-colors duration-150 ${
                            priorityFilter === opt.value
                              ? "bg-[#9D6C76]/10 text-[#9D6C76] font-semibold"
                              : "text-[#28273F] hover:bg-[#FAF8F5]"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Ticket items list container */}
          <div className="flex-grow overflow-y-auto p-2 space-y-1 bg-[#FAF8F5]/30">
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-[#9D6C76]" />
              </div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-12 text-[#666666] font-body text-xs">
                No tickets matching criteria.
              </div>
            ) : (
              tickets.map((t) => (
                <div
                  key={t.id}
                  onClick={() => loadTicketDetails(t.id)}
                  className={`p-3.5 rounded-[16px] border text-left cursor-pointer transition-all duration-300 ${
                    activeTicket?.id === t.id
                      ? "bg-white border-[#9D6C76]/30 shadow-md translate-x-1"
                      : "bg-white/60 hover:bg-white border-transparent hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-[#9D6C76]">
                      {t.ticket_number}
                    </span>
                    <span className="text-[9px] text-gray-400 flex items-center gap-1 font-body">
                      <Clock className="w-2.5 h-2.5" />
                      {new Date(t.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-body font-semibold text-xs text-[#28273F] line-clamp-1 mb-1">
                    {t.subject}
                  </h3>
                  <div className="text-[10px] text-gray-500 font-body mb-2.5">
                    By: {t.customer?.name || "Anonymous User"}
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2 py-0.5 rounded-[4px] font-body text-[8px] font-bold uppercase tracking-wider ${getPriorityBadgeClass(t.priority)}`}>
                      {t.priority}
                    </span>
                    <span className={`px-2 py-0.5 rounded-[4px] font-body text-[8px] font-bold uppercase tracking-wider ${getStatusBadgeClass(t.status)}`}>
                      {t.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Conversation Viewer & Workspace */}
        <div className="flex-grow bg-white border border-[#28273F]/5 rounded-[24px] flex flex-col shadow-[0_8px_30px_rgba(40,39,63,0.005)] overflow-hidden min-w-0">
          {!activeTicket ? (
            <div className="flex-grow flex flex-col items-center justify-center p-8 text-center text-[#666666] font-body max-w-md mx-auto">
              <MessageSquare className="w-12 h-12 text-[#28273F]/10 mb-4" />
              <h3 className="font-heading text-base text-[#28273F] mb-1">No Ticket Selected</h3>
              <p className="text-xs font-light leading-relaxed">
                Click on any customer ticket from the inbox list on the left to read correspondence, reply, or assign resolutions.
              </p>
            </div>
          ) : (
            <>
              {/* Ticket Details Header */}
              <div className="p-5 border-b border-[#28273F]/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0 bg-[#FAF8F5]/30">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold tracking-widest text-[#9D6C76]">
                      {activeTicket.ticket_number}
                    </span>
                    <span className="text-[10px] text-gray-400">• Category: {activeTicket.category}</span>
                  </div>
                  <h2 className="font-heading text-base text-[#28273F] tracking-wide leading-tight">
                    {activeTicket.subject}
                  </h2>
                  <div className="text-[10px] text-gray-500 font-body">
                    Owner: <span className="font-semibold">{activeTicket.customer?.name || "Anonymous"}</span> ({activeTicket.customer?.email || ""})
                  </div>
                </div>

                {/* Actions Block */}
                <div className="flex flex-wrap gap-2 items-center">
                  {/* Assign to me */}
                  {(!activeTicket.assigned_admin || activeTicket.assigned_admin.id !== user?.id) && activeTicket.status?.toLowerCase() !== "closed" && (
                    <button
                      onClick={handleAssignToMe}
                      className="inline-flex items-center gap-1.5 bg-white border border-[#28273F]/10 hover:bg-[#FAF8F5] text-[#28273F] px-3.5 py-1.5 rounded-[9999px] font-body text-[10px] font-semibold uppercase tracking-wider transition-all cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      {activeTicket.assigned_admin ? `Reassign to Me` : "Assign to Me"}
                    </button>
                  )}

                  {/* Assignee label */}
                  {activeTicket.assigned_admin && (
                    <span className="text-[10px] font-body text-[#666666] bg-gray-100 px-3 py-1.5 rounded-[9999px] max-w-[150px] truncate">
                      👤 {activeTicket.assigned_admin.name}
                    </span>
                  )}

                  {/* Move to Resolved */}
                  {activeTicket.status?.toLowerCase() === "in_progress" && (
                    <button
                      onClick={() => handleUpdateStatus("resolved")}
                      className="inline-flex items-center gap-1 bg-[#10B981]/15 text-[#10B981] hover:bg-[#10B981]/25 px-3.5 py-1.5 rounded-[9999px] font-body text-[10px] font-semibold uppercase tracking-wider transition-all cursor-pointer"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Resolve
                    </button>
                  )}

                  {/* Close Ticket */}
                  {activeTicket.status?.toLowerCase() !== "closed" && (
                    <button
                      onClick={() => handleUpdateStatus("closed")}
                      className="inline-flex items-center gap-1 bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444]/20 px-3.5 py-1.5 rounded-[9999px] font-body text-[10px] font-semibold uppercase tracking-wider transition-all cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Close
                    </button>
                  )}
                </div>
              </div>

              {/* Chat Feed */}
              <div className="flex-grow overflow-y-auto p-5 space-y-4 bg-[#FCFCFB]">
                {messagesLoading ? (
                  <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-[#9D6C76]" />
                  </div>
                ) : (
                  <>
                    {(activeTicket.conversation || []).map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col max-w-[80%] ${
                          msg.is_admin ? "ml-auto items-end" : "mr-auto items-start"
                        }`}
                      >
                        {/* Bubble */}
                        <div
                          className={`p-4 rounded-[20px] text-xs font-body leading-relaxed ${
                            msg.is_admin
                              ? "bg-[#9D6C76] text-white rounded-tr-none shadow-sm text-right"
                              : "bg-[#FAF8F5] border border-[#28273F]/5 text-[#28273F] rounded-tl-none text-left"
                          }`}
                        >
                          <div>{msg.message}</div>
                          {msg.media && msg.media.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {msg.media.map((med) => {
                                const isPDF = med.mime_type?.includes("pdf");
                                return (
                                  <a
                                    key={med.id}
                                    href={med.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`flex items-center gap-2 p-2 rounded-[8px] border text-[10px] font-semibold font-mono ${
                                      msg.is_admin
                                        ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
                                        : "bg-white border-[#28273F]/10 text-[#9D6C76] hover:bg-[#FAF8F5]"
                                    }`}
                                  >
                                    📎 {isPDF ? "PDF Document" : "Image Attachment"}
                                  </a>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Date/Info */}
                        <span className="text-[9px] text-gray-400 mt-1 font-body px-1">
                          {msg.is_admin ? `Admin` : (activeTicket.customer?.name || "Customer")} •{" "}
                          {new Date(msg.created_at).toLocaleString()}
                        </span>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Reply Box Footer */}
              <div className="p-4 border-t border-[#28273F]/5 shrink-0 bg-white">
                {error && (
                  <div className="flex items-center gap-2 p-2 bg-[#EF4444]/5 border-l-2 border-[#EF4444] rounded-[6px] text-[10px] text-[#EF4444] mb-3">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {activeTicket.status?.toLowerCase() === "closed" ? (
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-[12px] text-center text-xs font-body text-gray-400 font-light select-none">
                    This support ticket has been closed. Reopen or query history if necessary.
                  </div>
                ) : (
                  <form onSubmit={handlePostReply} className="flex gap-3">
                    <textarea
                      rows={1}
                      placeholder="Type your resolution reply here..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      className="flex-grow px-4 py-2.5 bg-[#FAF8F5] border border-[#28273F]/10 rounded-[16px] text-xs text-[#28273F] focus:outline-none resize-none align-middle leading-relaxed"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handlePostReply(e);
                        }
                      }}
                    />
                    <button
                      type="submit"
                      disabled={submittingReply || !replyMessage.trim()}
                      className="bg-[#28273F] hover:bg-[#9D6C76] text-white p-3 rounded-full flex items-center justify-center active:scale-[0.96] transition-all disabled:opacity-50 cursor-pointer shrink-0"
                    >
                      {submittingReply ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </button>
                  </form>
                )}
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminTicketsPage;
