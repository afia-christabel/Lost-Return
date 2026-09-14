import { supabase } from "@/lib/supabase";
import type { MockItem, ClaimRecord, NotificationRecord } from "@/data/mock";
import { adminService } from "./adminService";

export type ItemFilterOptions = {
  type?: "all" | "lost" | "found";
  category?: string;
  location?: string;
  query?: string;
  status?: string;
};

interface SupabaseItemRow {
  id: string;
  reference: string;
  type: "lost" | "found";
  name: string;
  category: string;
  brand?: string;
  colour?: string;
  description: string;
  private_details?: string;
  location: string;
  date_lost_or_found: string;
  status: "active" | "matched" | "under_verification" | "recovered" | "disputed" | "archived";
  reporter_name: string;
  reporter_student_id?: string;
  match_score?: number;
}

function mapItemRow(row: SupabaseItemRow): MockItem {
  const item: MockItem = {
    id: row.id,
    reference: row.reference,
    type: row.type,
    name: row.name,
    category: row.category,
    description: row.description,
    location: row.location,
    date: row.date_lost_or_found,
    status: row.status,
    reporter: row.reporter_name,
  };

  if (row.brand) item.brand = row.brand;
  if (row.colour) item.colour = row.colour;
  if (row.private_details) item.privateDetails = row.private_details;
  if (row.reporter_student_id) item.reporterStudentId = row.reporter_student_id;
  if (row.match_score !== undefined) item.matchScore = row.match_score;

  return item;
}

