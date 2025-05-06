'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { format } from 'date-fns';

interface AuditLogFilters {
  startDate?: string;
  endDate?: string;
  resource?: string;
  action?: string;
  limit: number;
  offset: number;
}

export function AuditLogViewer() {
  const [filters, setFilters] = useState<AuditLogFilters>({
    limit: 50,
    offset: 0,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['auditLogs', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
      const response = await fetch(`/api/audit?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch audit logs');
      return response.json();
    },
  });

  const handleExport = async (format: 'csv' | 'json') => {
    const response = await fetch(`/api/audit?format=${format}`);
    if (!response.ok) throw new Error('Failed to export audit logs');

    if (format === 'csv') {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      const data = await response.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  if (error) {
    return <div className="text-red-500">Error loading audit logs</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        <Input
          type="date"
          placeholder="Start Date"
          onChange={(e) => setFilters(f => ({ ...f, startDate: e.target.value }))}
          className="w-auto"
        />
        <Input
          type="date"
          placeholder="End Date"
          onChange={(e) => setFilters(f => ({ ...f, endDate: e.target.value }))}
          className="w-auto"
        />
        <Select
          onValueChange={(value) => setFilters(f => ({ ...f, resource: value }))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Resource" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="event">Event</SelectItem>
            <SelectItem value="category">Category</SelectItem>
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) => setFilters(f => ({ ...f, action: value }))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="create">Create</SelectItem>
            <SelectItem value="update">Update</SelectItem>
            <SelectItem value="delete">Delete</SelectItem>
          </SelectContent>
        </Select>
        <div className="ml-auto flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleExport('csv')}
          >
            Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport('json')}
          >
            Export JSON
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : data?.logs.map((log: any) => (
              <tr key={log.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(log.createdAt), 'PPpp')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {log.action}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {log.resource} {log.resourceId && `(${log.resourceId})`}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {log.details && (
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(log.details, null, 2)}
                    </pre>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data?.total > filters.limit && (
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="outline"
            onClick={() => setFilters(f => ({ ...f, offset: Math.max(0, (f.offset || 0) - (f.limit || 50)) }))}
            disabled={!filters.offset}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-500">
            Showing {filters.offset + 1} to {Math.min(filters.offset + (filters.limit || 50), data.total)} of {data.total} entries
          </span>
          <Button
            variant="outline"
            onClick={() => setFilters(f => ({ ...f, offset: (f.offset || 0) + (f.limit || 50) }))}
            disabled={filters.offset + (filters.limit || 50) >= data.total}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}