"use client";

// TODO: Add new features to the navbar

import { FeatureFlag } from "./feature-flags/FeatureFlag";
import { Button } from "./ui/button";

export function NewNavbar() {
  return (
    <nav className="w-full bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">PingPanda</h1>
            
            {/* Basic navigation visible to everyone */}
            <Button variant="ghost">Dashboard</Button>
            <Button variant="ghost">Monitors</Button>
            
            {/* New features with percentage rollout */}
            <FeatureFlag flag="new-nav-items" fallback={null}>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" className="text-blue-500">Analytics</Button>
                <Button variant="ghost" className="text-blue-500">Reports</Button>
              </div>
            </FeatureFlag>
            
            {/* Beta features for specific users */}
            <FeatureFlag flag="beta-features">
              <Button variant="outline" className="border-purple-500 text-purple-500">
                Beta Features
              </Button>
            </FeatureFlag>
          </div>
          
          {/* New notification system with percentage rollout */}
          <FeatureFlag flag="new-notifications" fallback={<OldNotifications />}>
            <NewNotifications />
          </FeatureFlag>
        </div>
      </div>
    </nav>
  );
}

function NewNotifications() {
  return (
    <Button variant="outline" className="relative">
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
        3
      </span>
      🔔 New
    </Button>
  );
}

function OldNotifications() {
  return (
    <Button variant="ghost">
      Notifications
    </Button>
  );
}
