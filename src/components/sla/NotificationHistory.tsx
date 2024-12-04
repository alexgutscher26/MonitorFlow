/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface Notification {
  id: string;
  slaId: string;
  type: "WARNING" | "CRITICAL" | "RECOVERY";
  message: string;
  status: "PENDING" | "DELIVERED" | "FAILED";
  createdAt: Date;
  deliveredAt?: Date;
  error?: string;
}

interface NotificationHistoryProps {
  slaId: string;
}

export function NotificationHistory({ slaId }: NotificationHistoryProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`/api/sla/${slaId}/notifications`);
      if (!response.ok) {
        throw new Error(await response.text() || "Failed to fetch notifications");
      }
      const data = await response.json();
      setNotifications(data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications, slaId]);

  const getStatusBadge = (status: Notification["status"]) => {
    switch (status) {
      case "DELIVERED":
        return (
          <Badge variant="success">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Delivered
          </Badge>
        );
      case "FAILED":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <AlertCircle className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  const getTypeIcon = (type: Notification["type"]) => {
    switch (type) {
      case "WARNING":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "CRITICAL":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "RECOVERY":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Bell className="h-4 w-4 inline-block mr-2" />
            Notification History
          </CardTitle>
          <CardDescription>Loading notifications...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Bell className="h-4 w-4 inline-block mr-2" />
            Notification History
          </CardTitle>
          <CardDescription className="text-red-500">{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Bell className="h-4 w-4 inline-block mr-2" />
          Notification History
        </CardTitle>
        <CardDescription>
          Recent alerts and notifications for this SLA
        </CardDescription>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No notifications yet
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(notification.type)}
                      {notification.type}
                    </div>
                  </TableCell>
                  <TableCell>{notification.message}</TableCell>
                  <TableCell>{getStatusBadge(notification.status)}</TableCell>
                  <TableCell>
                    {format(
                      notification.deliveredAt || notification.createdAt,
                      "PPp"
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
