import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Users,
  Package,
  Search,
  Key,
  Calendar,
  Eye,
  UserCheck,
  UserX,
  History,
  Activity,
  Plus,
  RefreshCw,
  Award,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { adminService } from "@/services/adminService";
import type { AdminClaim, AdminUser, AuditLogEntry, HandoverRecord, MockItem } from "@/data/mock";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Portal — UG Find & Return" },
      {
        name: "description",
        content:
          "University of Ghana Lost & Found Administration Portal — Moderate items, verify ownership claims, manage users, and log audit trails.",
      },
    ],
  }),
  component: AdminPortal,
});

import { SplashScreen } from "@/components/SplashScreen";

export function AdminPortal() {
  const [showAdminSplash, setShowAdminSplash] = useState(true);

  // Store subscription state
  const [claims, setClaims] = useState<AdminClaim[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [itemsList, setItemsList] = useState<MockItem[]>([]);
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [handovers, setHandovers] = useState<HandoverRecord[]>([]);

  // Search and Filters
  const [claimSearch, setClaimSearch] = useState("");
  const [claimStatusFilter, setClaimStatusFilter] = useState<string>("all");
  const [userSearch, setUserSearch] = useState("");
  const [itemSearch, setItemSearch] = useState("");
  const [logSearch, setLogSearch] = useState("");

  // Modals & Selected items
  const [selectedClaim, setSelectedClaim] = useState<AdminClaim | null>(null);
  const [claimActionDialog, setClaimActionDialog] = useState<
    "approve" | "reject" | "evidence" | "dispute" | null
  >(null);
  const [reviewNotes, setReviewNotes] = useState("");

  const [selectedPrivateItem, setSelectedPrivateItem] = useState<MockItem | null>(null);
  const [handoverCodeInput, setHandoverCodeInput] = useState("");
  const [handoverFeedback, setHandoverFeedback] = useState<{
    success: boolean;
    msg: string;
  } | null>(null);

  const loadAllData = async () => {
    const [c, u, i, l, h] = await Promise.all([
      adminService.getClaims(),
      adminService.getUsers(),
      adminService.getItems(),
      adminService.getLogs(),
      adminService.getHandovers(),
    ]);
    setClaims(c);
    setUsers(u);
    setItemsList(i);
    setLogs(l);
    setHandovers(h);
  };

  // Subscribe to service updates
  useEffect(() => {
    loadAllData();
    const unsubscribe = adminService.subscribe(() => {
      loadAllData();
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // Filtered queries
  const filteredClaims = claims.filter((c) => {
    const matchText =
      c.reference.toLowerCase().includes(claimSearch.toLowerCase()) ||
      c.itemName.toLowerCase().includes(claimSearch.toLowerCase()) ||
      c.claimantName.toLowerCase().includes(claimSearch.toLowerCase()) ||
      c.claimantStudentId.includes(claimSearch);
    const matchStatus = claimStatusFilter === "all" || c.status === claimStatusFilter;
    return matchText && matchStatus;
  });

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.studentId.includes(userSearch) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.programme.toLowerCase().includes(userSearch.toLowerCase()),
  );

  const filteredItems = itemsList.filter(
    (i) =>
      i.name.toLowerCase().includes(itemSearch.toLowerCase()) ||
      i.reference.toLowerCase().includes(itemSearch.toLowerCase()) ||
      i.location.toLowerCase().includes(itemSearch.toLowerCase()) ||
      i.category.toLowerCase().includes(itemSearch.toLowerCase()),
  );

  const filteredLogs = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(logSearch.toLowerCase()) ||
      l.entityId.toLowerCase().includes(logSearch.toLowerCase()) ||
      l.details.toLowerCase().includes(logSearch.toLowerCase()) ||
      l.userName.toLowerCase().includes(logSearch.toLowerCase()),
  );

  // Claim action submission
  const handleExecuteClaimAction = async () => {
    if (!selectedClaim || !claimActionDialog) return;

    let targetStatus: AdminClaim["status"] = "under_review";
    if (claimActionDialog === "approve") targetStatus = "approved";
    if (claimActionDialog === "reject") targetStatus = "rejected";
    if (claimActionDialog === "evidence") targetStatus = "evidence_requested";
    if (claimActionDialog === "dispute") targetStatus = "disputed";

    await adminService.updateClaimStatus(
      selectedClaim.id,
      targetStatus,
      reviewNotes || `Claim ${claimActionDialog}d by admin moderation desk.`,
    );

    setClaimActionDialog(null);
    setSelectedClaim(null);
    setReviewNotes("");
  };

  const handleVerifyCodeSubmit = async (handoverId: string) => {
    const ok = await adminService.confirmHandoverCode(handoverId, handoverCodeInput);
    if (ok) {
      setHandoverFeedback({
        success: true,
        msg: "Handover code verified successfully! Item recovery recorded.",
      });
      setHandoverCodeInput("");
    } else {
      setHandoverFeedback({
        success: false,
        msg: "Invalid handover code. Please check and try again.",
      });
    }
  };

  return (
    <AppShell>
      {showAdminSplash && (
        <SplashScreen
          variant="admin"
          onComplete={() => setShowAdminSplash(false)}
        />
      )}
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {/* Portal Header */}
        <div className="flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-ug-navy px-2.5 py-1 text-xs font-bold text-ug-gold">
                <ShieldCheck className="h-3.5 w-3.5" /> Administration Desk
              </span>
              <span className="text-xs font-medium text-muted-foreground">University of Ghana</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              System Administration Portal
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Review ownership claims, verify claimant scores, moderate items, manage students, and
              track recovery audit logs.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                loadAllData();
              }}
              className="gap-2 text-xs"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Refresh Data
            </Button>
          </div>
        </div>

        {/* Top Key Performance Indicators */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <span className="text-xs font-medium text-muted-foreground">Pending Claims</span>
            <p className="mt-1 text-2xl font-bold text-amber-600">
              {claims.filter((c) => c.status === "under_review").length}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <span className="text-xs font-medium text-muted-foreground">Disputed Claims</span>
            <p className="mt-1 text-2xl font-bold text-red-600">
              {claims.filter((c) => c.status === "disputed").length}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <span className="text-xs font-medium text-muted-foreground">Approved Claims</span>
            <p className="mt-1 text-2xl font-bold text-emerald-600">
              {claims.filter((c) => c.status === "approved").length}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <span className="text-xs font-medium text-muted-foreground">Active Listings</span>
            <p className="mt-1 text-2xl font-bold text-ug-navy">
              {itemsList.filter((i) => i.status === "active").length}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <span className="text-xs font-medium text-muted-foreground">Verified Students</span>
            <p className="mt-1 text-2xl font-bold text-foreground">
              {users.filter((u) => u.verificationStatus === "verified").length}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <span className="text-xs font-medium text-muted-foreground">Recovery Rate</span>
            <p className="mt-1 text-2xl font-bold text-ug-gold">71%</p>
          </div>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="claims" className="mt-8">
          <TabsList className="w-full justify-start overflow-x-auto border-b border-border bg-transparent p-0">
            <TabsTrigger
              value="claims"
              className="gap-2 border-b-2 border-transparent px-4 py-3 text-sm font-medium rounded-none data-[state=active]:border-ug-navy data-[state=active]:bg-transparent data-[state=active]:text-ug-navy"
            >
              <FileText className="h-4 w-4" />
              Ownership Claims ({claims.length})
            </TabsTrigger>
            <TabsTrigger
              value="items"
              className="gap-2 border-b-2 border-transparent px-4 py-3 text-sm font-medium rounded-none data-[state=active]:border-ug-navy data-[state=active]:bg-transparent data-[state=active]:text-ug-navy"
            >
              <Package className="h-4 w-4" />
              Item Moderation ({itemsList.length})
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="gap-2 border-b-2 border-transparent px-4 py-3 text-sm font-medium rounded-none data-[state=active]:border-ug-navy data-[state=active]:bg-transparent data-[state=active]:text-ug-navy"
            >
              <Users className="h-4 w-4" />
              User Directory ({users.length})
            </TabsTrigger>
            <TabsTrigger
              value="handovers"
              className="gap-2 border-b-2 border-transparent px-4 py-3 text-sm font-medium rounded-none data-[state=active]:border-ug-navy data-[state=active]:bg-transparent data-[state=active]:text-ug-navy"
            >
              <Key className="h-4 w-4" />
              Handovers & Code Verification ({handovers.length})
            </TabsTrigger>
            <TabsTrigger
              value="audit"
              className="gap-2 border-b-2 border-transparent px-4 py-3 text-sm font-medium rounded-none data-[state=active]:border-ug-navy data-[state=active]:bg-transparent data-[state=active]:text-ug-navy"
            >
              <Activity className="h-4 w-4" />
              Audit Logs ({logs.length})
            </TabsTrigger>
          </TabsList>

          {/* ════════════════════════════════════════════════
              TAB 1: OWNERSHIP CLAIMS MODERATION
              ════════════════════════════════════════════════ */}
          <TabsContent value="claims" className="mt-6 space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search claims by reference, item name, or student ID..."
                  value={claimSearch}
                  onChange={(e) => setClaimSearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Status filter buttons */}
              <div className="flex flex-wrap items-center gap-1.5">
                {["all", "under_review", "disputed", "approved", "rejected"].map((st) => (
                  <Button
                    key={st}
                    size="sm"
                    variant={claimStatusFilter === st ? "default" : "outline"}
                    onClick={() => setClaimStatusFilter(st)}
                    className="capitalize text-xs"
                  >
                    {st.replace("_", " ")}
                  </Button>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Claim Ref</TableHead>
                    <TableHead>Item Details</TableHead>
                    <TableHead>Claimant</TableHead>
                    <TableHead>Verification Score</TableHead>
                    <TableHead>Submitted Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClaims.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        No claims match your search criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredClaims.map((claim) => (
                      <TableRow key={claim.id} className="hover:bg-muted/30">
                        <TableCell className="font-mono text-xs font-bold text-ug-navy">
                          {claim.reference}
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-sm">{claim.itemName}</div>
                          <div className="text-xs text-muted-foreground">
                            {claim.itemCategory} · {claim.itemLocation} ({claim.itemReference})
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-xs">{claim.claimantName}</div>
                          <div className="text-[11px] text-muted-foreground">
                            ID: {claim.claimantStudentId} ({claim.claimantHall})
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-bold ${
                                claim.verificationScore >= 80
                                  ? "text-emerald-600"
                                  : claim.verificationScore >= 60
                                    ? "text-amber-600"
                                    : "text-red-600"
                              }`}
                            >
                              {claim.verificationScore}%
                            </span>
                            <div className="w-16">
                              <Progress value={claim.verificationScore} className="h-1.5" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {claim.submittedAt}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              claim.status === "approved"
                                ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                : claim.status === "disputed"
                                  ? "bg-red-100 text-red-800 border-red-300"
                                  : claim.status === "under_review"
                                    ? "bg-amber-100 text-amber-800 border-amber-300"
                                    : "bg-gray-100 text-gray-800 border-gray-300"
                            }
                          >
                            {claim.status.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedClaim(claim)}
                            className="gap-1 text-xs"
                          >
                            <Eye className="h-3.5 w-3.5" /> Review Claim
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* ════════════════════════════════════════════════
              TAB 2: ITEM MODERATION & PRIVATE DETAILS
              ════════════════════════════════════════════════ */}
          <TabsContent value="items" className="mt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search items by name, reference, location, or category..."
                  value={itemSearch}
                  onChange={(e) => setItemSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category / Location</TableHead>
                    <TableHead>Reporter</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Private Details & Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-xs font-bold text-ug-navy">
                        {item.reference}
                      </TableCell>
                      <TableCell className="font-semibold text-sm">{item.name}</TableCell>
                      <TableCell>
                        <Badge variant={item.type === "found" ? "default" : "secondary"}>
                          {item.type.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {item.category} · {item.location}
                      </TableCell>
                      <TableCell className="text-xs">{item.reporter}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {item.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedPrivateItem(item)}
                            className="gap-1 text-xs text-ug-navy hover:bg-ug-navy/5"
                          >
                            <Eye className="h-3.5 w-3.5" /> View Private Details
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* ════════════════════════════════════════════════
              TAB 3: USER DIRECTORY & MANAGEMENT
              ════════════════════════════════════════════════ */}
          <TabsContent value="users" className="mt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students by name, ID number, email, or hall..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Name & Email</TableHead>
                    <TableHead>Hall & Level</TableHead>
                    <TableHead>Programme</TableHead>
                    <TableHead>Identity Status</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-mono text-xs font-bold">
                        {user.studentId}
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-sm">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </TableCell>
                      <TableCell className="text-xs">
                        {user.hall} (L{user.level})
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {user.programme}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            user.verificationStatus === "verified"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }
                        >
                          {user.verificationStatus.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.accountStatus === "active" ? "outline" : "destructive"}
                        >
                          {user.accountStatus.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {user.verificationStatus !== "verified" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => adminService.verifyUser(user.id)}
                              className="h-8 text-xs gap-1 text-emerald-700"
                            >
                              <UserCheck className="h-3.5 w-3.5" /> Verify ID
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant={user.accountStatus === "active" ? "destructive" : "outline"}
                            onClick={() => adminService.toggleUserStatus(user.id)}
                            className="h-8 text-xs gap-1"
                          >
                            {user.accountStatus === "active" ? (
                              <>
                                <UserX className="h-3.5 w-3.5" /> Suspend
                              </>
                            ) : (
                              "Unsuspend"
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* ════════════════════════════════════════════════
              TAB 4: HANDOVERS & CODE VERIFICATION
              ════════════════════════════════════════════════ */}
          <TabsContent value="handovers" className="mt-6 space-y-6">
            {handoverFeedback && (
              <div
                className={`p-4 rounded-xl border flex items-center justify-between ${
                  handoverFeedback.success
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-red-50 text-red-800 border-red-200"
                }`}
              >
                <div className="flex items-center gap-2 text-sm font-medium">
                  {handoverFeedback.success ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  {handoverFeedback.msg}
                </div>
                <Button size="sm" variant="ghost" onClick={() => setHandoverFeedback(null)}>
                  Dismiss
                </Button>
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-3">
              {/* Handover Code Verification Form */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Key className="h-5 w-5 text-ug-gold" /> Validate Handover Code
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  At official collection point: Claimant provides 1-time verification code (e.g.
                  UG-LF-48213) to confirm handover.
                </p>

                <div className="mt-4 space-y-3">
                  <Input
                    placeholder="Enter Handover Code (e.g. UG-LF-48213)"
                    value={handoverCodeInput}
                    onChange={(e) => setHandoverCodeInput(e.target.value)}
                    className="font-mono text-center text-lg uppercase tracking-wider font-bold"
                  />
                  <Button
                    className="w-full bg-ug-navy text-white hover:bg-ug-navy-light"
                    onClick={() => {
                      const match = handovers.find(
                        (h) =>
                          h.verificationCode.toUpperCase() ===
                          handoverCodeInput.trim().toUpperCase(),
                      );
                      if (match) {
                        handleVerifyCodeSubmit(match.id);
                      } else {
                        setHandoverFeedback({
                          success: false,
                          msg: "Handover code not found or invalid.",
                        });
                      }
                    }}
                  >
                    Confirm &amp; Complete Handover
                  </Button>
                </div>
              </div>

              {/* Handover Schedule List */}
              <div className="md:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-base font-bold text-foreground">
                  Scheduled &amp; Completed Handovers
                </h3>
                <div className="mt-4 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Claim Ref</TableHead>
                        <TableHead>Item / Location</TableHead>
                        <TableHead>Owner &amp; Finder</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {handovers.map((h) => (
                        <TableRow key={h.id}>
                          <TableCell className="font-mono text-xs font-bold text-ug-navy">
                            {h.claimReference}
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-xs">{h.itemName}</div>
                            <div className="text-[11px] text-muted-foreground">{h.location}</div>
                          </TableCell>
                          <TableCell className="text-xs">
                            <div>Owner: {h.ownerName}</div>
                            <div className="text-muted-foreground">Finder: {h.finderName}</div>
                          </TableCell>
                          <TableCell className="font-mono text-xs font-bold text-ug-gold">
                            {h.verificationCode}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                h.status === "completed"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-blue-100 text-blue-800"
                              }
                            >
                              {h.status.toUpperCase()}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ════════════════════════════════════════════════
              TAB 5: SYSTEM AUDIT LOGS
              ════════════════════════════════════════════════ */}
          <TabsContent value="audit" className="mt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search audit logs by action, entity ID, user, or details..."
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>Executed By</TableHead>
                    <TableHead>Details &amp; Audit Trail</TableHead>
                    <TableHead className="text-right">IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {log.timestamp}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-[10px] uppercase">
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs font-bold text-ug-navy">
                        {log.entityId}
                      </TableCell>
                      <TableCell className="text-xs font-medium">{log.userName}</TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-md">
                        {log.details}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-right text-muted-foreground">
                        {log.ipAddress}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>

        {/* ════════════════════════════════════════════════
            DIALOG: CLAIM REVIEW & VERIFICATION SCORE BREAKDOWN
            ════════════════════════════════════════════════ */}
        {selectedClaim && (
          <Dialog open={!!selectedClaim} onOpenChange={() => setSelectedClaim(null)}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <div className="flex items-center justify-between gap-2 border-b border-border pb-3">
                  <div>
                    <DialogTitle className="text-lg font-bold text-foreground">
                      Claim Verification Review — {selectedClaim.reference}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                      Submitted by {selectedClaim.claimantName} ({selectedClaim.claimantStudentId})
                      on {selectedClaim.submittedAt}
                    </DialogDescription>
                  </div>
                  <Badge className="text-xs capitalize">
                    {selectedClaim.status.replace("_", " ")}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="space-y-6 pt-2">
                {/* Score Bar & Overall Grade */}
                <div className="rounded-xl border border-border bg-muted/40 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Total Ownership Verification Score
                      </span>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold text-ug-navy">
                          {selectedClaim.verificationScore}%
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {selectedClaim.verificationScore >= 80
                            ? "High Confidence Ownership"
                            : selectedClaim.verificationScore >= 60
                              ? "Medium Confidence - Review Required"
                              : "Low Confidence - Insufficient Proof"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Component Breakdown Bars */}
                  <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-border/60 pt-3 text-xs">
                    <div>
                      <div className="flex justify-between text-muted-foreground mb-1">
                        <span>Identity Match (20%)</span>
                        <span className="font-bold text-foreground">
                          {selectedClaim.scoreBreakdown.identity}/20
                        </span>
                      </div>
                      <Progress
                        value={(selectedClaim.scoreBreakdown.identity / 20) * 100}
                        className="h-1.5"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-muted-foreground mb-1">
                        <span>Description Accuracy (20%)</span>
                        <span className="font-bold text-foreground">
                          {selectedClaim.scoreBreakdown.description}/20
                        </span>
                      </div>
                      <Progress
                        value={(selectedClaim.scoreBreakdown.description / 20) * 100}
                        className="h-1.5"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-muted-foreground mb-1">
                        <span>Unique Marks / Details (20%)</span>
                        <span className="font-bold text-foreground">
                          {selectedClaim.scoreBreakdown.uniqueFeature}/20
                        </span>
                      </div>
                      <Progress
                        value={(selectedClaim.scoreBreakdown.uniqueFeature / 20) * 100}
                        className="h-1.5"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-muted-foreground mb-1">
                        <span>Serial / IMEI Verification (20%)</span>
                        <span className="font-bold text-foreground">
                          {selectedClaim.scoreBreakdown.serialNumber}/20
                        </span>
                      </div>
                      <Progress
                        value={(selectedClaim.scoreBreakdown.serialNumber / 20) * 100}
                        className="h-1.5"
                      />
                    </div>
                  </div>
                </div>

                {/* Question & Answer Responses Comparison */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-ug-navy mb-3">
                    Verification Questions &amp; Answers
                  </h4>
                  <div className="space-y-3">
                    {selectedClaim.responses.map((resp, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-border p-3 bg-card text-xs space-y-1.5"
                      >
                        <div className="font-semibold text-foreground">{resp.question}</div>
                        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/40">
                          <div>
                            <span className="text-[10px] text-muted-foreground block">
                              Claimant Provided Answer:
                            </span>
                            <span className="font-medium text-foreground">{resp.answer}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-muted-foreground block">
                              Private System Expected Record:
                            </span>
                            <span className="font-medium text-ug-navy">{resp.expectedAnswer}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submitted Evidence Documents */}
                {selectedClaim.evidenceFiles.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-ug-navy mb-3">
                      Uploaded Evidence Proofs
                    </h4>
                    <div className="space-y-2">
                      {selectedClaim.evidenceFiles.map((ev) => (
                        <div
                          key={ev.id}
                          className="flex items-center justify-between rounded-lg border border-border p-3 text-xs bg-muted/20"
                        >
                          <div>
                            <div className="font-bold text-foreground">
                              {ev.name} ({ev.type})
                            </div>
                            <div className="text-muted-foreground">{ev.note}</div>
                          </div>
                          <Badge variant="outline">{ev.status}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dispute Rivals Table if Disputed */}
                {selectedClaim.disputeClaimants && (
                  <div className="rounded-xl border border-red-200 bg-red-50/50 p-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-red-800 mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4" /> Disputed Claim: Rival Claimants Listed
                    </h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Claimant Name</TableHead>
                          <TableHead>Student ID</TableHead>
                          <TableHead>Submitted</TableHead>
                          <TableHead>Score</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedClaim.disputeClaimants.map((dc, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-bold text-xs">{dc.claimantName}</TableCell>
                            <TableCell className="text-xs">{dc.studentId}</TableCell>
                            <TableCell className="text-xs">{dc.submittedAt}</TableCell>
                            <TableCell className="font-bold text-xs text-ug-navy">
                              {dc.score}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {/* Moderator Review Notes input */}
                <div>
                  <label className="block text-xs font-bold uppercase text-muted-foreground mb-1.5">
                    Moderator Review Notes
                  </label>
                  <Textarea
                    placeholder="Enter reasoning for approval, rejection, evidence request or dispute flagging..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    className="text-xs"
                  />
                </div>
              </div>

              <DialogFooter className="flex flex-wrap items-center justify-end gap-2 pt-4 border-t border-border">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setClaimActionDialog("dispute");
                  }}
                  className="text-xs text-red-700 hover:bg-red-50"
                >
                  <AlertTriangle className="h-3.5 w-3.5" /> Flag Disputed
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setClaimActionDialog("evidence");
                  }}
                  className="text-xs"
                >
                  Request Evidence
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    setClaimActionDialog("reject");
                  }}
                  className="text-xs"
                >
                  <XCircle className="h-3.5 w-3.5" /> Reject Claim
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setClaimActionDialog("approve");
                  }}
                  className="text-xs bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" /> Approve &amp; Issue Handover
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Action Confirmation Modal */}
        {claimActionDialog && selectedClaim && (
          <Dialog open={!!claimActionDialog} onOpenChange={() => setClaimActionDialog(null)}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="capitalize text-base font-bold">
                  Confirm Claim {claimActionDialog}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Are you sure you want to set claim <strong>{selectedClaim.reference}</strong>{" "}
                  status to <strong>{claimActionDialog}</strong>?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2">
                <Button size="sm" variant="outline" onClick={() => setClaimActionDialog(null)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleExecuteClaimAction}
                  className="bg-ug-navy text-white"
                >
                  Confirm &amp; Record Audit Action
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Private Item Details Modal */}
        {selectedPrivateItem && (
          <Dialog open={!!selectedPrivateItem} onOpenChange={() => setSelectedPrivateItem(null)}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-base font-bold text-ug-navy flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-ug-gold" /> Confidential Private Item Record
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Reference: {selectedPrivateItem.reference} · {selectedPrivateItem.name}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-xs pt-2">
                <div className="rounded-lg border border-border p-3 bg-muted/30">
                  <span className="font-semibold text-foreground block mb-1">
                    Public Description:
                  </span>
                  <p className="text-muted-foreground">{selectedPrivateItem.description}</p>
                </div>
                <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-amber-900">
                  <span className="font-bold block mb-1">
                    🔒 Confidential Private Details (Admin Only):
                  </span>
                  <p className="font-mono text-xs">
                    {selectedPrivateItem.privateDetails || "No specific private details recorded."}
                  </p>
                </div>
                <div className="text-muted-foreground">
                  Reporter: <strong>{selectedPrivateItem.reporter}</strong> (ID:{" "}
                  {selectedPrivateItem.reporterStudentId || "N/A"})
                </div>
              </div>
              <DialogFooter>
                <Button size="sm" variant="outline" onClick={() => setSelectedPrivateItem(null)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AppShell>
  );
}
