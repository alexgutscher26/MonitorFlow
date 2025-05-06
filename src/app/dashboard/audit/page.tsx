'use client';

import { AuditLogViewer } from '@/components/audit-log-viewer';
import { Heading } from '@/components/heading';

export default function AuditPage() {
  return (
    <div className="space-y-4">
      <Heading title="Audit Logs" description="View and export system activity logs" />
      <AuditLogViewer />
    </div>
  );
}