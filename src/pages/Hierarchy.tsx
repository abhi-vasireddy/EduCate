import React from 'react';

export function Hierarchy() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Organization Hierarchy</h1>
        <p className="text-muted-foreground mt-1">Interactive organizational chart of the school.</p>
      </div>

      <div className="h-[600px] border border-border/50 rounded-xl bg-card flex flex-col items-center justify-center text-center p-8">
         <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-network"><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/></svg>
         </div>
         <h3 className="text-lg font-semibold">Hierarchy visualization coming soon</h3>
         <p className="text-muted-foreground max-w-sm mt-2">
           The interactive drag-and-drop org chart is currently being designed and will use specialized canvas rendering.
         </p>
      </div>
    </div>
  );
}
