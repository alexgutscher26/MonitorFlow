"use client";

import { Event, EventCategory } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { EmptyCategoryState } from "./empty-category-state";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { client } from "@/lib/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpDown, BarChart } from "lucide-react";
import { isAfter, isToday, startOfMonth, startOfWeek, format } from "date-fns";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";
import { Heading } from "@/components/heading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";

type TimeRange = "today" | "week" | "month";

interface CategoryPageContentProps {
  hasEvents: boolean;
  category: EventCategory;
}

interface EventWithFields extends Event {
  fields: Record<string, number | string | boolean>;
}

interface EventResponse {
  events: EventWithFields[];
  eventsCount: number;
}

interface NumericFieldSums {
  total: number;
  thisWeek: number;
  thisMonth: number;
  today: number;
}

const formatDeliveryStatus = (status: string) => {
  const statusStyles = {
    DELIVERED: "bg-green-100 text-green-800",
    FAILED: "bg-red-100 text-red-800",
    PENDING: "bg-yellow-100 text-yellow-800",
  } as const;

  return (
    <span
      className={cn(
        "px-2 py-1 rounded-full text-xs font-semibold",
        statusStyles[status as keyof typeof statusStyles]
      )}
    >
      {status}
    </span>
  );
};

const NumericFieldSumCard = ({
  field,
  sums,
  activeTab,
}: {
  field: string;
  sums: NumericFieldSums;
  activeTab: TimeRange;
}) => {
  const relevantSum =
    activeTab === "today"
      ? sums.today
      : activeTab === "week"
      ? sums.thisWeek
      : sums.thisMonth;

  const timeLabel =
    activeTab === "today"
      ? "today"
      : activeTab === "week"
      ? "this week"
      : "this month";

  return (
    <Card>
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <p className="text-sm/6 font-medium">
          {field.charAt(0).toUpperCase() + field.slice(1)}
        </p>
        <BarChart className="size-4 text-muted-foreground" />
      </div>
      <div>
        <p className="text-2xl font-bold">{relevantSum.toFixed(2)}</p>
        <p className="text-xs/5 text-muted-foreground">{timeLabel}</p>
      </div>
    </Card>
  );
};

export const CategoryPageContent = ({
  hasEvents: initialHasEvents,
  category,
}: CategoryPageContentProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TimeRange>("today");

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "30", 10);

  const [pagination, setPagination] = useState({
    pageIndex: page - 1,
    pageSize: limit,
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { data: pollingData } = useQuery({
    queryKey: ["category", category.name, "hasEvents"],
    initialData: { hasEvents: initialHasEvents },
  });

  const { data, isFetching } = useQuery<EventResponse>({
    queryKey: [
      "events",
      category.name,
      pagination.pageIndex,
      pagination.pageSize,
      activeTab,
    ],
    queryFn: async () => {
      const res = await client.category.getEventsByCategoryName.$get({
        name: category.name,
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        timeRange: activeTab,
      });
      return res.json();
    },
    refetchOnWindowFocus: false,
    enabled: pollingData.hasEvents,
  });

  const eventTrendData = useMemo(() => {
    if (!data?.events) return [];

    return data.events.reduce(
      (acc: { date: string; count: number }[], event) => {
        const date = format(new Date(event.createdAt), "yyyy-MM-dd");
        const existingEntry = acc.find((item) => item.date === date);

        if (existingEntry) {
          existingEntry.count += 1;
        } else {
          acc.push({ date, count: 1 });
        }
        return acc;
      },
      []
    );
  }, [data?.events]);

  const eventDistributionData = useMemo(() => {
    if (!data?.events) return [];

    const fieldCounts = data.events.reduce(
      (acc: Record<string, number>, event) => {
        Object.keys(event.fields).forEach((field) => {
          acc[field] = (acc[field] || 0) + 1;
        });
        return acc;
      },
      {}
    );

    return Object.entries(fieldCounts).map(([name, value]) => ({ name, value }));
  }, [data?.events]);

  const columns = useMemo<ColumnDef<EventWithFields>[]>(() => {
    return [
      {
        accessorKey: "category",
        header: "Category",
        cell: () => <span>{category.name || "Uncategorized"}</span>,
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }
          >
            Date
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        ),
        cell: ({ row }) =>
          new Date(row.getValue("createdAt")).toLocaleString(),
      },
      ...(data?.events[0]
        ? Object.keys(data.events[0].fields).map((field) => ({
            accessorFn: (row: { fields: { [x: string]: string | number | boolean; }; }) => row.fields[field] as string | number | boolean,
            header: field,
            cell: ({ row }: { row: Row<EventWithFields> }) =>
              String(row.original.fields[field] ?? "-"),
          }))
        : []),
      {
        accessorKey: "deliveryStatus",
        header: "Delivery Status",
        cell: ({ row }) =>
          formatDeliveryStatus(row.getValue("deliveryStatus")),
      },
    ];
  }, [category.name, data?.events]);

  const numericFieldSums = useMemo(() => {
    if (!data?.events || data.events.length === 0) return {};

    const sums: Record<string, NumericFieldSums> = {};
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 0 });
    const monthStart = startOfMonth(now);

    data.events.forEach((event) => {
      const eventDate = new Date(event.createdAt);
      Object.entries(event.fields).forEach(([field, value]) => {
        if (typeof value === "number") {
          if (!sums[field]) {
            sums[field] = { total: 0, thisWeek: 0, thisMonth: 0, today: 0 };
          }
          sums[field].total += value;
          if (
            isAfter(eventDate, weekStart) ||
            eventDate.getTime() === weekStart.getTime()
          ) {
            sums[field].thisWeek += value;
          }
          if (
            isAfter(eventDate, monthStart) ||
            eventDate.getTime() === monthStart.getTime()
          ) {
            sums[field].thisMonth += value;
          }
          if (isToday(eventDate)) {
            sums[field].today += value;
          }
        }
      });
    });

    return sums;
  }, [data?.events]);

  const table = useReactTable({
    data: data?.events || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: Math.ceil((data?.eventsCount || 0) / pagination.pageSize),
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("page", (pagination.pageIndex + 1).toString());
    searchParams.set("limit", pagination.pageSize.toString());
    router.push(`?${searchParams.toString()}`, { scroll: false });
  }, [pagination, router]);

  if (!pollingData.hasEvents) {
    return <EmptyCategoryState categoryName={category.name} />;
  }

  return (
    <div className="space-y-6">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as TimeRange)}
      >
        <TabsList className="mb-2">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            <Card className="border-2 border-brand-700">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <p className="text-sm/6 font-medium">Total Events</p>
                <BarChart className="size-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{data?.eventsCount || 0}</p>
                <p className="text-xs/5 text-muted-foreground">
                  Events{" "}
                  {activeTab === "today"
                    ? "today"
                    : activeTab === "week"
                    ? "this week"
                    : "this month"}
                </p>
              </div>
            </Card>

            {Object.entries(numericFieldSums).map(([field, sums]) => (
              <NumericFieldSumCard
                key={field}
                field={field}
                sums={sums}
                activeTab={activeTab}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="w-full flex flex-col gap-4">
            <Heading className="text-3xl">Event Overview</Heading>
          </div>
        </div>

        <Card>
          <div className="px-6 py-4">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {isFetching ? (
                  [...Array(5)].map((_, rowIndex) => (
                    <TableRow key={`skeleton-${rowIndex}`}>
                      {columns.map((column, cellIndex) => (
                        <TableCell key={`${column.id}-${cellIndex}`}>
                          <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage() || isFetching}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage() || isFetching}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
