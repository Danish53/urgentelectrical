import AccountPageShell from "@/components/account/AccountPageShell";

export const metadata = {
  title: "Sites | Urgent Electrical",
  robots: { index: false, follow: false },
};

export default function AccountSitesPage() {
  return (
    <AccountPageShell
      title="Sites"
      description="Manage your saved job sites and addresses for faster booking."
    >
      <div className="rounded-2xl border border-[#e8e8e8] bg-white p-6 text-[#6b7280] text-sm">
        No sites saved yet.
      </div>
    </AccountPageShell>
  );
}
