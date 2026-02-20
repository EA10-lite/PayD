import React, { useEffect, useState } from "react";
import { AutosaveIndicator } from "../components/AutosaveIndicator";
import { useAutosave } from "../hooks/useAutosave";
import { createClaimableBalanceTransaction, generateWallet } from "../services/stellar";
import {
  Button,
  Card,
  Input,
  Select,
  Alert,
} from "@stellar/design-system";

interface PendingClaim {
  id: string;
  employeeName: string;
  amount: string;
  dateScheduled: string;
  claimantPublicKey: string;
  status: string;
}

// Mock employer secret key for simulation purposes
const MOCK_EMPLOYER_SECRET =
  "SD3X5K7G7XV4K5V3M2G5QXH434M3VX6O5P3QVQO3L2PQSQQQQQQQQQQQ";

interface PayrollFormState {
  employeeName: string;
  amount: string;
  frequency: "weekly" | "monthly";
  startDate: string;
}

const initialFormState: PayrollFormState = {
  employeeName: "",
  amount: "",
  frequency: "monthly",
  startDate: "",
};

export default function PayrollScheduler() {
  const [formData, setFormData] = useState<PayrollFormState>(initialFormState);
  const [pendingClaims, setPendingClaims] = useState<PendingClaim[]>(() => {
    const saved = localStorage.getItem("pending-claims");
    if (saved) {
      const parsed = JSON.parse(saved) as unknown;
      return parsed as PendingClaim[];
    }
    return [];
  });
  const [txResult, setTxResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Use the autosave hook
  const { saving, lastSaved, loadSavedData } = useAutosave<PayrollFormState>(
    "payroll-scheduler-draft",
    formData
  );

  // Load saved data on mount
  useEffect(() => {
    const saved = loadSavedData();
    if (saved) {
      setFormData(saved);
    }
  }, [loadSavedData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mockRecipientPublicKey = generateWallet().publicKey;

    const result = createClaimableBalanceTransaction(
      MOCK_EMPLOYER_SECRET,
      mockRecipientPublicKey,
      String(formData.amount),
      "USDC"
    );

    if (result.success) {
      const newClaim: PendingClaim = {
        id: Math.random().toString(36).substr(2, 9),
        employeeName: formData.employeeName,
        amount: formData.amount,
        dateScheduled:
          formData.startDate || new Date().toISOString().split("T")[0],
        claimantPublicKey: mockRecipientPublicKey,
        status: "Pending Claim",
      };
      const updatedClaims = [...pendingClaims, newClaim];
      setPendingClaims(updatedClaims);
      localStorage.setItem("pending-claims", JSON.stringify(updatedClaims));

      setTxResult({
        success: true,
        message: `Claimable balance of ${formData.amount} USDC created for ${formData.employeeName}.`,
      });

      setFormData({ ...initialFormState });
    } else {
      setTxResult({
        success: false,
        message: "Failed to create claimable balance.",
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Page title row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          Payroll <span className="text-[var(--accent)]">Scheduler</span>
        </h1>
        <AutosaveIndicator saving={saving} lastSaved={lastSaved} />
      </div>

      {txResult && (
        <div className="mb-6">
          <Alert
            variant={txResult.success ? "success" : "error"}
            title={txResult.success ? "Success" : "Error"}
            placement="inline"
          >
            {txResult.message}
          </Alert>
        </div>
      )}

      {/* Two-column grid: stacks to 1 column on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Schedule Form ── */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--muted)] font-mono mb-4">
            New Schedule
          </h2>
          <Card>
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
            >
              <Input
                id="employeeName"
                fieldSize="md"
                label="Employee Name"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleChange}
                placeholder="John Doe"
              />

              <Input
                id="amount"
                fieldSize="md"
                label="Amount (USD)"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="5000"
              />

              <Select
                id="frequency"
                fieldSize="md"
                label="Frequency"
                value={formData.frequency}
                onChange={(e) => handleSelectChange("frequency", e.target.value)}
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </Select>

              <Input
                id="startDate"
                fieldSize="md"
                label="Start Date (YYYY-MM-DD)"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                placeholder="2024-01-01"
              />

              <Button id="tour-init-payroll" type="submit" variant="primary" size="md">
                Schedule Payroll
              </Button>
            </form>
          </Card>
        </div>

        {/* ── Pending Claims ── */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--muted)] font-mono mb-4">
            Pending Claims
          </h2>
          <Card>
            {pendingClaims.length === 0 ? (
              <p className="text-[var(--muted)] text-sm text-center py-4">
                No pending claimable balances.
              </p>
            ) : (
              <ul className="flex flex-col gap-3 p-0 m-0 list-none">
                {pendingClaims.map((claim) => (
                  <li
                    key={claim.id}
                    className="border border-[var(--border-hi)] rounded-xl p-4 hover:border-[var(--accent)]/30 transition"
                  >
                    {/* Claim header */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="font-semibold text-sm text-[var(--text)]">
                        {claim.employeeName}
                      </h3>
                      <span className="flex-shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-yellow-900/30 text-yellow-400 border border-yellow-700/30">
                        {claim.status}
                      </span>
                    </div>

                    {/* Claim details */}
                    <div className="flex flex-col gap-1 text-xs text-[var(--muted)]">
                      <div className="flex items-center justify-between">
                        <span>Amount</span>
                        <span className="font-mono text-[var(--text)] font-semibold">
                          {claim.amount} USDC
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Scheduled</span>
                        <span className="font-mono">{claim.dateScheduled}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-1 pt-1 border-t border-[var(--border)]">
                        <span className="flex-shrink-0">To</span>
                        <span
                          className="font-mono text-[10px] truncate"
                          title={claim.claimantPublicKey}
                        >
                          {claim.claimantPublicKey.slice(0, 8)}…{claim.claimantPublicKey.slice(-6)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
