import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Save, Plus, Trash2, FolderOpen, FileText } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { nextBillNumber } from "../utils/billNumber";

const STORAGE_KEY = "jdb_drafts_v1";

// NOTE: Drafts are stored in localStorage because this is a client-only app.
// The data (bill numbers, party names, bank details entered by the shop owner
// on their own device) is not sensitive user credentials or auth tokens.
// If multi-user auth is added later, drafts should be persisted server-side.
function readDrafts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeDrafts(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export default function DraftsPanel({ data, setData }) {
  const [drafts, setDrafts] = useState([]);
  const [name, setName] = useState("");
  const [activeId, setActiveId] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    setDrafts(readDrafts());
  }, []);

  const persist = (list) => {
    writeDrafts(list);
    setDrafts(list);
  };

  const saveDraft = () => {
    const draftName = (name || "").trim();
    if (!draftName) {
      toast({ title: "Draft name required", description: "Please enter a name for the draft." });
      return;
    }
    const now = new Date().toISOString();
    let list = [...drafts];
    if (activeId) {
      list = list.map((d) => (d.id === activeId ? { ...d, name: draftName, data, updatedAt: now } : d));
      toast({ title: "Draft updated", description: `\u201C${draftName}\u201D was updated.` });
    } else {
      const exists = list.find((d) => d.name.toLowerCase() === draftName.toLowerCase());
      if (exists) {
        list = list.map((d) => (d.id === exists.id ? { ...d, data, updatedAt: now } : d));
        setActiveId(exists.id);
        toast({ title: "Draft overwritten", description: `\u201C${draftName}\u201D was overwritten.` });
      } else {
        const id = `d_${Date.now()}`;
        list.unshift({ id, name: draftName, data, createdAt: now, updatedAt: now });
        setActiveId(id);
        toast({ title: "Draft saved", description: `\u201C${draftName}\u201D is now in your drafts.` });
      }
    }
    persist(list);
  };

  const saveAsNew = () => {
    const draftName = (name || "").trim() || `Draft ${drafts.length + 1}`;
    const id = `d_${Date.now()}`;
    const now = new Date().toISOString();
    // Assign next bill number so duplicates don't collide
    const usedBillNos = drafts.map((d) => d?.data?.bill?.billNo).filter(Boolean);
    const nextNo = nextBillNumber(usedBillNos);
    const newData = { ...data, bill: { ...data.bill, billNo: nextNo } };
    const list = [{ id, name: draftName, data: newData, createdAt: now, updatedAt: now }, ...drafts];
    persist(list);
    setActiveId(id);
    setName(draftName);
    setData(newData);
    toast({ title: "Saved as new draft", description: `\u201C${draftName}\u201D \u2022 Bill ${nextNo}` });
  };

  const loadDraft = (d) => {
    setData(d.data);
    setName(d.name);
    setActiveId(d.id);
    toast({ title: "Draft loaded", description: `\u201C${d.name}\u201D is now active.` });
  };

  const deleteDraft = (id) => {
    if (!window.confirm("Delete this draft?")) return;
    const list = drafts.filter((d) => d.id !== id);
    persist(list);
    if (activeId === id) {
      setActiveId(null);
      setName("");
    }
    toast({ title: "Draft deleted" });
  };

  const newBlank = () => {
    setActiveId(null);
    setName("");
    // Auto-generate next bill number for a fresh draft
    const usedBillNos = drafts.map((d) => d?.data?.bill?.billNo).filter(Boolean);
    const nextNo = nextBillNumber(usedBillNos);
    setData((prev) => ({
      ...prev,
      bill: { ...prev.bill, billNo: nextNo },
    }));
    toast({ title: "New bill started", description: `Bill No. auto-set to ${nextNo}` });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="px-5 py-3 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white flex items-center justify-between">
        <h3 className="font-semibold text-slate-800 text-xs tracking-[0.15em] uppercase flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-amber-600" />
          Drafts
        </h3>
        {activeId && (
          <button
            onClick={newBlank}
            className="text-[11px] font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3 h-3" /> New Bill
          </button>
        )}
      </div>
      <div className="p-5 space-y-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-slate-600 uppercase tracking-wide">Draft name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Dr Geetanjali Hospital — Bill 1"
          />
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={saveDraft} className="bg-slate-900 hover:bg-slate-800 flex-1">
            <Save className="w-4 h-4 mr-1.5" />
            {activeId ? "Update draft" : "Save draft"}
          </Button>
          <Button size="sm" variant="outline" onClick={saveAsNew}>
            <Plus className="w-4 h-4 mr-1" /> New
          </Button>
        </div>

        <div className="border-t border-slate-200 pt-4">
          {drafts.length === 0 ? (
            <div className="text-xs text-slate-500 italic text-center py-4">No saved drafts yet.</div>
          ) : (
            <ul className="space-y-1.5 max-h-56 overflow-auto pr-1">
              {drafts.map((d) => (
                <li
                  key={d.id}
                  className={`group flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border transition-colors cursor-pointer ${
                    activeId === d.id
                      ? "bg-amber-50 border-amber-300"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                  }`}
                  onClick={() => loadDraft(d)}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-slate-800 truncate">{d.name}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {d?.data?.bill?.billNo || "—"} • {new Date(d.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteDraft(d.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 transition-opacity"
                    aria-label="Delete draft"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
