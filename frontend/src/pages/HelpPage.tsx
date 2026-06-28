import React, { useState, useEffect, useRef } from "react";
import apiClient from "../api/apiClient";
import { useAuth } from "../context/AuthContext";
import {
  LifeBuoy,
  Plus,
  MessageSquare,
  ChevronLeft,
  Send,
  Loader2,
  Clock,
  AlertCircle,
  CheckCircle,
  Inbox,
  ChevronDown
} from "lucide-react";

interface SupportTicketType {
  id: number;
  ticket_number: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  created_at: string;
  conversation?: SupportMessageType[];
}

interface SupportMessageType {
  id: number;
  message: string;
  is_admin: boolean;
  created_at: string;
  user?: {
    id: number;
    name: string;
  };
}

export const HelpPage = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<SupportTicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active Ticket Details
  const [activeTicket, setActiveTicket] = useState<SupportTicketType | null>(null);
  const [ticketMessages, setTicketMessages] = useState<SupportMessageType[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("Product Inquiry");
  const [priority, setPriority] = useState("low");
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Dropdown States and Refs
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [priorityOpen, setPriorityOpen] = useState(false);

  const categorySelectRef = useRef<HTMLDivElement>(null);
  const prioritySelectRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (categorySelectRef.current && !categorySelectRef.current.contains(e.target as Node)) {
        setCategoryOpen(false);
      }
      if (prioritySelectRef.current && !prioritySelectRef.current.contains(e.target as Node)) {
        setPriorityOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/support/tickets");
      // JSON response from resource collection places records inside data
      setTickets(response.data.data || []);
    } catch (err) {
      console.error("Failed to load support tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleOpenTicketDetails = async (ticket: SupportTicketType) => {
    setActiveTicket(ticket);
    setMessagesLoading(true);
    try {
      const response = await apiClient.get(`/support/tickets/${ticket.id}`);
      if (response.data.success) {
        // Eager loaded ticket contains conversation
        const detail = response.data.data;
        setTicketMessages(detail.conversation || []);
        setActiveTicket(detail);
      }
    } catch (err) {
      console.error("Failed to load ticket replies:", err);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!subject || !message) {
      setFormError("Please enter both a subject and a message.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await apiClient.post("/support/tickets", {
        subject,
        category,
        priority,
        message,
      });

      if (response.data.success) {
        const newTicket = response.data.data;
        setTickets([newTicket, ...tickets]);
        setShowForm(false);
        setSubject("");
        setMessage("");
        // Auto-open details for the newly created ticket
        handleOpenTicketDetails(newTicket);
      }
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Failed to create support ticket.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket || !replyText.trim()) return;

    setReplyLoading(true);
    try {
      const response = await apiClient.post(`/support/tickets/${activeTicket.id}/reply`, {
        message: replyText,
      });

      if (response.data.success) {
        const newReply = response.data.data;
        setTicketMessages([...ticketMessages, newReply]);
        setReplyText("");
      }
    } catch (err) {
      console.error("Failed to submit reply:", err);
    } finally {
      setReplyLoading(false);
    }
  };

  const getPriorityBadgeClass = (prio: string) => {
    switch (prio) {
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
      case "in progress":
        return "bg-[#B98EA7]/15 text-[#B98EA7]";
      case "resolved":
        return "bg-[#10B981]/25 text-[#10B981]";
      default:
        return "bg-[#666666]/10 text-[#666666]";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* 1. Chat Detail view */}
      {activeTicket ? (
        <div className="space-y-6">
          <button
            onClick={() => setActiveTicket(null)}
            className="inline-flex items-center gap-1.5 text-[10px] font-body font-bold tracking-widest uppercase text-[#9D6C76] hover:underline cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Tickets
          </button>

          {/* Ticket Header card */}
          <div className="p-5 border border-[#28273F]/5 rounded-[20px] bg-[#FAF8F5]/30 flex flex-wrap justify-between items-center gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-heading text-[#28273F] font-semibold">
                  #{activeTicket.ticket_number}
                </span>
                <span className={`text-[8px] font-body font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${getStatusBadgeClass(activeTicket.status)}`}>
                  {activeTicket.status}
                </span>
              </div>
              <h3 className="font-heading text-base text-[#28273F] tracking-wide">{activeTicket.subject}</h3>
            </div>
            <div className="flex gap-2">
              <span className="bg-[#28273F]/10 text-[#28273F] text-[8px] font-body font-bold tracking-wider uppercase px-2 py-1 rounded">
                Category: {activeTicket.category}
              </span>
              <span className={`text-[8px] font-body font-bold tracking-wider uppercase px-2 py-1 rounded ${getPriorityBadgeClass(activeTicket.priority)}`}>
                Priority: {activeTicket.priority}
              </span>
            </div>
          </div>

          {/* Chat Messages Frame */}
          <div className="border border-[#28273F]/5 rounded-[24px] p-5 h-[340px] overflow-y-auto bg-[#FAF8F5]/10 space-y-4">
            {messagesLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-[#9D6C76]" />
              </div>
            ) : ticketMessages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center font-body text-xs text-[#666666]/60">
                <MessageSquare className="w-6 h-6 opacity-30 mr-2" />
                No messages in this inquiry thread.
              </div>
            ) : (
              ticketMessages.map((msg) => {
                const isUser = !msg.is_admin;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fade-up`}
                  >
                    <div
                      className={`max-w-[75%] p-4 rounded-[18px] text-xs font-body leading-relaxed tracking-wide ${
                        isUser
                          ? "bg-[#28273F] text-white rounded-tr-none shadow-sm"
                          : "bg-[#C597A0]/10 text-[#28273F] border border-[#C597A0]/20 rounded-tl-none"
                      }`}
                    >
                      <div className="flex justify-between items-center gap-4 mb-1 text-[8px] opacity-65 font-bold uppercase tracking-wider">
                        <span>{isUser ? user?.name : "Meraki House Support"}</span>
                        <span>
                          {new Date(msg.created_at).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p>{msg.message}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Reply form box */}
          {["open", "assigned", "in_progress", "in progress"].includes(activeTicket.status.toLowerCase()) ? (
            <form onSubmit={handleSendReply} className="flex gap-3">
              <input
                type="text"
                placeholder="Compose reply to support..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                disabled={replyLoading}
                className="flex-grow px-4 py-3 bg-[#FAF8F5] border border-[#28273F]/10 rounded-[9999px] font-body text-xs text-[#28273F] placeholder-[#28273F]/40 focus:outline-none focus:border-[#9D6C76]"
              />
              <button
                type="submit"
                disabled={replyLoading || !replyText.trim()}
                className="bg-[#28273F] text-white p-3 rounded-full hover:bg-[#9D6C76] active:scale-[0.96] transition-all cursor-pointer disabled:opacity-50 shrink-0 flex items-center justify-center"
                aria-label="Send reply"
              >
                {replyLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </form>
          ) : (
            <div className="p-4 bg-[#28273F]/5 border border-[#28273F]/10 rounded-[16px] text-center font-body text-xs text-[#666666]">
              <CheckCircle className="w-5 h-5 text-[#28273F]/40 mx-auto mb-1.5" />
              {activeTicket.status.toLowerCase() === "resolved"
                ? "This support ticket has been resolved."
                : "This support ticket has been closed."}
            </div>
          )}
        </div>
      ) : showForm ? (
        /* 2. Create Ticket Form view */
        <div className="space-y-6">
          <button
            onClick={() => setShowForm(false)}
            className="inline-flex items-center gap-1.5 text-[10px] font-body font-bold tracking-widest uppercase text-[#9D6C76] hover:underline cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to List
          </button>

          <form onSubmit={handleCreateTicket} className="space-y-5 border border-[#28273F]/5 rounded-[24px] p-6 md:p-8 bg-[#FAF8F5]/30">
            <h3 className="font-heading text-lg text-[#28273F]">Initiate Support Ticket</h3>
            
            {formError && (
              <div className="p-3 bg-[#EF4444]/5 border-l-2 border-[#EF4444] rounded-[6px] text-[10px] text-[#EF4444] font-body">
                {formError}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#666666] font-body">Subject *</label>
              <input
                type="text"
                required
                placeholder="e.g. Inquiry regarding shampoo bar ingredients"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#28273F]/10 rounded-[12px] font-body text-xs text-[#28273F] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div ref={categorySelectRef} className="space-y-1 relative" style={{ position: "relative" }}>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#666666] font-body block">Category *</label>
                <button
                  type="button"
                  onClick={() => setCategoryOpen(!categoryOpen)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#28273F]/10 rounded-[12px] font-body text-xs text-[#28273F] focus:outline-none text-left flex justify-between items-center cursor-pointer hover:border-[#28273F]/20 active:scale-[0.99] transition-all"
                >
                  <span>{category}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#28273F]/50 transition-transform duration-300 ${categoryOpen ? "rotate-180" : ""}`} />
                </button>
                {categoryOpen && (
                  <div className="absolute top-[100%] left-0 w-full mt-1.5 bg-white border border-[#28273F]/10 rounded-[12px] shadow-lg py-1.5 z-30 animate-scale-up max-h-60 overflow-y-auto">
                    {[
                      "Product Inquiry",
                      "Billing & Payments",
                      "Shipment & Delivery",
                      "Ritual Feedback",
                      "Other Support"
                    ].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => { setCategory(opt); setCategoryOpen(false); }}
                        className={`w-full px-4 py-2 text-left text-xs font-body hover:bg-[#FAF8F5] transition-colors cursor-pointer block ${category === opt ? "text-[#9D6C76] font-semibold bg-[#9D6C76]/5" : "text-[#28273F]"}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div ref={prioritySelectRef} className="space-y-1 relative" style={{ position: "relative" }}>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#666666] font-body block">Priority *</label>
                <button
                  type="button"
                  onClick={() => setPriorityOpen(!priorityOpen)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#28273F]/10 rounded-[12px] font-body text-xs text-[#28273F] focus:outline-none text-left flex justify-between items-center cursor-pointer hover:border-[#28273F]/20 active:scale-[0.99] transition-all"
                >
                  <span>
                    {priority === "low" ? "Low (Standard Response)" : priority === "medium" ? "Medium" : "High Priority"}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#28273F]/50 transition-transform duration-300 ${priorityOpen ? "rotate-180" : ""}`} />
                </button>
                {priorityOpen && (
                  <div className="absolute top-[100%] left-0 w-full mt-1.5 bg-white border border-[#28273F]/10 rounded-[12px] shadow-lg py-1.5 z-30 animate-scale-up">
                    {[
                      { value: "low", label: "Low (Standard Response)" },
                      { value: "medium", label: "Medium" },
                      { value: "high", label: "High Priority" }
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => { setPriority(opt.value); setPriorityOpen(false); }}
                        className={`w-full px-4 py-2 text-left text-xs font-body hover:bg-[#FAF8F5] transition-colors cursor-pointer block ${priority === opt.value ? "text-[#9D6C76] font-semibold bg-[#9D6C76]/5" : "text-[#28273F]"}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#666666] font-body">Details Message *</label>
              <textarea
                rows={4}
                required
                placeholder="Explain details of your query..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#28273F]/10 rounded-[12px] font-body text-xs text-[#28273F] focus:outline-none resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="bg-[#28273F] text-white py-2.5 px-6 rounded-[9999px] font-body text-[10px] font-bold tracking-wider uppercase hover:bg-[#9D6C76] active:scale-[0.96] transition-all cursor-pointer flex items-center gap-1.5"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Create Ticket"
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="border border-[#28273F]/10 text-[#28273F] py-2.5 px-6 rounded-[9999px] font-body text-[10px] font-bold tracking-wider uppercase hover:bg-[#28273F]/5 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* 3. Tickets index view list */
        <div className="space-y-5">
          <div className="flex justify-between items-center pb-3 border-b border-[#28273F]/5">
            <h3 className="font-heading text-base text-[#28273F]">Active Support Requests</h3>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-1 text-[10px] font-body tracking-wider uppercase font-semibold text-[#9D6C76] border border-[#9D6C76]/20 px-3.5 py-1.5 rounded-[9999px] hover:bg-[#9D6C76]/5 transition-all cursor-pointer bg-white"
            >
              <Plus className="w-3.5 h-3.5" />
              New Ticket
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-[#9D6C76]" />
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-12 bg-[#FAF8F5]/35 border border-[#28273F]/5 rounded-[20px] p-6">
              <Inbox className="w-8 h-8 text-[#28273F]/10 mx-auto mb-3" />
              <p className="font-body text-xs text-[#666666] font-light">
                No active or past support tickets found. Create a ticket if you need assistance.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {tickets.map((tkt) => (
                <div
                  key={tkt.id}
                  onClick={() => handleOpenTicketDetails(tkt)}
                  className="p-5 border border-[#28273F]/5 rounded-[20px] hover:border-[#9D6C76]/30 shadow-[0_4px_15px_rgba(40,39,63,0.005)] hover:shadow-[0_8px_25px_rgba(40,39,63,0.015)] cursor-pointer bg-white transition-all duration-300 flex flex-wrap justify-between items-center gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-heading text-sm text-[#28273F] font-semibold">
                        #{tkt.ticket_number}
                      </span>
                      <span className={`text-[8px] font-body font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${getStatusBadgeClass(tkt.status)}`}>
                        {tkt.status}
                      </span>
                    </div>
                    <h4 className="font-heading text-sm text-[#28273F] line-clamp-1">{tkt.subject}</h4>
                    <span className="text-[9px] font-body text-[#666666]/50 block">
                      Opened: {new Date(tkt.created_at).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex gap-2.5">
                    <span className="bg-[#28273F]/10 text-[#28273F] text-[8px] font-body font-bold tracking-wider uppercase px-2 py-1 rounded">
                      {tkt.category}
                    </span>
                    <span className={`text-[8px] font-body font-bold tracking-wider uppercase px-2 py-1 rounded ${getPriorityBadgeClass(tkt.priority)}`}>
                      {tkt.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HelpPage;