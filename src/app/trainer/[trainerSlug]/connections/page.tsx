"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { 
  UserPlus, 
  MapPin, 
  Building2, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Clock,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConnectionItem {
  _id: string;
  gymId: {
    _id: string;
    gymName: string;
    gymLogo?: string;
    address?: {
      city: string;
      street: string;
    };
    slug?: string;
  };
  message?: string;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
}

export default function TrainerConnectionsPage() {
  const params = useParams();
  const trainerSlug = (params?.trainerSlug as string) || "rahul-sharma";

  const [connections, setConnections] = useState<ConnectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchConnections = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const trainerRes = await fetch(`${apiUrl}/trainers/${trainerSlug}`);
      const trainerData = await trainerRes.json();
      if (trainerData.success && trainerData.data) {
        const connRes = await fetch(`${apiUrl}/connections/trainer/${trainerData.data._id}`);
        const connJson = await connRes.json();
        if (connJson.success) {
          setConnections(connJson.data || []);
        }
      }
    } catch (err) {
      console.error("Fetch Trainer Connections Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, [trainerSlug]);

  const updateStatus = async (connId: string, newStatus: "accepted" | "declined") => {
    setActionId(connId);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const token = typeof window !== "undefined" ? localStorage.getItem("fitworks_token") : null;

      const res = await fetch(`${apiUrl}/connections/${connId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const json = await res.json();
      if (json.success) {
        setConnections(prev => prev.map(c => c._id === connId ? { ...c, status: newStatus } : c));
      }
    } catch (err) {
      console.error("Update Connection Error:", err);
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Gym Interview Invitations</h1>
          <p className="text-sm text-gray-500 mt-1">Accept connection requests from verified gyms interested in interviewing you.</p>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 text-[#d91a24] animate-spin" />
        </div>
      ) : connections.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-gray-100 shadow-sm">
          <UserPlus className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900">No invitations yet</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">When gyms search for trainers in your area and invite you, their requests will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {connections.map((conn) => (
            <div key={conn._id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-all">
              
              {/* Gym Info & Message */}
              <div className="flex items-start gap-4">
                {conn.gymId?.gymLogo ? (
                  <div className="w-12 h-12 rounded-2xl overflow-hidden border border-gray-200 shadow-2xs relative shrink-0">
                    <Image src={conn.gymId.gymLogo} alt={conn.gymId.gymName || "Gym"} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#d91a24] border border-red-100 flex items-center justify-center font-black text-lg shrink-0 shadow-2xs">
                    {conn.gymId?.gymName?.charAt(0) || "G"}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-base font-bold text-gray-900">{conn.gymId?.gymName || "Verified Gym Partner"}</h3>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                      conn.status === "accepted" ? "bg-green-50 text-green-700 border border-green-200" :
                      conn.status === "declined" ? "bg-gray-100 text-gray-600 border border-gray-200" :
                      "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}>
                      {conn.status === "pending" ? "Action Required" : conn.status}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" /> {conn.gymId?.address?.city || "India"}
                  </p>

                  {conn.message && (
                    <div className="mt-3 p-3 bg-gray-50/80 rounded-xl border border-gray-100 text-xs text-gray-600 max-w-xl">
                      <p className="font-semibold text-gray-700 mb-0.5">Invitation Message:</p>
                      "{conn.message}"
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                {conn.status === "pending" ? (
                  <>
                    <Button
                      size="sm"
                      disabled={actionId === conn._id}
                      onClick={() => updateStatus(conn._id, "accepted")}
                      className="bg-[#d91a24] hover:bg-[#cc1616] text-white rounded-xl text-xs font-bold px-5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Accept Invitation
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={actionId === conn._id}
                      onClick={() => updateStatus(conn._id, "declined")}
                      className="border-gray-200 text-gray-500 hover:bg-gray-50 rounded-xl text-xs font-semibold"
                    >
                      Decline
                    </Button>
                  </>
                ) : (
                  <span className="text-xs font-bold text-gray-500 capitalize">
                    {conn.status === "accepted" ? "✓ Connected with Gym" : "Declined"}
                  </span>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
