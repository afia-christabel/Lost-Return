import { supabase } from "@/lib/supabase";
import type {
  AdminClaim,
  AdminUser,
  AuditLogEntry,
  HandoverRecord,
  MockItem,
} from "@/data/mock";

class AdminStore {
  private listeners: Set<() => void> = new Set();

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((l) => l());
  }

  /**
   * Fetch all claims from Supabase
   */
  async getClaims(): Promise<AdminClaim[]> {
    try {
      const { data, error } = await supabase
        .from("claims")
        .select("*")
        .order("created_at", { ascending: false });

      const remoteClaims: AdminClaim[] = [];
      if (!error && data) {
        data.forEach((row: any) => {
          const claim: AdminClaim = {
            id: row.id || row.reference,
            reference: row.reference,
            itemId: row.item_id,
            itemReference: row.item_reference || "N/A",
            itemName: row.item_name || "Item Claim",
            itemCategory: row.item_category || "General",
            itemLocation: row.item_location || "Campus",
            claimantId: row.claimant_id || "u1",
            claimantName: row.claimant_name || "Student Claimant",
            claimantStudentId: row.claimant_student_id || "10900000",
            claimantEmail: row.claimant_email || "user@st.ug.edu.gh",
            claimantPhone: row.claimant_phone || "+233 24 000 0000",
            claimantHall: row.claimant_hall || "Hall",
            claimantProgramme: row.claimant_programme || "Undergraduate",
            submittedAt: new Date(row.created_at || Date.now())
              .toISOString()
              .replace("T", " ")
              .substring(0, 16),
            status: row.status || "under_review",
            verificationScore: row.verification_score || 85,
            scoreBreakdown: row.score_breakdown || {
              identity: 20,
              description: 20,
              uniqueFeature: 20,
              serialNumber: 15,
              evidence: 5,
              consistency: 5,
            },
            responses: Array.isArray(row.verification_answers)
              ? row.verification_answers
              : [],
            evidenceFiles: Array.isArray(row.supporting_evidence)
              ? row.supporting_evidence
              : [],
          };

          if (row.reviewer_notes) claim.reviewNotes = row.reviewer_notes;
          if (row.reviewed_by) claim.reviewedBy = row.reviewed_by;
          if (row.reviewed_at) {
            claim.reviewedAt = new Date(row.reviewed_at)
              .toISOString()
              .replace("T", " ")
              .substring(0, 16);
          }
          if (Array.isArray(row.dispute_claimants) && row.dispute_claimants.length > 0) {
            claim.disputeClaimants = row.dispute_claimants;
          }

          remoteClaims.push(claim);
        });
      }

      let localClaims: AdminClaim[] = [];
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem("ug_submitted_claims");
          if (raw) {
            const parsed = JSON.parse(raw);
            localClaims = parsed.map((c: any) => ({
              id: c.id || c.reference,
              reference: c.reference,
              itemId: c.itemId || "item-1",
              itemReference: c.itemReference || "LF-2026-000118",
              itemName: c.itemName || "Item Claim",
              itemCategory: c.itemCategory || "General",
              itemLocation: c.itemLocation || "Campus",
              claimantId: c.claimantId || "u1",
              claimantName: c.claimantName || "Verified Student Claimant",
              claimantStudentId: "10984210",
              claimantEmail: "student@st.ug.edu.gh",
              claimantPhone: "+233 24 123 4567",
              claimantHall: "Legon Hall",
              claimantProgramme: "BSc Computer Science",
              submittedAt: c.submittedAt || new Date().toISOString().replace("T", " ").substring(0, 16),
              status: c.status || "under_review",
              verificationScore: c.verificationScore || 85,
              scoreBreakdown: {
                identity: 20,
                description: 20,
                uniqueFeature: 20,
                serialNumber: 15,
                evidence: 5,
                consistency: 5,
              },
              responses: [
                {
                  question: "Primary colour / distinguishing markings?",
                  answer: c.answers?.q1 || "Verified matching description",
                  expectedAnswer: "Match confirmed",
                  match: true,
                  score: 20,
                },
              ],
              evidenceFiles: [
                {
                  id: "e1",
                  type: c.evidence?.proofType || "Student ID / Purchase Receipt",
                  name: "Proof of Ownership",
                  url: "#",
                  note: c.evidence?.details || "Submitted by claimant during verification.",
                  status: "pending",
                },
              ],
            }));
          }
        } catch (e) {
          console.warn("Could not parse local claims for admin:", e);
        }
      }

      const mergedMap = new Map<string, AdminClaim>();
      [...remoteClaims, ...localClaims].forEach((c) => {
        if (!mergedMap.has(c.reference)) {
          mergedMap.set(c.reference, c);
        }
      });

      return Array.from(mergedMap.values());
    } catch (err) {
      console.error("Failed to fetch claims from Supabase:", err);
      return [];
    }
  }

  /**
   * Fetch user profiles from Supabase
   */
  async getUsers(): Promise<AdminUser[]> {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error || !data) return [];

      return data.map((row: any) => ({
        id: row.id,
        studentId: row.student_id || "10900000",
        name: row.full_name || "UG User",
        email: row.email,
        phone: row.phone || "+233 24 000 0000",
        hall: row.hall_of_residence || "Hall",
        programme: row.programme || "Degree",
        level: row.level || "300",
        role: row.role || "student",
        verificationStatus: row.verification_status || "verified",
        accountStatus: row.account_status || "active",
        joinedDate: row.created_at
          ? new Date(row.created_at).toISOString().substring(0, 10)
          : "2026-01-01",
        reportsCount: 1,
        claimsCount: 1,
      }));
    } catch (err) {
      console.error("Failed to fetch users from Supabase:", err);
      return [];
    }
  }

  /**
   * Fetch audit logs from Supabase
   */
  async getLogs(): Promise<AuditLogEntry[]> {
    try {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error || !data) return [];

      return data.map((row: any) => ({
        id: row.id,
        timestamp: new Date(row.created_at || Date.now())
          .toISOString()
          .replace("T", " ")
          .substring(0, 16),
        userId: row.user_id || "sys",
        userName: row.actor_name || "System Admin",
        action: row.action,
        entityType: row.entity_type || "system",
        entityId: row.target_ref || "SYS",
        details: row.details,
        ipAddress: row.ip_address || "127.0.0.1",
      }));
    } catch (err) {
      console.error("Failed to fetch audit logs from Supabase:", err);
      return [];
    }
  }

  /**
   * Fetch handovers from Supabase
   */
  async getHandovers(): Promise<HandoverRecord[]> {
    try {
      const { data, error } = await supabase
        .from("handovers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error || !data) return [];

      return data.map((row: any) => ({
        id: row.id,
        claimReference: row.claim_reference,
        itemName: row.item_name,
        ownerName: row.owner_name,
        finderName: row.finder_name,
        location: row.location,
        scheduledDate: row.scheduled_date,
        scheduledTime: row.scheduled_time,
        verificationCode: row.verification_code,
        finderConfirmed: row.finder_confirmed,
        ownerConfirmed: row.owner_confirmed,
        status: row.status || "scheduled",
      }));
    } catch (err) {
      console.error("Failed to fetch handovers from Supabase:", err);
      return [];
    }
  }

  /**
   * Fetch all items from Supabase
   */
  async getItems(): Promise<MockItem[]> {
    try {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error || !data) return [];

      return data.map((row: any) => ({
        id: row.id,
        reference: row.reference,
        type: row.type,
        name: row.name,
        category: row.category,
        brand: row.brand,
        colour: row.colour,
        description: row.description,
        privateDetails: row.private_details,
        location: row.location,
        date: row.date_lost_or_found,
        status: row.status,
        reporter: row.reporter_name,
        reporterStudentId: row.reporter_student_id,
        matchScore: row.match_score,
      }));
    } catch (err) {
      console.error("Failed to fetch items from Supabase:", err);
      return [];
    }
  }

  /**
   * Update claim status in Supabase
   */
  async updateClaimStatus(
    claimId: string,
    status: AdminClaim["status"],
    notes: string,
    reviewer: string = "Admin Moderation Desk",
  ): Promise<void> {
    try {
      const isUuid =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(claimId);
      let claimQuery = supabase.from("claims").select("*");
      if (isUuid) {
        claimQuery = claimQuery.eq("id", claimId);
      } else {
        claimQuery = claimQuery.eq("reference", claimId);
      }
      const { data: claim } = await claimQuery.maybeSingle();

      if (isUuid) {
        await supabase
          .from("claims")
          .update({
            status,
            reviewer_notes: notes,
            reviewed_by: reviewer,
            reviewed_at: new Date().toISOString(),
          })
          .eq("id", claimId);
      } else {
        await supabase
          .from("claims")
          .update({
            status,
            reviewer_notes: notes,
            reviewed_by: reviewer,
            reviewed_at: new Date().toISOString(),
          })
          .eq("reference", claimId);
      }

      let code = `UG-LF-${Math.floor(10000 + Math.random() * 90000)}`;

      // If approved, create handover and update item status in Supabase
      if (status === "approved" && claim) {
        await supabase.from("handovers").insert([
          {
            claim_reference: claim.reference,
            item_name: claim.item_name || "Claimed Item",
            owner_name: claim.claimant_name || "Owner",
            finder_name: "Verified University Finder",
            location: `${claim.item_location || "Student Affairs"} Help Desk`,
            scheduled_date: new Date(Date.now() + 86400000 * 2)
              .toISOString()
              .substring(0, 10),
            scheduled_time: "10:00 AM",
            verification_code: code,
            finder_confirmed: false,
            owner_confirmed: false,
            status: "scheduled",
          },
        ]);

        if (claim.item_id) {
          await supabase
            .from("items")
            .update({ status: "under_verification" })
            .eq("id", claim.item_id);
        }
      }

      // Sync status update to local storage
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem("ug_submitted_claims");
          if (raw) {
            const list = JSON.parse(raw);
            const updated = list.map((item: any) => {
              if (
                item.id === claimId ||
                item.reference === claimId ||
                item.reference === claim?.reference
              ) {
                return {
                  ...item,
                  status,
                  reviewerNotes: notes,
                  handoverCode:
                    status === "approved" ? item.handoverCode || code : item.handoverCode,
                };
              }
              return item;
            });
            localStorage.setItem("ug_submitted_claims", JSON.stringify(updated));
          }
        } catch {}
      }

      await this.addAuditLog(
        `CLAIM_${status.toUpperCase()}`,
        "claim",
        claim?.reference || claimId,
        `Claim status updated to '${status}' by ${reviewer}. Notes: ${notes}`,
      );

      this.notify();
    } catch (err) {
      console.error("Failed to update claim status in Supabase:", err);
    }
  }

  /**
   * Toggle user active/suspended account status in Supabase
   */
  async toggleUserStatus(userId: string): Promise<void> {
    try {
      const { data: user } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (!user) return;

      const nextStatus = user.account_status === "active" ? "suspended" : "active";

      await supabase
        .from("profiles")
        .update({ account_status: nextStatus })
        .eq("id", userId);

      await this.addAuditLog(
        `USER_${nextStatus.toUpperCase()}`,
        "user",
        user.student_id || user.id,
        `User ${user.full_name} (${user.student_id}) account status set to ${nextStatus}.`,
      );

      this.notify();
    } catch (err) {
      console.error("Failed to toggle user status in Supabase:", err);
    }
  }

  /**
   * Mark user identity verified in Supabase
   */
  async verifyUser(userId: string): Promise<void> {
    try {
      const { data: user } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (!user) return;

      await supabase
        .from("profiles")
        .update({ verification_status: "verified" })
        .eq("id", userId);

      await this.addAuditLog(
        "USER_VERIFIED",
        "user",
        user.student_id || user.id,
        `Verified identity credentials for ${user.full_name}.`,
      );

      this.notify();
    } catch (err) {
      console.error("Failed to verify user in Supabase:", err);
    }
  }

  /**
   * Update item status in Supabase
   */
  async updateItemStatus(itemId: string, status: MockItem["status"]): Promise<void> {
    try {
      const { data: item } = await supabase
        .from("items")
        .select("*")
        .eq("id", itemId)
        .single();

      if (!item) return;

      await supabase
        .from("items")
        .update({ status })
        .eq("id", itemId);

      await this.addAuditLog(
        `ITEM_${status.toUpperCase()}`,
        "item",
        item.reference,
        `Item ${item.name} (${item.reference}) status updated to ${status}.`,
      );

      this.notify();
    } catch (err) {
      console.error("Failed to update item status in Supabase:", err);
    }
  }

  /**
   * Verify handover OTP code in Supabase
   */
  async confirmHandoverCode(handoverId: string, code: string): Promise<boolean> {
    try {
      const { data: handover } = await supabase
        .from("handovers")
        .select("*")
        .eq("id", handoverId)
        .single();

      if (!handover) return false;

      if (handover.verification_code.toUpperCase() === code.trim().toUpperCase()) {
        await supabase
          .from("handovers")
          .update({
            owner_confirmed: true,
            finder_confirmed: true,
            status: "completed",
          })
          .eq("id", handoverId);

        // Find associated claim and update item status to recovered
        const { data: claim } = await supabase
          .from("claims")
          .select("item_id")
          .eq("reference", handover.claim_reference)
          .single();

        if (claim?.item_id) {
          await supabase
            .from("items")
            .update({ status: "recovered" })
            .eq("id", claim.item_id);
        }

        await this.addAuditLog(
          "HANDOVER_COMPLETED",
          "handover",
          handover.claim_reference,
          `Handover code verified for ${handover.item_name}. Recovery recorded.`,
        );

        this.notify();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to confirm handover in Supabase:", err);
      return false;
    }
  }

  /**
   * Insert audit log entry directly into Supabase
   */
  async addAuditLog(
    action: string,
    entityType: AuditLogEntry["entityType"],
    entityId: string,
    details: string,
  ): Promise<void> {
    try {
      await supabase.from("audit_logs").insert([
        {
          actor_name: "Dr. Evans Addo (Admin)",
          action,
          entity_type: entityType,
          target_ref: entityId,
          details,
          ip_address: "192.168.1.45",
        },
      ]);
    } catch (err) {
      console.error("Failed to insert audit log in Supabase:", err);
    }
  }
}

export const adminService = new AdminStore();
