// Real skeletons used while seating/dealing and while the ledger loads.

export function ClaimSkeleton() {
  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="hairline bg-ink-800 px-8 py-10 shadow-spot">
        <div className="mb-5 flex items-center justify-between">
          <div className="skel h-3 w-20" />
          <div className="skel h-3 w-24" />
        </div>
        <div className="space-y-3">
          <div className="skel h-7 w-full" />
          <div className="skel h-7 w-5/6" />
          <div className="skel h-7 w-2/3" />
        </div>
        <div className="mt-6 border-t border-bone-200/10 pt-4">
          <div className="skel h-3 w-28" />
        </div>
      </div>
    </div>
  );
}

export function LedgerRowSkeleton() {
  return (
    <div className="hairline flex items-center gap-4 bg-ink-800 px-4 py-3">
      <div className="skel h-8 w-8" />
      <div className="flex-1 space-y-2">
        <div className="skel h-3 w-3/4" />
        <div className="skel h-2 w-1/3" />
      </div>
      <div className="skel h-6 w-16" />
    </div>
  );
}
