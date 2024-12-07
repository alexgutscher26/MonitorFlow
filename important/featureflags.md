To use a feature flag in your components

import { useFeatureFlag } from "@/hooks/useFeatureFlag";

function MyComponent() {
const isFeatureEnabled = useFeatureFlag("my-feature-key");

if (!isFeatureEnabled) {
return null;
}

return <div>My Feature</div>;
}

Using the FeatureFlag component for single flags:

import { FeatureFlag } from "@/components/feature-flags/FeatureFlag";

export function MyComponent() {
return (
<FeatureFlag flag="new-ui-redesign" fallback={<OldUI />}>
<NewUI />
</FeatureFlag>
);
}

Using the FeatureFlags component for multiple flags:

import { FeatureFlags } from "@/components/feature-flags/FeatureFlag";

export function MyComponent() {
return (
<FeatureFlags
flags={["new-ui-redesign", "advanced-features"]}
fallback={<BasicVersion />} >
<AdvancedVersion />
</FeatureFlags>
);
}

Using the hook directly for conditional logic:

import { useFeatureFlags } from "@/providers/FeatureFlagProvider";

export function MyComponent() {
const { checkFlag } = useFeatureFlags();

const handleClick = () => {
if (checkFlag("beta-feature")) {
// Do something new
} else {
// Do the old thing
}
};

return (
<button onClick={handleClick}>
{checkFlag("new-labels") ? "New Label" : "Old Label"}
</button>
);
}

First, create your feature flags in the dashboard with appropriate settings:

// Example flags to create
{
key: "new-nav-items",
name: "New Navigation Items",
type: "percentage",
value: { percentage: 30 }, // Show to 30% of users
environment: "production"
}

{
key: "beta-features",
name: "Beta Features Access",
type: "userlist",
value: { users: ["user_123", "user_456"] }, // Only for specific users
environment: "production"
}

{
key: "new-notifications",
name: "New Notification System",
type: "percentage",
value: { percentage: 20 }, // Start with 20% of users
environment: "production"
}