export const supabaseService = {
  /**
   * Fetch all items with optional filters from Supabase
   */
  async getItems(options?: ItemFilterOptions): Promise<MockItem[]> {
    try {
      let query = supabase.from("items").select("*").order("created_at", { ascending: false });

      if (options?.type && options.type !== "all") {
        query = query.eq("type", options.type);
      }
      if (options?.category && options.category !== "All") {
        query = query.eq("category", options.category);
      }
      if (options?.location && options.location !== "All") {
        query = query.eq("location", options.location);
      }
      if (options?.query) {
        query = query.or(
          `name.ilike.%${options.query}%,description.ilike.%${options.query}%,reference.ilike.%${options.query}%`,
        );
      }

      const { data, error } = await query;
      if (error || !data) return [];

      return data.map((row: SupabaseItemRow) => mapItemRow(row));
    } catch (err) {
      console.error("Supabase getItems error:", err);
      return [];
    }
  },

  /**
   * Fetch single item by ID from Supabase
   */
  async getItemById(id: string): Promise<MockItem | null> {
    try {
      const { data, error } = await supabase.from("items").select("*").eq("id", id).single();
      if (error || !data) return null;

      return mapItemRow(data as SupabaseItemRow);
    } catch {
      return null;
    }
  },

  /**
   * Create a new Lost/Found Item report in Supabase
   */
  async createItem(report: Omit<MockItem, "id" | "reference" | "status">): Promise<MockItem> {
    const reference = `LF-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      const { data, error } = await supabase
        .from("items")
        .insert([
          {
            reference,
            type: report.type,
            name: report.name,
            category: report.category,
            brand: report.brand,
            colour: report.colour,
            description: report.description,
            private_details: report.privateDetails,
            location: report.location,
            date_lost_or_found: report.date,
            reporter_name: report.reporter,
            reporter_student_id: report.reporterStudentId,
            status: "active",
          },
        ])
        .select()
        .single();

      if (error || !data) {
        throw error || new Error("Failed to insert item into Supabase");
      }

      await adminService.addAuditLog(
        "ITEM_REPORTED",
        "item",
        reference,
        `Reported ${report.type} item: ${report.name} by ${report.reporter}`,
      );

      return mapItemRow(data as SupabaseItemRow);
    } catch (err) {
      console.error("Supabase createItem error:", err);
      throw err;
    }
  },

  /**
   * Submit an ownership claim in Supabase
   */
  async submitClaim(claim: {
    itemId: string;
    itemName: string;
    claimantName: string;
    answers: Record<string, string>;
    evidence: { proofType: string; details: string };
  }): Promise<{ reference: string; id: string }> {
    const reference = `CLM-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      const isUuid =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(claim.itemId);
      let itemQuery = supabase.from("items").select("*");
      if (isUuid) {
        itemQuery = itemQuery.eq("id", claim.itemId);
      } else {
        itemQuery = itemQuery.eq("reference", claim.itemId);
      }
      const { data: item } = await itemQuery.maybeSingle();

      let targetItemId = item?.id;
      if (!targetItemId) {
        const { data: fallbackItem } = await supabase
          .from("items")
          .select("id")
          .limit(1)
          .maybeSingle();
        targetItemId = fallbackItem?.id;
      }

      const { error } = await supabase.from("claims").insert([
        {
          reference,
          item_id: targetItemId,
          item_reference: item?.reference || claim.itemId,
          item_name: claim.itemName,
          item_category: item?.category || "General",
          item_location: item?.location || "Campus",
          claimant_name: claim.claimantName,
          verification_answers: claim.answers,
          supporting_evidence: [claim.evidence],
          status: "under_review",
          verification_score: 85,
        },
      ]);

      if (error) {
        console.error("Supabase claim insert error:", error);
        throw error;
      }

      // Sync claim to local cache for instant UI availability
      if (typeof window !== "undefined") {
        try {
          const localClaimRecord = {
            id: reference,
            reference,
            itemId: targetItemId || claim.itemId,
            itemReference: item?.reference || claim.itemId,
            itemName: claim.itemName,
            itemCategory: item?.category || "General",
            itemLocation: item?.location || "Campus",
            claimantName: claim.claimantName,
            submittedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
            submitted: new Date().toISOString().substring(0, 10),
            status: "under_review",
            verificationScore: 85,
            answers: claim.answers,
            evidence: claim.evidence,
          };
          const existing = JSON.parse(localStorage.getItem("ug_submitted_claims") || "[]");
          localStorage.setItem(
            "ug_submitted_claims",
            JSON.stringify([localClaimRecord, ...existing.filter((c: any) => c.reference !== reference)]),
          );
        } catch (e) {
          console.warn("Could not save claim to local storage:", e);
        }
      }

      await adminService.addAuditLog(
        "CLAIM_SUBMITTED",
        "claim",
        reference,
        `Claim submitted for ${claim.itemName} by ${claim.claimantName}`,
      );

      return { reference, id: reference };
    } catch (err) {
      console.error("Supabase claim submission error:", err);
      throw err;
    }
  },

  /**
   * Fetch all claims submitted by a user or all claims from Supabase
   */
  async getMyClaims(): Promise<ClaimRecord[]> {
    try {
      const { data, error } = await supabase
        .from("claims")
        .select("*")
        .order("created_at", { ascending: false });

      const remoteClaims: ClaimRecord[] = [];
      if (!error && data) {
        data.forEach((row: any) => {
          const dateStr = row.created_at
            ? new Date(row.created_at).toISOString()
            : new Date().toISOString();
          const claim: ClaimRecord = {
            id: row.id || row.reference,
            reference: row.reference,
            itemName: row.item_name || "Claimed Item",
            submitted: dateStr.substring(0, 10),
            status: row.status || "under_review",
          };
          if (row.handover_code) {
            claim.handoverCode = row.handover_code;
          }
          remoteClaims.push(claim);
        });
      }

      let localClaims: ClaimRecord[] = [];
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem("ug_submitted_claims");
          if (raw) {
            const parsed = JSON.parse(raw);
            localClaims = parsed.map((c: any) => ({
              id: c.id || c.reference,
              reference: c.reference,
              itemName: c.itemName || "Claimed Item",
              submitted: c.submitted || new Date().toISOString().substring(0, 10),
              status: c.status || "under_review",
              handoverCode: c.handoverCode,
            }));
          }
        } catch (e) {
          console.warn("Could not parse local claims:", e);
        }
      }

      // Merge remote and local claims cleanly
      const mergedMap = new Map<string, ClaimRecord>();
      [...remoteClaims, ...localClaims].forEach((c) => {
        if (!mergedMap.has(c.reference)) {
          mergedMap.set(c.reference, c);
        }
      });

      return Array.from(mergedMap.values());
    } catch (err) {
      console.error("Supabase getMyClaims error:", err);
      return [];
    }
  },

  /**
   * Fetch user notifications from Supabase
   */
  async getNotifications(): Promise<NotificationRecord[]> {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error || !data) return [];

      return data.map((row: any) => ({
        id: row.id,
        title: row.title,
        body: row.body,
        time: row.created_at
          ? new Date(row.created_at).toISOString().substring(0, 10)
          : "Today",
        unread: row.unread ?? true,
        kind: row.kind || "admin",
      }));
    } catch (err) {
      console.error("Supabase getNotifications error:", err);
      return [];
    }
  },

  /**
   * Report a concern on a listing in Supabase
   */
  async reportConcern(concern: {
    itemId: string;
    itemReference: string;
    reason: string;
    details: string;
    contactInfo?: string;
  }): Promise<void> {
    try {
      const isUuid =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(concern.itemId);
      let targetItemId = isUuid ? concern.itemId : undefined;

      if (!targetItemId) {
        const { data: item } = await supabase
          .from("items")
          .select("id")
          .eq("reference", concern.itemReference || concern.itemId)
          .maybeSingle();
        targetItemId = item?.id;
      }

      if (!targetItemId) {
        const { data: fallbackItem } = await supabase
          .from("items")
          .select("id")
          .limit(1)
          .maybeSingle();
        targetItemId = fallbackItem?.id;
      }

      const { error } = await supabase.from("concern_reports").insert([
        {
          item_id: targetItemId,
          item_reference: concern.itemReference,
          reason: concern.reason,
          details: concern.details,
          contact_info: concern.contactInfo,
          status: "open",
        },
      ]);

      if (error) {
        console.error("Supabase concern_reports insert error:", error);
        throw error;
      }

      await adminService.addAuditLog(
        "SECURITY_CONCERN_REPORTED",
        "user",
        concern.itemReference,
        `Reason: [${concern.reason}] ${concern.details} (Contact: ${concern.contactInfo || "Anonymous"})`,
      );
    } catch (err) {
      console.error("Supabase concern insert error:", err);
      throw err;
    }
  },
};
