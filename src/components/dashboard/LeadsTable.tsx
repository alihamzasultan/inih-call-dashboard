import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MoreVertical, ExternalLink, Phone, Mail, MapPin, Calendar, AlertTriangle, Shield, DollarSign, FileText } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lead } from "@/types/lead";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface LeadsTableProps {
  leads: Lead[];
}

export function LeadsTable({ leads }: LeadsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [scoreFilter, setScoreFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const itemsPerPage = 10;

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        lead.contact_name?.toLowerCase().includes(searchLower) ||
        lead.contact_phone?.toLowerCase().includes(searchLower) ||
        lead.contact_email?.toLowerCase().includes(searchLower) ||
        lead.incident_city?.toLowerCase().includes(searchLower) ||
        lead.incident_state?.toLowerCase().includes(searchLower) ||
        lead.incident_type?.toLowerCase().includes(searchLower);

      const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
      const matchesScore = scoreFilter === "all" || lead.lead_score === scoreFilter;

      return matchesSearch && matchesStatus && matchesScore;
    });
  }, [leads, searchTerm, statusFilter, scoreFilter]);

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLeads = filteredLeads.slice(startIndex, startIndex + itemsPerPage);

  const handleViewDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailsModalOpen(true);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    try {
      return format(new Date(dateStr), "MMM dd, yyyy");
    } catch {
      return dateStr;
    }
  };

  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return "—";
    try {
      return format(new Date(dateStr), "MMM dd, yyyy HH:mm");
    } catch {
      return dateStr;
    }
  };

  const getStatusVariant = (status: string | null): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" => {
    if (!status) return "outline";
    const lower = status.toLowerCase();
    if (lower === "new") return "default";
    if (lower === "qualified" || lower === "contacted") return "success";
    if (lower === "rejected" || lower === "closed") return "destructive";
    if (lower === "pending") return "warning";
    return "secondary";
  };

  const getScoreVariant = (score: string | null): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" => {
    if (!score) return "outline";
    const lower = score.toLowerCase();
    if (lower === "green") return "success";
    if (lower === "yellow") return "warning";
    if (lower === "red") return "destructive";
    return "secondary";
  };

  const getScoreLabel = (score: string | null) => {
    if (!score) return "—";
    const lower = score.toLowerCase();
    if (lower === "green") return "High";
    if (lower === "yellow") return "Medium";
    if (lower === "red") return "Low";
    return score;
  };

  const getRoutingVariant = (routing: string | null): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" => {
    if (!routing) return "outline";
    const lower = routing.toLowerCase();
    if (lower === "routed") return "success";
    if (lower === "unrouted") return "warning";
    return "secondary";
  };

  const getChannelIcon = (channel: string | null) => {
    if (!channel) return null;
    if (channel === "call") return <Phone className="h-3 w-3" />;
    if (channel === "form") return <Mail className="h-3 w-3" />;
    return null;
  };

  const formatIncidentType = (type: string | null) => {
    if (!type) return "—";
    return type
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  // Get unique statuses and scores for filters
  const uniqueStatuses = useMemo(() => {
    const statuses = new Set(leads.map((l) => l.status).filter(Boolean));
    return Array.from(statuses) as string[];
  }, [leads]);

  const uniqueScores = useMemo(() => {
    const scores = new Set(leads.map((l) => l.lead_score).filter(Boolean));
    return Array.from(scores) as string[];
  }, [leads]);

  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="space-y-4">
      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="leads-search-input"
            placeholder="Search by name, phone, email, city, state, or type..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
            <SelectTrigger id="leads-status-filter" className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {uniqueStatuses.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={scoreFilter} onValueChange={(v) => { setScoreFilter(v); setCurrentPage(1); }}>
            <SelectTrigger id="leads-score-filter" className="w-[140px]">
              <SelectValue placeholder="Score" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Scores</SelectItem>
              {uniqueScores.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">
                  {s === "green" ? "High" : s === "yellow" ? "Medium" : s === "red" ? "Low" : s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Showing {startIndex + 1}–{Math.min(startIndex + itemsPerPage, filteredLeads.length)} of {filteredLeads.length} leads</span>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Contact / Info</TableHead>
              <TableHead className="whitespace-nowrap">Transcript</TableHead>
              <TableHead className="whitespace-nowrap">Recording</TableHead>
              <TableHead className="whitespace-nowrap">Score</TableHead>
              <TableHead className="whitespace-nowrap text-right">Price</TableHead>
              <TableHead className="whitespace-nowrap">Status</TableHead>
              <TableHead className="whitespace-nowrap">Created</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLeads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <Search className="h-8 w-8 opacity-40" />
                    <p className="text-base font-medium">No calls found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedLeads.map((lead) => (
                <TableRow key={lead.id} className="group hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => handleViewDetails(lead)}>
                  <TableCell className="font-medium whitespace-nowrap">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-semibold text-foreground">
                        {lead.contact_name || lead.contact_phone || "Unknown"}
                      </span>
                      {lead.contact_name && lead.contact_phone && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {lead.contact_phone}
                        </span>
                      )}
                      {lead.contact_email && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <span className="max-w-[140px] truncate">{lead.contact_email}</span>
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {lead.call_transcript ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 gap-1.5"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(lead);
                        }}
                      >
                        <FileText className="h-3.5 w-3.5" />
                        View
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">No transcript</span>
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {lead.call_audio_url ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 gap-1.5"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(lead);
                        }}
                      >
                        <Phone className="h-3.5 w-3.5" />
                        Listen
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">No audio</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getScoreVariant(lead.lead_score)} className="whitespace-nowrap">
                      {getScoreLabel(lead.lead_score)}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-right">
                    <span className="font-semibold text-sm">
                      {lead.lead_price != null ? `$${lead.lead_price.toLocaleString()}` : "—"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(lead.status)} className="whitespace-nowrap capitalize">
                      {lead.status || "—"}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                    {formatDateTime(lead.created_at)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleViewDetails(lead); }}>
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            {getPageNumbers().map((pageNum) => (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  onClick={() => setCurrentPage(pageNum)}
                  isActive={currentPage === pageNum}
                  className="cursor-pointer"
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-sm font-bold text-white">
                {selectedLead?.contact_name?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div>
                <span className="block">{selectedLead?.contact_name || "Unknown Lead"}</span>
                <span className="text-sm font-normal text-muted-foreground">
                  Call Record · {selectedLead?.contact_phone || "N/A"}
                </span>
              </div>
            </DialogTitle>
            <DialogDescription>
              Call ID: {selectedLead?.id?.slice(0, 8)}... · Created {formatDateTime(selectedLead?.created_at ?? null)}
            </DialogDescription>
          </DialogHeader>

          {selectedLead && (
            <ScrollArea className="max-h-[calc(85vh-120px)] px-6 pb-6">
              <div className="space-y-6">
                {/* Call Recording & Transcript Section */}
                {(selectedLead.call_audio_url || selectedLead.call_transcript) && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                      <Phone className="h-4 w-4 text-blue-500" />
                      Call Recording & Transcript
                    </h3>
                    
                    {selectedLead.call_audio_url && (
                      <div className="p-4 bg-muted/50 rounded-lg border border-border/50">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Recording</p>
                        <audio 
                          src={selectedLead.call_audio_url} 
                          controls 
                          className="w-full h-10"
                        >
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    )}

                    {selectedLead.call_transcript && (
                      <div className="p-4 bg-muted/50 rounded-lg border border-border/50">
                        <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-2">
                          <FileText className="h-3 w-3" />
                          Transcript
                        </p>
                        <div className="text-sm leading-relaxed whitespace-pre-wrap max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                          {selectedLead.call_transcript}
                        </div>
                      </div>
                    )}
                    <Separator />
                  </div>
                )}

                {/* Quick Stats Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded-lg border bg-muted/30 p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Score</p>
                    <Badge variant={getScoreVariant(selectedLead.lead_score)} className="text-sm">
                      {getScoreLabel(selectedLead.lead_score)}
                    </Badge>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Price</p>
                    <p className="text-lg font-bold">{selectedLead.lead_price != null ? `$${selectedLead.lead_price.toLocaleString()}` : "—"}</p>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <Badge variant={getStatusVariant(selectedLead.status)} className="capitalize text-sm">
                      {selectedLead.status || "—"}
                    </Badge>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Channel</p>
                    <div className="flex items-center justify-center gap-1.5">
                      {getChannelIcon(selectedLead.channel)}
                      <span className="text-sm font-medium capitalize">{selectedLead.channel || "—"}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Contact Information */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <DetailField label="Name" value={selectedLead.contact_name} />
                    <DetailField label="Phone" value={selectedLead.contact_phone} />
                    <DetailField label="Email" value={selectedLead.contact_email} />
                    <DetailField label="Language" value={selectedLead.language_preference || selectedLead.preferred_language} />
                    <DetailField label="Contact Preference" value={selectedLead.contact_preference} />
                    <DetailField label="Date of Birth" value={selectedLead.date_of_birth} />
                  </div>
                </div>

                <Separator />

                {/* Incident Details */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    Incident Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <DetailField label="Type" value={formatIncidentType(selectedLead.incident_type)} />
                    <DetailField label="Date" value={formatDate(selectedLead.incident_date)} />
                    <DetailField label="City" value={selectedLead.incident_city} />
                    <DetailField label="State" value={selectedLead.incident_state} />
                    <DetailField label="Collision Type" value={selectedLead.collision_type?.replace(/_/g, " ")} />
                    <DetailField label="Client Role" value={selectedLead.client_role} />
                    <DetailField label="At Fault Party" value={selectedLead.at_fault_party || selectedLead.who_is_at_fault} />
                    <DetailField label="Other Vehicle Type" value={selectedLead.other_vehicle_type} />
                  </div>
                  {selectedLead.incident_description && (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Description</p>
                      <p className="text-sm bg-muted px-3 py-2 rounded-md whitespace-pre-wrap">{selectedLead.incident_description}</p>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Injuries & Treatment */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-destructive" />
                    Injuries & Medical Treatment
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <DetailField label="Injuries" value={selectedLead.injuries?.join(", ") || selectedLead.type_of_injury} />
                    <DetailField label="Medical Care" value={selectedLead.medical_care} />
                    <DetailField label="Treatment Started" value={selectedLead.treatment_started} />
                    <DetailField label="Ongoing Treatment" value={selectedLead.ongoing_treatment ? "Yes" : "No"} />
                    <DetailField label="Ambulance Transport" value={selectedLead.ambulance_transport ? "Yes" : "No"} />
                    <DetailField label="Hospitalized" value={selectedLead.hospitalized ? "Yes" : "No"} />
                    <DetailField label="Surgery Performed" value={selectedLead.surgery_performed} />
                    <DetailField label="Surgery Recommended" value={selectedLead.surgery_recommended ? "Yes" : "No"} />
                  </div>
                </div>

                <Separator />

                {/* Vehicle Information */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Vehicle & Property
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <DetailField label="Vehicle" value={[selectedLead.vehicle_year, selectedLead.vehicle_make, selectedLead.vehicle_model].filter(Boolean).join(" ") || null} />
                    <DetailField label="Vehicle Status" value={selectedLead.vehicle_status} />
                    <DetailField label="Vehicle Drivable" value={selectedLead.vehicle_drivable} />
                    <DetailField label="Vehicle Damage" value={selectedLead.vehicle_damage || selectedLead.property_damage_estimate} />
                    <DetailField label="Airbags Deployed" value={selectedLead.airbags_deployed} />
                    <DetailField label="Police Report" value={selectedLead.has_police_report != null ? (selectedLead.has_police_report ? "Yes" : "No") : null} />
                    <DetailField label="Photos Available" value={selectedLead.has_photos != null ? (selectedLead.has_photos ? `Yes (${selectedLead.photo_count})` : "No") : null} />
                    <DetailField label="Witnesses" value={selectedLead.has_witnesses ? `Yes (${selectedLead.witness_count})` : "No"} />
                  </div>
                </div>

                <Separator />

                {/* Insurance */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-success" />
                    Insurance & Legal
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <DetailField label="Other Party Insured" value={selectedLead.other_party_insured} />
                    <DetailField label="Other Party Insurance" value={selectedLead.other_party_insurance_company} />
                    <DetailField label="Consumer Insurance" value={selectedLead.consumer_insurance_carrier} />
                    <DetailField label="At-Fault Insurance" value={selectedLead.at_fault_insurance_carrier} />
                    <DetailField label="Has Insurance Info" value={selectedLead.has_insurance_info} />
                    <DetailField label="Currently Represented" value={selectedLead.currently_represented ? "Yes" : "No"} />
                    <DetailField label="Consulted Other Attorneys" value={selectedLead.consulted_other_attorneys != null ? (selectedLead.consulted_other_attorneys ? "Yes" : "No") : null} />
                    <DetailField label="Lost Wages" value={selectedLead.lost_wages ? "Yes" : "No"} />
                  </div>
                </div>

                <Separator />

                {/* Compliance */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Compliance & Consent
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <DetailField label="TCPA Consent" value={selectedLead.tcpa_consent ? "Yes" : "No"} />
                    <DetailField label="HIPAA Authorization" value={selectedLead.hipaa_authorization ? "Yes" : "No"} />
                    <DetailField label="Terms Accepted" value={selectedLead.terms_accepted ? "Yes" : "No"} />
                    <DetailField label="Privacy Policy" value={selectedLead.privacy_policy_accepted ? "Accepted" : "Not Accepted"} />
                  </div>
                </div>

                <Separator />

                {/* Metadata */}
                <div>
                  <h3 className="text-sm font-semibold mb-3">Metadata</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <DetailField label="Lead ID" value={selectedLead.id} mono />
                    <DetailField label="Source ID" value={selectedLead.source_id} mono />
                    <DetailField label="Routing Status" value={selectedLead.routing_status} />
                    <DetailField label="Metro Area" value={selectedLead.metro_area} />
                    <DetailField label="Created At" value={formatDateTime(selectedLead.created_at)} />
                    <DetailField label="Updated At" value={formatDateTime(selectedLead.updated_at)} />
                    <DetailField label="Submitted At" value={formatDateTime(selectedLead.submitted_at)} />
                    <DetailField label="Active" value={selectedLead.is_active ? "Yes" : "No"} />
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DetailField({ label, value, mono = false }: { label: string; value: string | null | undefined; mono?: boolean }) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className={`text-sm bg-muted px-3 py-2 rounded-md truncate ${mono ? "font-mono text-xs" : ""}`}>
        {value || "—"}
      </p>
    </div>
  );
}
